const pool = require("../config/db");

async function revoke(jti, expiresAt) {
  // Limpieza oportunista de tokens ya expirados por su cuenta: evita que la
  // tabla crezca indefinidamente sin necesitar un job programado aparte.
  await pool.query("DELETE FROM revoked_tokens WHERE expires_at < NOW()");
  await pool.query(
    "INSERT INTO revoked_tokens (jti, expires_at) VALUES ($1,$2) ON CONFLICT (jti) DO NOTHING",
    [jti, expiresAt]
  );
}

async function isRevoked(jti) {
  const result = await pool.query(
    "SELECT 1 FROM revoked_tokens WHERE jti = $1 AND expires_at > NOW()",
    [jti]
  );
  return result.rows.length > 0;
}

module.exports = { revoke, isRevoked };
