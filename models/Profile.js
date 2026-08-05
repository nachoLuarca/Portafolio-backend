class Profile {
  constructor({
    id, full_name, headline, bio, email, location,
    avatar_url, github_url, linkedin_url, cv_url, skills, updated_at,
  }) {
    this.id = id;
    this.fullName = full_name;
    this.headline = headline;
    this.bio = bio;
    this.email = email;
    this.location = location;
    this.avatarUrl = avatar_url;
    this.githubUrl = github_url;
    this.linkedinUrl = linkedin_url;
    this.cvUrl = cv_url;
    this.skills = skills || [];
    this.updatedAt = updated_at;
  }

  static fromRow(row) {
    return row ? new Profile(row) : null;
  }

  /** El perfil se considera "completo" si tiene lo mínimo para publicarse. */
  isComplete() {
    return Boolean(this.fullName && this.headline && this.bio);
  }

  toJSON() {
    return {
      id: this.id,
      full_name: this.fullName,
      headline: this.headline,
      bio: this.bio,
      email: this.email,
      location: this.location,
      avatar_url: this.avatarUrl,
      github_url: this.githubUrl,
      linkedin_url: this.linkedinUrl,
      cv_url: this.cvUrl,
      skills: this.skills,
      updated_at: this.updatedAt,
    };
  }
}

module.exports = Profile;
