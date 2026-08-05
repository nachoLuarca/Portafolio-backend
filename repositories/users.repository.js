const pool = require("../config/db");

async function findByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] || null;
}

async function findById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function create({ name, email, passwordHash }) {
  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, name, email, created_at",
    [name, email, passwordHash]
  );
  return result.rows[0];
}

async function updatePasswordHash(email, passwordHash) {
  const result = await pool.query(
    "UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, name, email, created_at",
    [passwordHash, email]
  );
  return result.rows[0] || null;
}

module.exports = { findByEmail, findById, create, updatePasswordHash };
