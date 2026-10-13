# Portfolio Backend

API REST para un portafolio profesional (CRUD de proyectos, perfil, experiencia, educación, certificaciones y mensajes) con panel de administración autenticado.

## Stack

Node.js + Express + PostgreSQL, con autenticación JWT (access + refresh token).

## Arquitectura

Capas estrictas: `routes/` → `controllers/` → `services/` → `repositories/` → PostgreSQL, con `models/` para las entidades del dominio. Cada capa solo habla con la siguiente; el SQL vive únicamente en `repositories/`.

## Requisitos

- Node.js 20+
- PostgreSQL 16 (o Docker)

## Configuración

```bash
cp .env.example .env   # completar DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, ADMIN_*
npm install
npm run db:init         # crea las tablas desde db/schema.sql
npm run db:seed         # crea el usuario admin con las variables ADMIN_* del .env
```

## Uso

```bash
npm run dev     # servidor con recarga automática (nodemon), puerto 4000
npm start       # modo producción
```

### Con Docker

`docker-compose.yml` levanta el backend y un Postgres 16 (servicio `db`, datos en el volumen `portfolio_pgdata`). Dentro de la red de compose el backend se conecta a la base por el nombre del servicio (`db`), así que no hace falta cambiar el `DATABASE_URL` del `.env`: compose lo reemplaza. Define además `POSTGRES_PASSWORD` en el `.env`.

```bash
cp .env.example .env                           # completar POSTGRES_PASSWORD, JWT_*, ADMIN_*
docker compose up -d --build                   # levanta db y backend
docker compose exec backend npm run db:init    # primera vez: crea las tablas
docker compose exec backend npm run db:seed    # primera vez: crea el usuario admin
docker compose down                            # detiene todo (los datos se conservan en el volumen)
```

## Endpoints

| Recurso | Base |
|---|---|
| Autenticación | `/api/auth` |
| Perfil | `/api/profile` |
| Proyectos | `/api/projects` |
| Experiencia | `/api/experience` |
| Educación | `/api/education` |
| Certificaciones | `/api/certifications` |
| Mensajes de contacto (formulario público) | `POST /api/contact` |
| Mensajes de contacto (administración) | `/api/admin/messages` |

Las rutas bajo `/api/admin/*` requieren autenticación (`requireAuth`).

## Scripts

| Comando | Descripción |
|---|---|
| `npm run db:init` | Crea/actualiza las tablas desde `db/schema.sql` |
| `npm run db:seed` | Crea el usuario admin inicial |
| `npm run db:seed:content` | Carga contenido de ejemplo |
| `npm run db:reset-admin-password` | Resetea la contraseña del admin |
