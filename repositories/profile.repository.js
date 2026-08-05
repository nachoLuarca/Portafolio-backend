const pool = require("../config/db");

async function get() {
  const result = await pool.query("SELECT * FROM profile WHERE id = 1");
  return result.rows[0] || null;
}

async function update(data) {
  const result = await pool.query(
    `UPDATE profile SET
      full_name = COALESCE($1, full_name),
      headline = COALESCE($2, headline),
      bio = COALESCE($3, bio),
      email = COALESCE($4, email),
      location = COALESCE($5, location),
      avatar_url = COALESCE($6, avatar_url),
      github_url = COALESCE($7, github_url),
      linkedin_url = COALESCE($8, linkedin_url),
      cv_url = COALESCE($9, cv_url),
      skills = COALESCE($10, skills),
      updated_at = NOW()
     WHERE id = 1
     RETURNING *`,
    [
      data.full_name, data.headline, data.bio, data.email, data.location,
      data.avatar_url, data.github_url, data.linkedin_url, data.cv_url, data.skills,
    ]
  );
  return result.rows[0];
}

module.exports = { get, update };
