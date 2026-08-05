const messagesRepo = require("../repositories/messages.repository");
const Message = require("../models/Message");
const ApiError = require("../utils/ApiError");

async function submit(data) {
  const { id } = await messagesRepo.create(data);
  return { success: true, id };
}

async function listAll() {
  const rows = await messagesRepo.findAll();
  return rows.map((r) => Message.fromRow(r).toJSON());
}

async function markRead(id) {
  const row = await messagesRepo.markRead(id);
  if (!row) throw ApiError.notFound("Mensaje no encontrado.");
  return Message.fromRow(row).toJSON();
}

async function remove(id) {
  const deleted = await messagesRepo.remove(id);
  if (!deleted) throw ApiError.notFound("Mensaje no encontrado.");
}

module.exports = { submit, listAll, markRead, remove };
