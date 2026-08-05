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

-- Tokens JWT revocados antes de su expiración natural (logout). Cada token
-- firmado lleva un "jti" único; al hacer logout se guarda aquí hasta su
-- expiración original, y requireAuth rechaza cualquier token cuyo jti esté
-- en esta tabla aunque la firma y el "exp" todavía sean válidos.
-- TIMESTAMPTZ (no TIMESTAMP): con TIMESTAMP "sin zona", el driver de pg
-- serializa el Date de JS usando la hora LOCAL de la máquina, no UTC — si el
-- proceso Node corre en una zona horaria distinta a la del servidor Postgres,
-- expires_at queda desfasado y la comparación "expires_at > NOW()" da
-- resultados incorrectos (un token revocado puede parecer ya expirado y
-- dejar de bloquearse). TIMESTAMPTZ guarda el instante absoluto y evita eso.
CREATE TABLE IF NOT EXISTS revoked_tokens (
  jti VARCHAR(64) PRIMARY KEY,
  expires_at TIMESTAMPTZ NOT NULL
);

-- Refresh tokens vigentes. Cada login crea una fila; el jti viaja dentro del
-- refresh token JWT (firmado con JWT_REFRESH_SECRET, distinto del de acceso).
-- /auth/refresh exige que el jti exista aquí y no esté revocado ni vencido;
-- logout marca revoked_at para invalidarlo antes de su expiración natural.
CREATE TABLE IF NOT EXISTS refresh_tokens (
  jti VARCHAR(64) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ
);

-- Índices para las consultas más frecuentes (ordenar listados, filtrar no leídos)
CREATE INDEX IF NOT EXISTS idx_work_experience_order ON work_experience (display_order, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_education_order ON education (display_order, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_certifications_order ON certifications (display_order, issue_date DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages (is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status_order ON projects (status, display_order, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_expires ON revoked_tokens (expires_at);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens (user_id);

-- Fila inicial de perfil vacía para que siempre exista
INSERT INTO profile (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
