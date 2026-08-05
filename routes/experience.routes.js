const express = require("express");
const { body, param } = require("express-validator");
const { listPublic, create, update, remove } = require("../controllers/experience.controller");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

const router = express.Router();

const rules = [
  body("company").trim().notEmpty().withMessage("La empresa es requerida.").isLength({ max: 160 }),
  body("role").trim().notEmpty().withMessage("El cargo es requerido.").isLength({ max: 160 }),
  body("start_date").isISO8601().withMessage("Fecha de inicio inválida."),
  body("end_date").optional({ nullable: true }).isISO8601().withMessage("Fecha de fin inválida."),
  body("display_order").optional().isInt().withMessage("El orden debe ser un número entero.").toInt(),
];

const idRule = [param("id").isInt({ min: 1 }).withMessage("ID inválido.")];

router.get("/experience", listPublic);
router.post("/admin/experience", requireAuth, rules, validate, create);
router.put("/admin/experience/:id", requireAuth, idRule, rules, validate, update);
router.delete("/admin/experience/:id", requireAuth, idRule, validate, remove);

module.exports = router;
