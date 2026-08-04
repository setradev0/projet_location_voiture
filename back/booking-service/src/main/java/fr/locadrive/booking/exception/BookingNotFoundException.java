package fr.locadrive.booking.exception;

import org.springframework.http.HttpStatus;

public class BookingNotFoundException extends ApiException {

  public BookingNotFoundException() {
    super(HttpStatus.NOT_FOUND, "Réservation introuvable.");
  }
}
