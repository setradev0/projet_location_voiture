package fr.locadrive.vehicle.service;

import fr.locadrive.vehicle.dto.VehicleRequest;
import fr.locadrive.vehicle.dto.VehicleResponse;
import fr.locadrive.vehicle.exception.VehicleNotFoundException;
import fr.locadrive.vehicle.model.Vehicle;
import fr.locadrive.vehicle.repository.VehicleRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

/** Logique de gestion de la flotte : recherche, mise en avant, CRUD. */
@Service
public class VehicleService {

  private final VehicleRepository repository;

  public VehicleService(VehicleRepository repository) {
    this.repository = repository;
  }

  public List<VehicleResponse> search(String city) {
    List<Vehicle> vehicles =
        (city == null || city.isBlank())
            ? repository.findAll()
            : repository.findByCityContainingIgnoreCase(city.trim());
    return vehicles.stream().map(VehicleResponse::of).toList();
  }

  public List<VehicleResponse> featured() {
    return repository.findAll().stream().limit(6).map(VehicleResponse::of).toList();
  }

  public VehicleResponse getById(String id) {
    return VehicleResponse.of(find(id));
  }

  public VehicleResponse create(VehicleRequest request) {
    Vehicle vehicle =
        new Vehicle(
            "v-" + UUID.randomUUID(),
            request.brand().trim(),
            request.model().trim(),
            request.category(),
            request.city().trim(),
            request.pricePerDay(),
            request.seats(),
            request.transmission(),
            request.fuel(),
            request.photoUrl());
    return VehicleResponse.of(repository.save(vehicle));
  }

  public VehicleResponse update(String id, VehicleRequest request) {
    Vehicle vehicle = find(id);
    vehicle.updateFrom(
        request.brand().trim(),
        request.model().trim(),
        request.category(),
        request.city().trim(),
        request.pricePerDay(),
        request.seats(),
        request.transmission(),
        request.fuel(),
        request.photoUrl());
    return VehicleResponse.of(repository.save(vehicle));
  }

  public void delete(String id) {
    repository.deleteById(id);
  }

  private Vehicle find(String id) {
    return repository.findById(id).orElseThrow(() -> new VehicleNotFoundException(id));
  }
}
