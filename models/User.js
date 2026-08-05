class User {
  constructor({ id, name, email, password_hash, created_at }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = password_hash;
    this.createdAt = created_at;
  }

  static fromRow(row) {
    return row ? new User(row) : null;
  }

  // Forma pública/segura del usuario: el hash de la contraseña NUNCA
  // debe salir de esta clase hacia una respuesta HTTP.
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      created_at: this.createdAt,
    };
  }
}

module.exports = User;
