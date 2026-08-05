const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

async function init() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  try {
    await pool.query(schema);
    console.log("✅ Esquema de base de datos creado/actualizado correctamente.");
  } catch (err) {
    console.error("❌ Error creando el esquema:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

init();
