const jwt = require("jsonwebtoken");
const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");

// Además del mensaje en español (para mostrar al usuario), toda respuesta 401
// de este middleware lleva un "code" machine-readable: el frontend lo usa
// para decidir si vale la pena intentar /auth/refresh ("token_expired") o si
// debe forzar el login de nuevo directamente ("unauthorized").
function unauthorized(res, message, code) {
  return res.status(401).json({ error: message, code });
}

const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return unauthorized(res, "No autenticado. Falta el token.", "unauthorized");
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return unauthorized(res, "Tu sesión expiró.", "token_expired");
    }
    return unauthorized(res, "Token inválido.", "unauthorized");
  }

  // Firma y expiración válidas no bastan: el token pudo haber sido
  // revocado explícitamente (logout) antes de su expiración natural.
  if (await authService.isRevoked(payload.jti)) {
    return unauthorized(res, "Sesión cerrada.", "unauthorized");
  }

  req.user = payload;
  next();
});

module.exports = { requireAuth };
