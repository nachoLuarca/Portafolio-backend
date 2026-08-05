require("dotenv").config();
const pool = require("../config/db");
const profileRepo = require("../repositories/profile.repository");
const projectsRepo = require("../repositories/projects.repository");
const experienceRepo = require("../repositories/experience.repository");
const educationRepo = require("../repositories/education.repository");
const certificationsRepo = require("../repositories/certifications.repository");

async function seedContent() {
  try {
    await profileRepo.update({
      full_name: "Alejandro Luarca",
      headline: "Desarrollador Full Stack",
      bio: "Desarrollador full stack especializado en Node.js, React y PostgreSQL. Me apasiona construir productos completos, desde la base de datos hasta la interfaz.",
      email: "alejandrojesusluarca@gmail.com",
      location: "Argentina",
      avatar_url: "",
      github_url: "https://github.com/",
      linkedin_url: "https://linkedin.com/",
      cv_url: "",
      skills: ["JavaScript", "Node.js", "Express", "React", "PostgreSQL", "Docker"],
    });
    console.log("✅ Perfil actualizado");

    const projects = [
      {
        title: "Portafolio Profesional",
        slug: "portafolio-profesional",
        summary: "API REST con panel de administración para gestionar el contenido de un portafolio.",
        description: "Backend en Node.js + Express + PostgreSQL con arquitectura en capas, y frontend en React + Vite. Incluye autenticación JWT y CRUD completo de proyectos, experiencia, educación y certificaciones.",
        cover_image_url: "",
        tech_stack: ["Node.js", "Express", "PostgreSQL", "React", "Vite"],
        repo_url: "https://github.com/",
        demo_url: "",
        featured: true,
        status: "published",
        display_order: 1,
      },
      {
        title: "API de Gestión de Tareas",
        slug: "api-gestion-tareas",
        summary: "API REST para gestión de tareas con autenticación y roles de usuario.",
        description: "Servicio backend con endpoints CRUD, validación de datos y control de acceso basado en roles.",
        cover_image_url: "",
        tech_stack: ["Node.js", "Express", "PostgreSQL", "JWT"],
        repo_url: "https://github.com/",
        demo_url: "",
        featured: false,
        status: "published",
        display_order: 2,
      },
      {
        title: "Tienda Online (E-commerce)",
        slug: "tienda-online-ecommerce",
        summary: "Aplicación de comercio electrónico con carrito de compras y pasarela de pago simulada.",
        description: "SPA en React con backend propio, carrito de compras persistente y panel de administración de productos.",
        cover_image_url: "",
        tech_stack: ["React", "Node.js", "PostgreSQL"],
        repo_url: "https://github.com/",
        demo_url: "",
        featured: false,
        status: "published",
        display_order: 3,
      },
    ];
    for (const project of projects) {
      await projectsRepo.create(project);
    }
    console.log(`✅ ${projects.length} proyectos creados`);

    const experiences = [
      {
        company: "Empresa Tecnológica SA",
        role: "Desarrollador Full Stack",
        location: "Remoto",
        start_date: "2023-01-01",
        end_date: null,
        description: "Desarrollo y mantenimiento de aplicaciones web con Node.js y React. Diseño de APIs REST y modelado de bases de datos PostgreSQL.",
        display_order: 1,
      },
      {
        company: "Estudio de Software",
        role: "Desarrollador Junior",
        location: "Buenos Aires, Argentina",
        start_date: "2021-06-01",
        end_date: "2022-12-31",
        description: "Colaboración en proyectos de desarrollo web para clientes, integración de APIs y corrección de errores.",
        display_order: 2,
      },
    ];
    for (const exp of experiences) {
      await experienceRepo.create(exp);
    }
    console.log(`✅ ${experiences.length} experiencias creadas`);

    const educations = [
      {
        institution: "Universidad Tecnológica",
        degree: "Licenciatura en Ingeniería en Sistemas",
        field: "Ingeniería de Software",
        start_date: "2018-03-01",
        end_date: "2023-12-01",
        description: "Formación en desarrollo de software, bases de datos y arquitectura de sistemas.",
        display_order: 1,
      },
    ];
    for (const edu of educations) {
      await educationRepo.create(edu);
    }
    console.log(`✅ ${educations.length} registros de educación creados`);

    const certifications = [
      {
        name: "Desarrollador Web Full Stack",
        issuer: "Plataforma de Cursos Online",
        issue_date: "2023-05-01",
        credential_url: "",
        display_order: 1,
      },
      {
        name: "Fundamentos de PostgreSQL",
        issuer: "Plataforma de Cursos Online",
        issue_date: "2022-11-01",
        credential_url: "",
        display_order: 2,
      },
    ];
    for (const cert of certifications) {
      await certificationsRepo.create(cert);
    }
    console.log(`✅ ${certifications.length} certificaciones creadas`);

    console.log("🎉 Datos de ejemplo insertados correctamente");
  } catch (err) {
    console.error("❌ Error insertando datos de ejemplo:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedContent();
