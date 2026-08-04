package fr.locadrive.booking.client;

/** Vue du véhicule renvoyée par le vehicle-service, limitée à ce dont la réservation a besoin. */
public record VehicleDto(
    String id,
    String brand,
    String model,
    String category,
    String city,
    int pricePerDay,
    int seats,
    String transmission,
    String fuel) {

  public String label() {
    return brand + " " + model;
  }
}
