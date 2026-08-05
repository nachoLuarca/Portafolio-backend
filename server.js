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
