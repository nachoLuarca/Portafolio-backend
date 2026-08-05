const profileService = require("../services/profile.service");
const asyncHandler = require("../utils/asyncHandler");

const get = asyncHandler(async (req, res) => {
  res.json(await profileService.get());
});

const update = asyncHandler(async (req, res) => {
  res.json(await profileService.update(req.body));
});

module.exports = { get, update };
