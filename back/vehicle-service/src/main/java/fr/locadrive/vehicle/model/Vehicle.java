package fr.locadrive.vehicle.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Véhicule de la flotte. Les valeurs (catégorie, transmission, carburant) sont en français,
 * en cohérence avec le domaine du front. */
@Entity
@Table(name = "vehicle")
public class Vehicle {

  @Id
  private String id;

  @Column(nullable = false)
  private String brand;

  @Column(nullable = false)
  private String model;

  @Column(nullable = false)
  private String category;

  @Column(nullable = false)
  private String city;

  @Column(nullable = false)
  private int pricePerDay;

  @Column(nullable = false)
  private int seats;

  @Column(nullable = false)
  private String transmission;

  @Column(nullable = false)
  private String fuel;

  /** Photo réelle (data URL). `text` car une image encodée dépasse une colonne varchar. */
  @Column(columnDefinition = "text")
  private String photoUrl;

  protected Vehicle() {}

  public Vehicle(
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
    this.id = id;
    this.brand = brand;
    this.model = model;
    this.category = category;
    this.city = city;
    this.pricePerDay = pricePerDay;
    this.seats = seats;
    this.transmission = transmission;
    this.fuel = fuel;
    this.photoUrl = photoUrl;
  }

  public String getId() {
    return id;
  }

  public String getBrand() {
    return brand;
  }

  public String getModel() {
    return model;
  }

  public String getCategory() {
    return category;
  }

  public String getCity() {
    return city;
  }

  public int getPricePerDay() {
    return pricePerDay;
  }

  public int getSeats() {
    return seats;
  }

  public String getTransmission() {
    return transmission;
  }

  public String getFuel() {
    return fuel;
  }

  public String getPhotoUrl() {
    return photoUrl;
  }

  public void updateFrom(
      String brand,
      String model,
      String category,
      String city,
      int pricePerDay,
      int seats,
      String transmission,
      String fuel,
      String photoUrl) {
    this.brand = brand;
    this.model = model;
    this.category = category;
    this.city = city;
    this.pricePerDay = pricePerDay;
    this.seats = seats;
    this.transmission = transmission;
    this.fuel = fuel;
    this.photoUrl = photoUrl;
  }
}
