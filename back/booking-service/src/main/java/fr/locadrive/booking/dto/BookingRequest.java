package fr.locadrive.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public record BookingRequest(
    @NotBlank(message = "Identifiant utilisateur manquant.") String userId,
    @NotBlank(message = "Nom d'utilisateur manquant.") String userName,
    @NotBlank(message = "Identifiant véhicule manquant.") String vehicleId,
    @NotBlank(message = "Indiquez la formule.")
        @Pattern(
            regexp = "demi-journee|journee|plusieurs-jours",
            message = "Formule inconnue.")
        String option,
    @NotNull(message = "Indiquez la date de départ.") LocalDate pickupDate,
    /** Requise uniquement pour la formule « plusieurs-jours ». */
    LocalDate returnDate) {}
