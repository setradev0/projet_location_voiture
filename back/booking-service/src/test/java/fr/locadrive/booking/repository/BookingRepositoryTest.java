package fr.locadrive.booking.repository;

import static org.assertj.core.api.Assertions.assertThat;

import fr.locadrive.booking.model.Booking;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class BookingRepositoryTest {

  @Autowired private BookingRepository repository;

  @BeforeEach
  void seed() {
    repository.save(
        new Booking(
            "b-1",
            "client-demo",
            "Camille Client",
            "tesla-model-3",
            "Tesla Model 3",
            "Paris",
            LocalDate.of(2026, 8, 1),
            LocalDate.of(2026, 8, 5),
            4,
            316,
            Booking.STATUS_CONFIRMED));
  }

  @Test
  void detectsOverlapInsideBookedPeriod() {
    assertThat(
            repository.existsOverlap(
                "tesla-model-3", LocalDate.of(2026, 8, 2), LocalDate.of(2026, 8, 4)))
        .isTrue();
  }

  @Test
  void allowsBackToBackPeriods() {
    assertThat(
            repository.existsOverlap(
                "tesla-model-3", LocalDate.of(2026, 8, 5), LocalDate.of(2026, 8, 8)))
        .isFalse();
    assertThat(
            repository.existsOverlap(
                "tesla-model-3", LocalDate.of(2026, 7, 28), LocalDate.of(2026, 8, 1)))
        .isFalse();
  }

  @Test
  void ignoresCancelledBookings() {
    repository.findById("b-1").ifPresent(
        booking -> {
          booking.cancel();
          repository.save(booking);
        });
    assertThat(
            repository.existsOverlap(
                "tesla-model-3", LocalDate.of(2026, 8, 2), LocalDate.of(2026, 8, 4)))
        .isFalse();
  }

  @Test
  void ignoresOtherVehicles() {
    assertThat(
            repository.existsOverlap(
                "clio-5", LocalDate.of(2026, 8, 2), LocalDate.of(2026, 8, 4)))
        .isFalse();
  }
}
