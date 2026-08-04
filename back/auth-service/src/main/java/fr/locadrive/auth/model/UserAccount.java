package fr.locadrive.auth.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Compte utilisateur : rôle `client` ou `agent`, mot de passe haché en BCrypt. */
@Entity
@Table(name = "user_account")
public class UserAccount {

  @Id
  private String id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String passwordHash;

  @Column(nullable = false)
  private String role;

  /** Photo de profil (data URL). `text` car une image encodée dépasse une colonne varchar. */
  @Column(columnDefinition = "text")
  private String photoUrl;

  protected UserAccount() {}

  public UserAccount(String id, String name, String email, String passwordHash, String role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
  }

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getEmail() {
    return email;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public String getRole() {
    return role;
  }

  public String getPhotoUrl() {
    return photoUrl;
  }

  /** Met à jour les champs modifiables depuis la page profil. */
  public void updateProfile(String name, String photoUrl) {
    this.name = name;
    this.photoUrl = photoUrl;
  }

  public void changePassword(String passwordHash) {
    this.passwordHash = passwordHash;
  }
}
