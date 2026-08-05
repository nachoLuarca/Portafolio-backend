require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const usersRepo = require("../repositories/users.repository");

async function resetAdminPassword() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("❌ Define ADMIN_EMAIL y ADMIN_PASSWORD en tu archivo .env antes de rotar la contraseña.");
    process.exit(1);
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const updated = await usersRepo.updatePasswordHash(email, passwordHash);

    if (!updated) {
      console.error(`❌ No existe ningún usuario con el email ${email}.`);
      process.exitCode = 1;
      return;
    }

    console.log(`✅ Contraseña actualizada para: ${updated.email}`);
  } catch (err) {
    console.error("❌ Error actualizando la contraseña:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

resetAdminPassword();
