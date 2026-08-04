package fr.locadrive.auth.exception;

import org.springframework.http.HttpStatus;

public class InvalidPasswordException extends ApiException {

  public InvalidPasswordException() {
    super(HttpStatus.BAD_REQUEST, "Mot de passe actuel incorrect.");
  }
}
