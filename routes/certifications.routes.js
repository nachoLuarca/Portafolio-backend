const express = require("express");
const { body, param } = require("express-validator");
const { listPublic, create, update, remove } = require("../controllers/certifications.controller");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

const router = express.Router();

const rules = [
  body("name").trim().notEmpty().withMessage("El nombre es requerido.").isLength({ max: 180 }),
  body("issuer").trim().notEmpty().withMessage("El emisor es requerido.").isLength({ max: 160 }),
  body("issue_date").optional({ nullable: true }).isISO8601().withMessage("Fecha inválida."),
  body("credential_url").optional({ checkFalsy: true }).isURL().withMessage("URL inválida."),
  body("display_order").optional().isInt().withMessage("El orden debe ser un número entero.").toInt(),
];

const idRule = [param("id").isInt({ min: 1 }).withMessage("ID inválido.")];

router.get("/certifications", listPublic);
router.post("/admin/certifications", requireAuth, rules, validate, create);
router.put("/admin/certifications/:id", requireAuth, idRule, rules, validate, update);
router.delete("/admin/certifications/:id", requireAuth, idRule, validate, remove);

module.exports = router;
