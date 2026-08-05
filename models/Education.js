class Education {
  constructor({ id, institution, degree, field, start_date, end_date, description, display_order, created_at, updated_at }) {
    this.id = id;
    this.institution = institution;
    this.degree = degree;
    this.field = field;
    this.startDate = start_date;
    this.endDate = end_date;
    this.description = description;
    this.displayOrder = display_order;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }

  static fromRow(row) {
    return row ? new Education(row) : null;
  }

  isOngoing() {
    return !this.endDate;
  }

  toJSON() {
    return {
      id: this.id,
      institution: this.institution,
      degree: this.degree,
      field: this.field,
      start_date: this.startDate,
      end_date: this.endDate,
      description: this.description,
      display_order: this.displayOrder,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}

module.exports = Education;
