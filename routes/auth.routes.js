const express = require("express");
const { body } = require("express-validator");
const { login, me } = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { loginLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

const loginRules = [
  body("email").trim().isEmail().withMessage("Email inválido.").normalizeEmail(),
  body("password").notEmpty().withMessage("La contraseña es requerida."),
];

router.post("/login", loginLimiter, loginRules, validate, login);
router.get("/me", requireAuth, me);

module.exports = router;
