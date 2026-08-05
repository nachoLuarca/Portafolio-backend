const certificationsService = require("../services/certifications.service");
const asyncHandler = require("../utils/asyncHandler");

const listPublic = asyncHandler(async (req, res) => {
  res.json(await certificationsService.listAll());
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await certificationsService.create(req.body));
});

const update = asyncHandler(async (req, res) => {
  res.json(await certificationsService.update(req.params.id, req.body));
});

const remove = asyncHandler(async (req, res) => {
  await certificationsService.remove(req.params.id);
  res.json({ success: true });
});

module.exports = { listPublic, create, update, remove };
