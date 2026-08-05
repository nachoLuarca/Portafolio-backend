const profileRepo = require("../repositories/profile.repository");
const Profile = require("../models/Profile");

async function get() {
  const profile = Profile.fromRow(await profileRepo.get());
  return profile ? profile.toJSON() : {};
}

async function update(data) {
  const row = await profileRepo.update(data);
  return Profile.fromRow(row).toJSON();
}

module.exports = { get, update };
