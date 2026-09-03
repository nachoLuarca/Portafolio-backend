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

También se puede levantar con Docker desde la raíz del proyecto: `docker compose up -d db backend`.

## Endpoints

| Recurso | Base |
|---|---|
| Autenticación | `/api/auth` |
| Perfil | `/api/profile` |
| Proyectos | `/api/projects` |
| Experiencia | `/api/experience` |
| Educación | `/api/education` |
| Certificaciones | `/api/certifications` |
| Mensajes de contacto | `/api/messages` |

Las rutas bajo `/api/admin/*` requieren autenticación (`requireAuth`).

## Scripts

| Comando | Descripción |
|---|---|
| `npm run db:init` | Crea/actualiza las tablas desde `db/schema.sql` |
| `npm run db:seed` | Crea el usuario admin inicial |
| `npm run db:seed:content` | Carga contenido de ejemplo |
| `npm run db:reset-admin-password` | Resetea la contraseña del admin |
