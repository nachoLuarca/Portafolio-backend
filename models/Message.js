class Message {
  constructor({ id, name, email, subject, body, is_read, created_at }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.subject = subject;
    this.body = body;
    this.isRead = is_read;
    this.createdAt = created_at;
  }

  static fromRow(row) {
    return row ? new Message(row) : null;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      subject: this.subject,
      body: this.body,
      is_read: this.isRead,
      created_at: this.createdAt,
    };
  }
}

module.exports = Message;
