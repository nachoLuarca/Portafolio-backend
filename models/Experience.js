class Experience {
  constructor({ id, company, role, location, start_date, end_date, description, display_order, created_at, updated_at }) {
    this.id = id;
    this.company = company;
    this.role = role;
    this.location = location;
    this.startDate = start_date;
    this.endDate = end_date;
    this.description = description;
    this.displayOrder = display_order;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }

  static fromRow(row) {
    return row ? new Experience(row) : null;
  }

  /** Trabajo actual = sin fecha de fin. */
  isCurrent() {
    return !this.endDate;
  }

  toJSON() {
    return {
      id: this.id,
      company: this.company,
      role: this.role,
      location: this.location,
      start_date: this.startDate,
      end_date: this.endDate,
      description: this.description,
      display_order: this.displayOrder,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}

module.exports = Experience;
