const express = require("express");
const { body } = require("express-validator");
const { get, update } = require("../controllers/profile.controller");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

const router = express.Router();

// Solo http/https: evita esquemas peligrosos (javascript:, data:, etc.) en
// campos que el frontend renderiza como enlace (href/src).
const urlOptions = { protocols: ["http", "https"], require_protocol: true };

const rules = [
  body("full_name").optional({ checkFalsy: true }).isLength({ max: 160 }),
  body("email").optional({ checkFalsy: true }).isEmail().withMessage("Email inválido."),
  body("avatar_url").optional({ checkFalsy: true }).isURL(urlOptions).withMessage("URL de avatar inválida."),
  body("github_url").optional({ checkFalsy: true }).isURL(urlOptions).withMessage("URL de GitHub inválida."),
  body("linkedin_url").optional({ checkFalsy: true }).isURL(urlOptions).withMessage("URL de LinkedIn inválida."),
  body("cv_url").optional({ checkFalsy: true }).isURL(urlOptions).withMessage("URL de CV inválida."),
  body("skills").optional().isArray().withMessage("Las habilidades deben ser una lista."),
  body("skills.*").optional().isString().trim().isLength({ max: 60 }).withMessage("Cada habilidad debe ser un texto válido."),
];

router.get("/profile", get);
router.put("/admin/profile", requireAuth, rules, validate, update);

module.exports = router;
