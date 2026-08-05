/**
 * Modelo de dominio "Proyecto". No sabe nada de SQL ni de HTTP —
 * solo representa la entidad y las reglas que le pertenecen a ella.
 */
class Project {
  constructor({
    id, title, slug, summary, description, cover_image_url,
    tech_stack, repo_url, demo_url, featured, status, display_order,
    created_at, updated_at,
  }) {
    this.id = id;
    this.title = title;
    this.slug = slug;
    this.summary = summary;
    this.description = description;
    this.coverImageUrl = cover_image_url;
    this.techStack = tech_stack || [];
    this.repoUrl = repo_url;
    this.demoUrl = demo_url;
    this.featured = featured;
    this.status = status;
    this.displayOrder = display_order;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }

  static fromRow(row) {
    return row ? new Project(row) : null;
  }

  isPublished() {
    return this.status === "published";
  }

  /** Genera un slug único y legible en URL a partir del título. */
  static generateSlug(title) {
    const base = title
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return `${base}-${Date.now().toString(36).slice(-4)}`;
  }

  // Forma que se expone en la API pública (mismos campos, en snake_case
  // para no romper el contrato que ya consume el frontend).
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      summary: this.summary,
      description: this.description,
      cover_image_url: this.coverImageUrl,
      tech_stack: this.techStack,
      repo_url: this.repoUrl,
      demo_url: this.demoUrl,
      featured: this.featured,
      status: this.status,
      display_order: this.displayOrder,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}

module.exports = Project;
