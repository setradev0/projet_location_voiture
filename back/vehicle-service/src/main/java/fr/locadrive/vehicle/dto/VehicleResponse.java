package fr.locadrive.vehicle.dto;

import fr.locadrive.vehicle.model.Vehicle;

public record VehicleResponse(
    String id,
    String brand,
    String model,
    String category,
    String city,
    int pricePerDay,
    int seats,
    String transmission,
    String fuel,
    String photoUrl) {

  public static VehicleResponse of(Vehicle vehicle) {
    return new VehicleResponse(
        vehicle.getId(),
        vehicle.getBrand(),
        vehicle.getModel(),
        vehicle.getCategory(),
        vehicle.getCity(),
        vehicle.getPricePerDay(),
        vehicle.getSeats(),
        vehicle.getTransmission(),
        vehicle.getFuel(),
        vehicle.getPhotoUrl());
  }
}
