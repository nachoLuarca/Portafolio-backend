class Certification {
  constructor({ id, name, issuer, issue_date, credential_url, display_order, created_at }) {
    this.id = id;
    this.name = name;
    this.issuer = issuer;
    this.issueDate = issue_date;
    this.credentialUrl = credential_url;
    this.displayOrder = display_order;
    this.createdAt = created_at;
  }

  static fromRow(row) {
    return row ? new Certification(row) : null;
  }

  hasVerifiableCredential() {
    return Boolean(this.credentialUrl);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      issuer: this.issuer,
      issue_date: this.issueDate,
      credential_url: this.credentialUrl,
      display_order: this.displayOrder,
      created_at: this.createdAt,
    };
  }
}

module.exports = Certification;
