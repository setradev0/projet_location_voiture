package fr.locadrive.auth.exception;

import org.springframework.http.HttpStatus;

public class InvalidCredentialsException extends ApiException {

  public InvalidCredentialsException() {
    super(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect.");
  }
}
