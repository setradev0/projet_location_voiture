package fr.locadrive.vehicle.config;

import fr.locadrive.vehicle.model.Vehicle;
import fr.locadrive.vehicle.repository.VehicleRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Flotte de démonstration, identique aux mocks du front (sans photo : visuel par catégorie). */
@Configuration
public class VehicleSeed {

  @Bean
  public CommandLineRunner seedVehicles(VehicleRepository repository) {
    return args -> {
      if (repository.count() > 0) {
        return;
      }
      repository.saveAll(
          List.of(
              new Vehicle("clio-5", "Renault", "Clio V", "citadine", "Paris", 145000, 5, "manuelle", "essence", null),
              new Vehicle("peugeot-3008", "Peugeot", "3008", "suv", "Lyon", 275000, 5, "automatique", "hybride", null),
              new Vehicle("tesla-model-3", "Tesla", "Model 3", "électrique", "Paris", 395000, 5, "automatique", "électrique", null),
              new Vehicle("bmw-serie-3", "BMW", "Série 3", "berline", "Bordeaux", 345000, 5, "automatique", "diesel", null),
              new Vehicle("fiat-500e", "Fiat", "500e", "électrique", "Marseille", 175000, 4, "automatique", "électrique", null),
              new Vehicle("dacia-duster", "Dacia", "Duster", "suv", "Lyon", 195000, 5, "manuelle", "essence", null)));
    };
  }
}
