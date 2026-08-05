const projectsService = require("../services/projects.service");
const asyncHandler = require("../utils/asyncHandler");

const listPublic = asyncHandler(async (req, res) => {
  res.json(await projectsService.listPublished());
});

const getBySlug = asyncHandler(async (req, res) => {
  res.json(await projectsService.getPublishedBySlug(req.params.slug));
});

const listAll = asyncHandler(async (req, res) => {
  res.json(await projectsService.listAll());
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await projectsService.create(req.body));
});

const update = asyncHandler(async (req, res) => {
  res.json(await projectsService.update(req.params.id, req.body));
});

const remove = asyncHandler(async (req, res) => {
  await projectsService.remove(req.params.id);
  res.json({ success: true });
});

module.exports = { listPublic, getBySlug, listAll, create, update, remove };
