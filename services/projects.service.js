const projectsRepo = require("../repositories/projects.repository");
const Project = require("../models/Project");
const ApiError = require("../utils/ApiError");

async function listPublished() {
  const rows = await projectsRepo.findPublished();
  return rows.map((r) => Project.fromRow(r).toJSON());
}

async function getPublishedBySlug(slug) {
  const project = Project.fromRow(await projectsRepo.findPublishedBySlug(slug));
  if (!project) throw ApiError.notFound("Proyecto no encontrado.");
  return project.toJSON();
}

async function listAll() {
  const rows = await projectsRepo.findAll();
  return rows.map((r) => Project.fromRow(r).toJSON());
}

async function create(data) {
  if (!data.title || !data.title.trim()) {
    throw ApiError.badRequest("El título es requerido.");
  }
  // Generar el slug es una regla de negocio del dominio "Proyecto",
  // no un detalle de cómo se guarda — por eso vive en el modelo, y el
  // servicio es quien decide cuándo aplicarla (solo al crear).
  const slug = Project.generateSlug(data.title);
  const row = await projectsRepo.create({ ...data, slug });
  return Project.fromRow(row).toJSON();
}

async function update(id, data) {
  const row = await projectsRepo.update(id, data);
  if (!row) throw ApiError.notFound("Proyecto no encontrado.");
  return Project.fromRow(row).toJSON();
}

async function remove(id) {
  const deleted = await projectsRepo.remove(id);
  if (!deleted) throw ApiError.notFound("Proyecto no encontrado.");
}

module.exports = { listPublished, getPublishedBySlug, listAll, create, update, remove };
