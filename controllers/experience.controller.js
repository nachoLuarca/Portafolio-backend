const experienceService = require("../services/experience.service");
const asyncHandler = require("../utils/asyncHandler");

const listPublic = asyncHandler(async (req, res) => {
  res.json(await experienceService.listAll());
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await experienceService.create(req.body));
});

const update = asyncHandler(async (req, res) => {
  res.json(await experienceService.update(req.params.id, req.body));
});

const remove = asyncHandler(async (req, res) => {
  await experienceService.remove(req.params.id);
  res.json({ success: true });
});

module.exports = { listPublic, create, update, remove };
