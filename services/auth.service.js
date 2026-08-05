const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usersRepo = require("../repositories/users.repository");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

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

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return { token, user: user.toJSON() };
}

module.exports = { login };
