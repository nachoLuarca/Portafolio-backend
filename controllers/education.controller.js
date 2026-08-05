const educationService = require("../services/education.service");
const asyncHandler = require("../utils/asyncHandler");

const listPublic = asyncHandler(async (req, res) => {
  res.json(await educationService.listAll());
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await educationService.create(req.body));
});

const update = asyncHandler(async (req, res) => {
  res.json(await educationService.update(req.params.id, req.body));
});

const remove = asyncHandler(async (req, res) => {
  await educationService.remove(req.params.id);
  res.json({ success: true });
});

module.exports = { listPublic, create, update, remove };
