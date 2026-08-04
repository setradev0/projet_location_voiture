package fr.locadrive.booking.service;

import fr.locadrive.booking.client.VehicleClient;
import fr.locadrive.booking.client.VehicleDto;
import fr.locadrive.booking.dto.AvailabilityResponse;
import fr.locadrive.booking.dto.BookingRequest;
import fr.locadrive.booking.dto.BookingResponse;
import fr.locadrive.booking.exception.BookingNotFoundException;
import fr.locadrive.booking.exception.InvalidBookingDatesException;
import fr.locadrive.booking.exception.VehicleNotFoundException;
import fr.locadrive.booking.exception.VehicleUnavailableException;
import fr.locadrive.booking.model.Booking;
import fr.locadrive.booking.repository.BookingRepository;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

/** Logique de réservation : disponibilité, création (avec appel au vehicle-service), annulation. */
@Service
public class BookingService {

  private final BookingRepository repository;
  private final VehicleClient vehicleClient;

  public BookingService(BookingRepository repository, VehicleClient vehicleClient) {
    this.repository = repository;
    this.vehicleClient = vehicleClient;
  }

  public List<BookingResponse> list(String userId) {
    List<Booking> bookings =
        (userId == null || userId.isBlank())
            ? repository.findAll()
            : repository.findByUserId(userId);
    return bookings.stream().map(BookingResponse::of).toList();
  }

  public AvailabilityResponse checkAvailability(
      String vehicleId, LocalDate pickupDate, LocalDate returnDate) {
    return new AvailabilityResponse(!repository.existsOverlap(vehicleId, pickupDate, returnDate));
  }

  public BookingResponse book(BookingRequest request) {
    VehicleDto vehicle =
        vehicleClient.findById(request.vehicleId()).orElseThrow(VehicleNotFoundException::new);

    // Durée, date de retour (fin exclusive) et prix selon la formule.
    // Demi-journée et journée occupent la date entière pour la disponibilité.
    LocalDate pickupDate = request.pickupDate();
    double days;
    LocalDate returnDate;
    int totalPrice;
    switch (request.option()) {
      case "demi-journee" -> {
        days = 0.5;
        returnDate = pickupDate.plusDays(1);
        totalPrice = Math.round(vehicle.pricePerDay() / 2f);
      }
      case "journee" -> {
        days = 1;
        returnDate = pickupDate.plusDays(1);
        totalPrice = vehicle.pricePerDay();
      }
      default -> {
        if (request.returnDate() == null) {
          throw new InvalidBookingDatesException();
        }
        long between = ChronoUnit.DAYS.between(pickupDate, request.returnDate());
        if (between <= 0) {
          throw new InvalidBookingDatesException();
        }
        days = between;
        returnDate = request.returnDate();
        totalPrice = (int) between * vehicle.pricePerDay();
      }
    }

    if (repository.existsOverlap(request.vehicleId(), pickupDate, returnDate)) {
      throw new VehicleUnavailableException();
    }
    Booking booking =
        new Booking(
            "b-" + UUID.randomUUID(),
            request.userId(),
            request.userName(),
            vehicle.id(),
            vehicle.label(),
            vehicle.city(),
            pickupDate,
            returnDate,
            days,
            totalPrice,
            Booking.STATUS_CONFIRMED);
    return BookingResponse.of(repository.save(booking));
  }

  public BookingResponse cancel(String id) {
    Booking booking = repository.findById(id).orElseThrow(BookingNotFoundException::new);
    booking.cancel();
    return BookingResponse.of(repository.save(booking));
  }
}
