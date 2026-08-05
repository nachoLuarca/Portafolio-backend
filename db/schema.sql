-- Usuarios administradores (login del panel)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Perfil profesional (una sola fila, id fijo = 1)
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY DEFAULT 1,
  full_name VARCHAR(160) NOT NULL DEFAULT '',
  headline VARCHAR(200) NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  email VARCHAR(160) NOT NULL DEFAULT '',
  location VARCHAR(120) NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT '',
  github_url TEXT NOT NULL DEFAULT '',
  linkedin_url TEXT NOT NULL DEFAULT '',
  cv_url TEXT NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Proyectos del portafolio (CRUD principal del panel admin)
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  slug VARCHAR(180) UNIQUE NOT NULL,
  summary VARCHAR(280) NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT NOT NULL DEFAULT '',
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  repo_url TEXT NOT NULL DEFAULT '',
  demo_url TEXT NOT NULL DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'published', -- 'published' | 'draft'
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Experiencia laboral
CREATE TABLE IF NOT EXISTS work_experience (
  id SERIAL PRIMARY KEY,
  company VARCHAR(160) NOT NULL,
  role VARCHAR(160) NOT NULL,
  location VARCHAR(120) NOT NULL DEFAULT '',
  start_date DATE NOT NULL,
  end_date DATE, -- NULL = "actualidad"
  description TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Educación
CREATE TABLE IF NOT EXISTS education (
  id SERIAL PRIMARY KEY,
  institution VARCHAR(160) NOT NULL,
  degree VARCHAR(160) NOT NULL,
  field VARCHAR(160) NOT NULL DEFAULT '',
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Certificaciones
CREATE TABLE IF NOT EXISTS certifications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  issuer VARCHAR(160) NOT NULL,
  issue_date DATE,
  credential_url TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Mensajes recibidos por el formulario de contacto público
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(160) NOT NULL,
  subject VARCHAR(200) NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para las consultas más frecuentes (ordenar listados, filtrar no leídos)
CREATE INDEX IF NOT EXISTS idx_work_experience_order ON work_experience (display_order, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_education_order ON education (display_order, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_certifications_order ON certifications (display_order, issue_date DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages (is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status_order ON projects (status, display_order, created_at DESC);

-- Fila inicial de perfil vacía para que siempre exista
INSERT INTO profile (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
