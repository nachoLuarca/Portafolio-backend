const { validationResult } = require("express-validator");

// Se coloca después de las reglas de validación de express-validator en cada ruta.
// Si alguna regla falla, corta la petición con 400 y el detalle de los errores,
// evitando que datos malformados o maliciosos lleguen a los controladores/DB.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Datos inválidos.", details: errors.array() });
  }
  next();
}

module.exports = { validate };
