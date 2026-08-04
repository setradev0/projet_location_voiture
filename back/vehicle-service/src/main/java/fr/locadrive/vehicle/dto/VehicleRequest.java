package fr.locadrive.vehicle.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/** Données d'un véhicule sans identifiant — pour la création et la modification. */
public record VehicleRequest(
    @NotBlank(message = "Indiquez la marque.") String brand,
    @NotBlank(message = "Indiquez le modèle.") String model,
    @NotBlank(message = "Indiquez la catégorie.")
        @Pattern(regexp = "citadine|berline|suv|électrique", message = "Catégorie inconnue.")
        String category,
    @NotBlank(message = "Indiquez la ville.") String city,
    @Min(value = 1, message = "Indiquez un prix valide.") int pricePerDay,
    @Min(value = 1, message = "Indiquez au moins 1 place.") int seats,
    @NotBlank(message = "Indiquez la transmission.")
        @Pattern(regexp = "manuelle|automatique", message = "Transmission inconnue.")
        String transmission,
    @NotBlank(message = "Indiquez le carburant.")
        @Pattern(regexp = "essence|diesel|hybride|électrique", message = "Carburant inconnu.")
        String fuel,
    /** Photo réelle (data URL), optionnelle. */
    String photoUrl) {}
