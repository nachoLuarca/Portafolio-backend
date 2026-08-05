const rateLimit = require("express-rate-limit");

// Limita intentos de login: 10 intentos por IP cada 15 minutos.
// Mitiga ataques de fuerza bruta contra el panel de administración.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de inicio de sesión. Intenta de nuevo en unos minutos." },
});

// Limita el formulario de contacto público: 5 mensajes por IP cada 10 minutos.
// Mitiga spam/abuso del endpoint público de mensajes.
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Has enviado demasiados mensajes. Intenta de nuevo más tarde." },
});

// Límite general para toda la API: 300 peticiones por IP cada 15 minutos.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter, contactLimiter, apiLimiter };
