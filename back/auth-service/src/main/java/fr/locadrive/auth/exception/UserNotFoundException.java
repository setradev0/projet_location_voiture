package fr.locadrive.auth.exception;

import org.springframework.http.HttpStatus;

public class UserNotFoundException extends ApiException {

  public UserNotFoundException() {
    super(HttpStatus.NOT_FOUND, "Utilisateur introuvable.");
  }
}
