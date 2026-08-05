const pool = require("../config/db");

async function create(data) {
  const result = await pool.query(
    `INSERT INTO messages (name, email, subject, body) VALUES ($1,$2,$3,$4) RETURNING id, created_at`,
    [data.name, data.email, data.subject || "", data.body]
  );
  return result.rows[0];
}

async function findAll() {
  const result = await pool.query("SELECT * FROM messages ORDER BY is_read ASC, created_at DESC");
  return result.rows;
}

async function markRead(id) {
  const result = await pool.query("UPDATE messages SET is_read = TRUE WHERE id = $1 RETURNING *", [id]);
  return result.rows[0] || null;
}

async function remove(id) {
  const result = await pool.query("DELETE FROM messages WHERE id = $1 RETURNING id", [id]);
  return result.rows.length > 0;
}

module.exports = { create, findAll, markRead, remove };
