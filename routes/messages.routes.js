const express = require("express");
const { body, param } = require("express-validator");
const sanitizeHtml = require("sanitize-html");
const { create, listAll, markRead, remove } = require("../controllers/messages.controller");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { contactLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Quita cualquier etiqueta/atributo HTML de campos de texto libre enviados
// por el formulario público de contacto. Defensa en profundidad contra XSS
// almacenado: hoy el frontend (React) ya escapa al renderizar, pero este
// endpoint es público y no controlado, así que el dato no debería guardarse
// con HTML/scripts incrustados en primer lugar.
const stripHtml = (value) => sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();

const contactRules = [
  body("name").trim().notEmpty().withMessage("El nombre es requerido.").isLength({ max: 160 }).customSanitizer(stripHtml),
  body("email").trim().isEmail().withMessage("Email inválido.").normalizeEmail(),
  body("subject").optional({ checkFalsy: true }).trim().isLength({ max: 200 }).customSanitizer(stripHtml),
  body("body").trim().notEmpty().withMessage("El mensaje no puede estar vacío.").isLength({ max: 4000 }).customSanitizer(stripHtml),
  // Campo honeypot: si un bot lo rellena, se descarta silenciosamente como éxito.
  body("website").custom((value) => !value).withMessage("Solicitud inválida."),
];

const idRule = [param("id").isInt({ min: 1 }).withMessage("ID inválido.")];

router.post("/contact", contactLimiter, contactRules, validate, create);

router.get("/admin/messages", requireAuth, listAll);
router.patch("/admin/messages/:id/leido", requireAuth, idRule, validate, markRead);
router.delete("/admin/messages/:id", requireAuth, idRule, validate, remove);

module.exports = router;
