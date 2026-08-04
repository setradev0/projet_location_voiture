package fr.locadrive.booking.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

/** Réservation d'un véhicule. Le libellé et la ville du véhicule sont dénormalisés :
 * chaque microservice reste autonome pour ses lectures. */
@Entity
@Table(name = "booking")
public class Booking {

  public static final String STATUS_CONFIRMED = "confirmée";
  public static final String STATUS_CANCELLED = "annulée";

  @Id
  private String id;

  @Column(nullable = false)
  private String userId;

  @Column(nullable = false)
  private String userName;

  @Column(nullable = false)
  private String vehicleId;

  @Column(nullable = false)
  private String vehicleLabel;

  @Column(nullable = false)
  private String city;

  @Column(nullable = false)
  private LocalDate pickupDate;

  @Column(nullable = false)
  private LocalDate returnDate;

  /** Durée en jours ; 0.5 pour une demi-journée. */
  @Column(nullable = false)
  private double days;

  @Column(nullable = false)
  private int totalPrice;

  @Column(nullable = false)
  private String status;

  protected Booking() {}

  public Booking(
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
    this.id = id;
    this.userId = userId;
    this.userName = userName;
    this.vehicleId = vehicleId;
    this.vehicleLabel = vehicleLabel;
    this.city = city;
    this.pickupDate = pickupDate;
    this.returnDate = returnDate;
    this.days = days;
    this.totalPrice = totalPrice;
    this.status = status;
  }

  public String getId() {
    return id;
  }

  public String getUserId() {
    return userId;
  }

  public String getUserName() {
    return userName;
  }

  public String getVehicleId() {
    return vehicleId;
  }

  public String getVehicleLabel() {
    return vehicleLabel;
  }

  public String getCity() {
    return city;
  }

  public LocalDate getPickupDate() {
    return pickupDate;
  }

  public LocalDate getReturnDate() {
    return returnDate;
  }

  public double getDays() {
    return days;
  }

  public int getTotalPrice() {
    return totalPrice;
  }

  public String getStatus() {
    return status;
  }

  public void cancel() {
    this.status = STATUS_CANCELLED;
  }
}
