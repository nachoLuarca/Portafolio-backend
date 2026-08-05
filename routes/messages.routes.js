const express = require("express");
const { body, param } = require("express-validator");
const { create, listAll, markRead, remove } = require("../controllers/messages.controller");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { contactLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

const contactRules = [
  body("name").trim().notEmpty().withMessage("El nombre es requerido.").isLength({ max: 160 }),
  body("email").trim().isEmail().withMessage("Email inválido.").normalizeEmail(),
  body("subject").optional({ checkFalsy: true }).trim().isLength({ max: 200 }),
  body("body").trim().notEmpty().withMessage("El mensaje no puede estar vacío.").isLength({ max: 4000 }),
  // Campo honeypot: si un bot lo rellena, se descarta silenciosamente como éxito.
  body("website").custom((value) => !value).withMessage("Solicitud inválida."),
];

const idRule = [param("id").isInt({ min: 1 }).withMessage("ID inválido.")];

router.post("/contact", contactLimiter, contactRules, validate, create);

router.get("/admin/messages", requireAuth, listAll);
router.patch("/admin/messages/:id/leido", requireAuth, idRule, validate, markRead);
router.delete("/admin/messages/:id", requireAuth, idRule, validate, remove);

module.exports = router;
