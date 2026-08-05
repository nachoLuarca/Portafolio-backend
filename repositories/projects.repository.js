const pool = require("../config/db");

async function findPublished() {
  const result = await pool.query(
    `SELECT id, title, slug, summary, cover_image_url, tech_stack, repo_url, demo_url, featured, display_order, created_at
     FROM projects WHERE status = 'published'
     ORDER BY display_order ASC, created_at DESC`
  );
  return result.rows;
}

async function findPublishedBySlug(slug) {
  const result = await pool.query(
    "SELECT * FROM projects WHERE slug = $1 AND status = 'published'",
    [slug]
  );
  return result.rows[0] || null;
}

async function findAll() {
  const result = await pool.query(
    "SELECT * FROM projects ORDER BY display_order ASC, created_at DESC"
  );
  return result.rows;
}

async function create(data) {
  const result = await pool.query(
    `INSERT INTO projects
      (title, slug, summary, description, cover_image_url, tech_stack, repo_url, demo_url, featured, status, display_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      data.title, data.slug, data.summary || "", data.description || "", data.cover_image_url || "",
      data.tech_stack || [], data.repo_url || "", data.demo_url || "",
      !!data.featured, data.status || "published", data.display_order || 0,
    ]
  );
  return result.rows[0];
}

async function update(id, data) {
  const result = await pool.query(
    `UPDATE projects SET
      title = COALESCE($1, title),
      summary = COALESCE($2, summary),
      description = COALESCE($3, description),
      cover_image_url = COALESCE($4, cover_image_url),
      tech_stack = COALESCE($5, tech_stack),
      repo_url = COALESCE($6, repo_url),
      demo_url = COALESCE($7, demo_url),
      featured = COALESCE($8, featured),
      status = COALESCE($9, status),
      display_order = COALESCE($10, display_order),
      updated_at = NOW()
     WHERE id = $11
     RETURNING *`,
    [
      data.title, data.summary, data.description, data.cover_image_url, data.tech_stack,
      data.repo_url, data.demo_url, data.featured, data.status, data.display_order, id,
    ]
  );
  return result.rows[0] || null;
}

async function remove(id) {
  const result = await pool.query("DELETE FROM projects WHERE id = $1 RETURNING id", [id]);
  return result.rows.length > 0;
}

module.exports = { findPublished, findPublishedBySlug, findAll, create, update, remove };
