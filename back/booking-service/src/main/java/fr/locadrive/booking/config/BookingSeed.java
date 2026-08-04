package fr.locadrive.booking.config;

import fr.locadrive.booking.model.Booking;
import fr.locadrive.booking.repository.BookingRepository;
import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Réservation de démonstration, identique au mock du front. */
@Configuration
public class BookingSeed {

  @Bean
  public CommandLineRunner seedBookings(BookingRepository repository) {
    return args -> {
      if (repository.count() > 0) {
        return;
      }
      repository.save(
          new Booking(
              "b-demo-1",
              "client-demo",
              "Camille Client",
              "tesla-model-3",
              "Tesla Model 3",
              "Paris",
              LocalDate.of(2026, 8, 1),
              LocalDate.of(2026, 8, 5),
              4,
              1580000,
              Booking.STATUS_CONFIRMED));
    };
  }
}
