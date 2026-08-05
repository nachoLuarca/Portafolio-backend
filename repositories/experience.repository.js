const pool = require("../config/db");

async function findAll() {
  const result = await pool.query(
    "SELECT * FROM work_experience ORDER BY display_order ASC, start_date DESC"
  );
  return result.rows;
}

async function create(data) {
  const result = await pool.query(
    `INSERT INTO work_experience (company, role, location, start_date, end_date, description, display_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [data.company, data.role, data.location || "", data.start_date, data.end_date || null, data.description || "", data.display_order || 0]
  );
  return result.rows[0];
}

async function update(id, data) {
  const result = await pool.query(
    `UPDATE work_experience SET
      company = COALESCE($1, company),
      role = COALESCE($2, role),
      location = COALESCE($3, location),
      start_date = COALESCE($4, start_date),
      end_date = $5,
      description = COALESCE($6, description),
      display_order = COALESCE($7, display_order),
      updated_at = NOW()
     WHERE id = $8 RETURNING *`,
    [data.company, data.role, data.location, data.start_date, data.end_date || null, data.description, data.display_order, id]
  );
  return result.rows[0] || null;
}

async function remove(id) {
  const result = await pool.query("DELETE FROM work_experience WHERE id = $1 RETURNING id", [id]);
  return result.rows.length > 0;
}

module.exports = { findAll, create, update, remove };
