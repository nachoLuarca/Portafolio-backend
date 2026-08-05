/**
 * Evita repetir try/catch en cada controlador. Si la función async lanza
 * (incluyendo un ApiError), el error se reenvía a next() y lo atrapa el
 * manejador de errores central de server.js.
 */
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = asyncHandler;
