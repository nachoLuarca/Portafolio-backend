const pool = require("../config/db");

async function findAll() {
  const result = await pool.query(
    "SELECT * FROM certifications ORDER BY display_order ASC, issue_date DESC"
  );
  return result.rows;
}

async function create(data) {
  const result = await pool.query(
    `INSERT INTO certifications (name, issuer, issue_date, credential_url, display_order)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [data.name, data.issuer, data.issue_date || null, data.credential_url || "", data.display_order || 0]
  );
  return result.rows[0];
}

async function update(id, data) {
  const result = await pool.query(
    `UPDATE certifications SET
      name = COALESCE($1, name),
      issuer = COALESCE($2, issuer),
      issue_date = $3,
      credential_url = COALESCE($4, credential_url),
      display_order = COALESCE($5, display_order)
     WHERE id = $6 RETURNING *`,
    [data.name, data.issuer, data.issue_date || null, data.credential_url, data.display_order, id]
  );
  return result.rows[0] || null;
}

async function remove(id) {
  const result = await pool.query("DELETE FROM certifications WHERE id = $1 RETURNING id", [id]);
  return result.rows.length > 0;
}

module.exports = { findAll, create, update, remove };
