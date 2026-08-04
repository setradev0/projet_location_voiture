package fr.locadrive.booking.exception;

import org.springframework.http.HttpStatus;

public class VehicleNotFoundException extends ApiException {

  public VehicleNotFoundException() {
    super(HttpStatus.NOT_FOUND, "Véhicule introuvable.");
  }
}
