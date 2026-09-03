const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

// Best-effort: si el SMTP no está configurado o falla el envío, no lanza —
// el mensaje de contacto ya quedó guardado en la BD, que es lo que importa.
async function sendContactNotification({ name, email, subject, body }) {
  const t = getTransporter();
  if (!t) {
    console.warn("SMTP no configurado (SMTP_USER/SMTP_PASS); se omite el envío de notificación por correo.");
    return;
  }

  try {
    await t.sendMail({
      from: `"Portafolio" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `[Contacto portafolio] ${subject || "Nuevo mensaje"}`,
      text: `De: ${name} <${email}>\n\n${body}`,
    });
  } catch (err) {
    console.error("Error enviando notificación de contacto por correo:", err);
  }
}

module.exports = { sendContactNotification };
