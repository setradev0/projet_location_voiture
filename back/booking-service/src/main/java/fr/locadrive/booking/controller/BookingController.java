package fr.locadrive.booking.controller;

import fr.locadrive.booking.dto.AvailabilityResponse;
import fr.locadrive.booking.dto.BookingRequest;
import fr.locadrive.booking.dto.BookingResponse;
import fr.locadrive.booking.service.BookingService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

  private final BookingService bookingService;

  public BookingController(BookingService bookingService) {
    this.bookingService = bookingService;
  }

  @GetMapping
  public List<BookingResponse> list(@RequestParam(required = false) String userId) {
    return bookingService.list(userId);
  }

  @GetMapping("/availability")
  public AvailabilityResponse availability(
      @RequestParam String vehicleId,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate pickupDate,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate returnDate) {
    return bookingService.checkAvailability(vehicleId, pickupDate, returnDate);
  }

  @PostMapping
  public ResponseEntity<BookingResponse> book(@Valid @RequestBody BookingRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.book(request));
  }

  @PostMapping("/{id}/cancel")
  public BookingResponse cancel(@PathVariable String id) {
    return bookingService.cancel(id);
  }
}
