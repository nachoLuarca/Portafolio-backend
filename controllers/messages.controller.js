const messagesService = require("../services/messages.service");
const asyncHandler = require("../utils/asyncHandler");

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await messagesService.submit(req.body));
});

const listAll = asyncHandler(async (req, res) => {
  res.json(await messagesService.listAll());
});

const markRead = asyncHandler(async (req, res) => {
  res.json(await messagesService.markRead(req.params.id));
});

const remove = asyncHandler(async (req, res) => {
  await messagesService.remove(req.params.id);
  res.json({ success: true });
});

module.exports = { create, listAll, markRead, remove };
