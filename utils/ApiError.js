/**
 * Error de aplicación con un código HTTP asociado. Los servicios lanzan esto
 * cuando una regla de negocio falla (credenciales inválidas, recurso no
 * encontrado, etc.). El manejador de errores central en server.js lo detecta
 * y responde con el status correcto — los controladores no necesitan un
 * if/else por cada caso de error.
 */
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }

  static badRequest(message) { return new ApiError(400, message); }
  static unauthorized(message) { return new ApiError(401, message); }
  static notFound(message) { return new ApiError(404, message); }
}

module.exports = ApiError;
