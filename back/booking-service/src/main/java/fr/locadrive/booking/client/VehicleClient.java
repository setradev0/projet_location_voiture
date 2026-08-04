package fr.locadrive.booking.client;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/** Client HTTP vers le vehicle-service : le booking-service ne stocke pas les véhicules. */
@Component
public class VehicleClient {

  private final RestClient restClient;

  public VehicleClient(@Value("${locadrive.vehicle-service.url}") String baseUrl) {
    this.restClient = RestClient.builder().baseUrl(baseUrl).build();
  }

  public Optional<VehicleDto> findById(String vehicleId) {
    try {
      VehicleDto vehicle =
          restClient
              .get()
              .uri("/api/vehicles/{id}", vehicleId)
              .retrieve()
              .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {})
              .body(VehicleDto.class);
      return Optional.ofNullable(vehicle).filter(v -> v.id() != null);
    } catch (Exception exception) {
      return Optional.empty();
    }
  }
}
