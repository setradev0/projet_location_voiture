package fr.locadrive.auth.exception;

import org.springframework.http.HttpStatus;

public class EmailAlreadyUsedException extends ApiException {

  public EmailAlreadyUsedException() {
    super(HttpStatus.CONFLICT, "Un compte existe déjà avec cet email.");
  }
}
