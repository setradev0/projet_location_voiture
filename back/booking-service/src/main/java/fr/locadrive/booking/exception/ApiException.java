package fr.locadrive.booking.exception;

import org.springframework.http.HttpStatus;

/** Base des exceptions métier : porte le statut HTTP à renvoyer au client. */
public abstract class ApiException extends RuntimeException {

  private final HttpStatus status;

  protected ApiException(HttpStatus status, String message) {
    super(message);
    this.status = status;
  }

  public HttpStatus getStatus() {
    return status;
  }
}
