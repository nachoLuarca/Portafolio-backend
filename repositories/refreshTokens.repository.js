const pool = require("../config/db");

async function create(jti, userId, expiresAt) {
  await pool.query(
    "INSERT INTO refresh_tokens (jti, user_id, expires_at) VALUES ($1,$2,$3)",
    [jti, userId, expiresAt]
  );
}

async function isValid(jti) {
  const result = await pool.query(
    "SELECT 1 FROM refresh_tokens WHERE jti = $1 AND revoked_at IS NULL AND expires_at > NOW()",
    [jti]
  );
  return result.rows.length > 0;
}

async function revoke(jti) {
  await pool.query(
    "UPDATE refresh_tokens SET revoked_at = NOW() WHERE jti = $1 AND revoked_at IS NULL",
    [jti]
  );
}

module.exports = { create, isValid, revoke };
