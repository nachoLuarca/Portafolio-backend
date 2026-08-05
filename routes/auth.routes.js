const express = require("express");
const { body } = require("express-validator");
const { login, me, refresh, logout } = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { loginLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

const loginRules = [
  body("email").trim().isEmail().withMessage("Email inválido.").normalizeEmail(),
  body("password").notEmpty().withMessage("La contraseña es requerida."),
];

const refreshRules = [
  body("refreshToken").notEmpty().withMessage("El refresh token es requerido."),
];

router.post("/login", loginLimiter, loginRules, validate, login);
router.get("/me", requireAuth, me);
router.post("/refresh", loginLimiter, refreshRules, validate, refresh);
router.post("/logout", requireAuth, logout);

module.exports = router;
