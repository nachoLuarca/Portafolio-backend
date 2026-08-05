const express = require("express");
const { body, param } = require("express-validator");
const sanitizeHtml = require("sanitize-html");
const {
  listPublic, getBySlug, listAll, create, update, remove,
} = require("../controllers/projects.controller");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

const router = express.Router();

// Solo http/https: evita esquemas peligrosos (javascript:, data:, etc.) en
// campos que el frontend renderiza como enlace (href).
const urlOptions = { protocols: ["http", "https"], require_protocol: true };

// El frontend no renderiza este campo como HTML (no hay dangerouslySetInnerHTML),
// así que se guarda como texto plano — quitamos cualquier etiqueta como defensa
// en profundidad por si eso cambia más adelante.
const stripHtml = (value) => sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();

const rules = [
  body("title").trim().notEmpty().withMessage("El título es requerido.").isLength({ max: 160 }),
  body("summary").optional({ checkFalsy: true }).isLength({ max: 280 }),
  body("description").optional({ checkFalsy: true }).isLength({ max: 20000 }).withMessage("La descripción no puede superar los 20000 caracteres.").customSanitizer(stripHtml),
  body("cover_image_url").optional({ checkFalsy: true }).isURL(urlOptions).withMessage("URL de imagen de portada inválida."),
  body("repo_url").optional({ checkFalsy: true }).isURL(urlOptions).withMessage("URL de repositorio inválida."),
  body("demo_url").optional({ checkFalsy: true }).isURL(urlOptions).withMessage("URL de demo inválida."),
  body("status").optional().isIn(["published", "draft"]).withMessage("Estado inválido."),
  body("featured").optional().isBoolean().withMessage("El campo destacado debe ser verdadero o falso.").toBoolean(),
  body("display_order").optional().isInt().withMessage("El orden debe ser un número entero.").toInt(),
  body("tech_stack").optional().isArray().withMessage("El stack tecnológico debe ser una lista."),
  body("tech_stack.*").optional().isString().trim().isLength({ max: 60 }).withMessage("Cada tecnología debe ser un texto válido."),
];

const idRule = [param("id").isInt({ min: 1 }).withMessage("ID inválido.")];

// Rutas públicas
router.get("/projects", listPublic);
router.get("/projects/:slug", getBySlug);

// Rutas protegidas (panel admin)
router.get("/admin/projects", requireAuth, listAll);
router.post("/admin/projects", requireAuth, rules, validate, create);
router.put("/admin/projects/:id", requireAuth, idRule, rules, validate, update);
router.delete("/admin/projects/:id", requireAuth, idRule, validate, remove);

module.exports = router;
