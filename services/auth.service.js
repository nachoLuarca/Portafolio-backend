const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usersRepo = require("../repositories/users.repository");
const revokedTokensRepo = require("../repositories/revokedTokens.repository");
const refreshTokensRepo = require("../repositories/refreshTokens.repository");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

// Access token: vida corta, es el que viaja en cada request (Authorization header).
// Refresh token: vida larga, firmado con un secreto distinto y solo se usa
// contra /auth/refresh para obtener un access token nuevo sin volver a loguearse.
function signAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m", jwtid: crypto.randomUUID() }
  );
}

function signRefreshToken(user) {
  const jti = crypto.randomUUID();
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
  const token = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn,
    jwtid: jti,
  });
  const decoded = jwt.decode(token);
  return { token, jti, expiresAt: new Date(decoded.exp * 1000) };
}

async function login(email, password) {
  const row = await usersRepo.findByEmail(email);
  const user = User.fromRow(row);

  // Mismo mensaje de error si el usuario no existe o la contraseña no
  // coincide — no revelamos cuál de las dos cosas falló (evita que un
  // atacante use el endpoint para enumerar emails registrados).
  if (!user) {
    throw ApiError.unauthorized("Credenciales inválidas.");
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw ApiError.unauthorized("Credenciales inválidas.");
  }

  const token = signAccessToken(user);
  const refresh = signRefreshToken(user);
  await refreshTokensRepo.create(refresh.jti, user.id, refresh.expiresAt);

  return { token, refreshToken: refresh.token, user: user.toJSON() };
}

// Cambia un refresh token vigente por un access token nuevo. No rota el
// refresh token: sigue siendo válido hasta su expiración natural o logout.
async function refresh(refreshToken) {
  if (!refreshToken) {
    throw ApiError.unauthorized("Falta el refresh token.");
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw ApiError.unauthorized("Refresh token inválido o expirado.");
  }

  const valid = await refreshTokensRepo.isValid(payload.jti);
  if (!valid) {
    throw ApiError.unauthorized("Refresh token inválido o expirado.");
  }

  const row = await usersRepo.findById(payload.id);
  const user = User.fromRow(row);
  if (!user) {
    throw ApiError.unauthorized("Refresh token inválido o expirado.");
  }

  return { token: signAccessToken(user) };
}

// Marca el access token actual como revocado hasta su expiración natural (exp,
// en segundos desde epoch, tal como lo pone jsonwebtoken en el payload), y
// revoca también el refresh token asociado para que no se puedan pedir más
// access tokens con él.
async function logout(jti, exp, refreshToken) {
  if (jti) {
    const expiresAt = exp ? new Date(exp * 1000) : new Date(Date.now() + 24 * 60 * 60 * 1000);
    await revokedTokensRepo.revoke(jti, expiresAt);
  }

  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      await refreshTokensRepo.revoke(payload.jti);
    } catch (err) {
      // Refresh token ya inválido/expirado: no hay nada que revocar.
    }
  }
}

async function isRevoked(jti) {
  if (!jti) return false;
  return revokedTokensRepo.isRevoked(jti);
}

module.exports = { login, refresh, logout, isRevoked };
