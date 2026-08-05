const educationRepo = require("../repositories/education.repository");
const Education = require("../models/Education");
const ApiError = require("../utils/ApiError");

async function listAll() {
  const rows = await educationRepo.findAll();
  return rows.map((r) => Education.fromRow(r).toJSON());
}

async function create(data) {
  const row = await educationRepo.create(data);
  return Education.fromRow(row).toJSON();
}

async function update(id, data) {
  const row = await educationRepo.update(id, data);
  if (!row) throw ApiError.notFound("Registro de educación no encontrado.");
  return Education.fromRow(row).toJSON();
}

async function remove(id) {
  const deleted = await educationRepo.remove(id);
  if (!deleted) throw ApiError.notFound("Registro de educación no encontrado.");
}

module.exports = { listAll, create, update, remove };
