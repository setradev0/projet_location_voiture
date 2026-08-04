package fr.locadrive.booking.repository;

import fr.locadrive.booking.model.Booking;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, String> {

  List<Booking> findByUserId(String userId);

  /** Chevauchement de période sur les réservations confirmées d'un véhicule. */
  @Query(
      """
      select count(b) > 0 from Booking b
      where b.vehicleId = :vehicleId
        and b.status = 'confirmée'
        and b.pickupDate < :returnDate
        and :pickupDate < b.returnDate
      """)
  boolean existsOverlap(
      @Param("vehicleId") String vehicleId,
      @Param("pickupDate") LocalDate pickupDate,
      @Param("returnDate") LocalDate returnDate);
}
