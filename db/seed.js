require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const usersRepo = require("../repositories/users.repository");

async function seed() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    console.error("❌ Define ADMIN_EMAIL y ADMIN_PASSWORD en tu archivo .env antes de sembrar el usuario admin.");
    process.exit(1);
  }

  try {
    const existing = await usersRepo.findByEmail(email);
    if (existing) {
      console.log("ℹ️ Ya existe un usuario con ese email. No se creó ninguno nuevo.");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await usersRepo.create({ name, email, passwordHash });

    console.log(`✅ Usuario admin creado: ${email}`);
  } catch (err) {
    console.error("❌ Error creando el usuario admin:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
