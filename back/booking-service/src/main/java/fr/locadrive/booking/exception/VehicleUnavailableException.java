package fr.locadrive.booking.exception;

import org.springframework.http.HttpStatus;

public class VehicleUnavailableException extends ApiException {

  public VehicleUnavailableException() {
    super(HttpStatus.CONFLICT, "Ce véhicule est déjà réservé sur ces dates.");
  }
}
