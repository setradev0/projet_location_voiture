package fr.locadrive.vehicle.exception;

import org.springframework.http.HttpStatus;

public class VehicleNotFoundException extends ApiException {

  public VehicleNotFoundException(String id) {
    super(HttpStatus.NOT_FOUND, "Véhicule introuvable : " + id);
  }
}
