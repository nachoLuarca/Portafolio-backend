const experienceRepo = require("../repositories/experience.repository");
const Experience = require("../models/Experience");
const ApiError = require("../utils/ApiError");

async function listAll() {
  const rows = await experienceRepo.findAll();
  return rows.map((r) => Experience.fromRow(r).toJSON());
}

async function create(data) {
  const row = await experienceRepo.create(data);
  return Experience.fromRow(row).toJSON();
}

async function update(id, data) {
  const row = await experienceRepo.update(id, data);
  if (!row) throw ApiError.notFound("Registro de experiencia no encontrado.");
  return Experience.fromRow(row).toJSON();
}

async function remove(id) {
  const deleted = await experienceRepo.remove(id);
  if (!deleted) throw ApiError.notFound("Registro de experiencia no encontrado.");
}

module.exports = { listAll, create, update, remove };
