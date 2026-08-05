const certificationsRepo = require("../repositories/certifications.repository");
const Certification = require("../models/Certification");
const ApiError = require("../utils/ApiError");

async function listAll() {
  const rows = await certificationsRepo.findAll();
  return rows.map((r) => Certification.fromRow(r).toJSON());
}

async function create(data) {
  const row = await certificationsRepo.create(data);
  return Certification.fromRow(row).toJSON();
}

async function update(id, data) {
  const row = await certificationsRepo.update(id, data);
  if (!row) throw ApiError.notFound("Certificación no encontrada.");
  return Certification.fromRow(row).toJSON();
}

async function remove(id) {
  const deleted = await certificationsRepo.remove(id);
  if (!deleted) throw ApiError.notFound("Certificación no encontrada.");
}

module.exports = { listAll, create, update, remove };
