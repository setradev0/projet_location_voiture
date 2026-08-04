package fr.locadrive.booking.exception;

import org.springframework.http.HttpStatus;

public class InvalidBookingDatesException extends ApiException {

  public InvalidBookingDatesException() {
    super(HttpStatus.BAD_REQUEST, "La date de retour doit être après la date de départ.");
  }
}
