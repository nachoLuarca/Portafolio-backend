require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { apiLimiter } = require("./middleware/rateLimiter");

const authRoutes = require("./routes/auth.routes");
const projectsRoutes = require("./routes/projects.routes");
const profileRoutes = require("./routes/profile.routes");
const experienceRoutes = require("./routes/experience.routes");
const educationRoutes = require("./routes/education.routes");
const certificationsRoutes = require("./routes/certifications.routes");
const messagesRoutes = require("./routes/messages.routes");

const app = express();

// Solo confiar en cabeceras X-Forwarded-For (usadas por rateLimiter para
// identificar la IP real del cliente) si TRUST_PROXY está definida
// explícitamente, es decir, si hay un reverse proxy real delante del backend.
// Por defecto (sin proxy, como en el docker-compose actual que expone el
// backend directamente) NO se confía en esa cabecera, para que nadie pueda
// evadir el rate limiter enviándola falsificada directamente a la API.
if (process.env.TRUST_PROXY) {
  // Las variables de entorno siempre son strings: si TRUST_PROXY es un
  // entero (ej. "1" = un solo proxy delante), hay que pasarlo a Express
  // como number — como string sería interpretado como una dirección/rango
  // de IP literal (ej. "loopback", "10.0.0.0/8") y no como conteo de saltos.
  const trustProxyValue = /^\d+$/.test(process.env.TRUST_PROXY)
    ? Number(process.env.TRUST_PROXY)
    : process.env.TRUST_PROXY;
  app.set("trust proxy", trustProxyValue);
}

// Cabeceras de seguridad HTTP (protege contra clickjacking, sniffing de MIME, etc.)
app.use(helmet());

// CORS restringido: solo el frontend configurado puede llamar a la API.
// Sin fallback a "*" — si FRONTEND_URL no está definida, no se refleja
// ningún origin (el navegador bloquea la petición) en vez de abrir la API
// a cualquier sitio por defecto.
app.use(cors({ origin: process.env.FRONTEND_URL }));

// Límite de tamaño del body: evita payloads abusivos.
app.use(express.json({ limit: "100kb" }));

// Límite general de peticiones por IP para toda la API.
app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api", projectsRoutes);
app.use("/api", profileRoutes);
app.use("/api", experienceRoutes);
app.use("/api", educationRoutes);
app.use("/api", certificationsRoutes);
app.use("/api", messagesRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

// Manejo de errores centralizado. Si el error viene de la capa de servicios
// (ApiError, con su propio status), respetamos ese código y mensaje —
// pensado para el usuario. Cualquier otro error (bug, fallo de conexión a
// la BD, etc.) se registra completo en el log del servidor, pero al cliente
// solo le llega un mensaje genérico, nunca detalles internos.
app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor." });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 API escuchando en http://localhost:${PORT}`);
});
