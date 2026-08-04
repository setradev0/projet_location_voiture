package fr.locadrive.vehicle.controller;

import fr.locadrive.vehicle.dto.VehicleRequest;
import fr.locadrive.vehicle.dto.VehicleResponse;
import fr.locadrive.vehicle.service.VehicleService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

  private final VehicleService vehicleService;

  public VehicleController(VehicleService vehicleService) {
    this.vehicleService = vehicleService;
  }

  @GetMapping
  public List<VehicleResponse> search(@RequestParam(required = false) String city) {
    return vehicleService.search(city);
  }

  @GetMapping("/featured")
  public List<VehicleResponse> featured() {
    return vehicleService.featured();
  }

  @GetMapping("/{id}")
  public VehicleResponse getById(@PathVariable String id) {
    return vehicleService.getById(id);
  }

  @PostMapping
  public ResponseEntity<VehicleResponse> create(@Valid @RequestBody VehicleRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(vehicleService.create(request));
  }

  @PutMapping("/{id}")
  public VehicleResponse update(
      @PathVariable String id, @Valid @RequestBody VehicleRequest request) {
    return vehicleService.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable String id) {
    vehicleService.delete(id);
  }
}
