package fr.locadrive.booking.dto;

import fr.locadrive.booking.model.Booking;
import java.time.LocalDate;

public record BookingResponse(
    String id,
    String userId,
    String userName,
    String vehicleId,
    String vehicleLabel,
    String city,
    LocalDate pickupDate,
    LocalDate returnDate,
    double days,
    int totalPrice,
    String status) {

  public static BookingResponse of(Booking booking) {
    return new BookingResponse(
        booking.getId(),
        booking.getUserId(),
        booking.getUserName(),
        booking.getVehicleId(),
        booking.getVehicleLabel(),
        booking.getCity(),
        booking.getPickupDate(),
        booking.getReturnDate(),
        booking.getDays(),
        booking.getTotalPrice(),
        booking.getStatus());
  }
}
