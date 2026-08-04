package fr.locadrive.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Changement de mot de passe : le mot de passe actuel est vérifié avant mise à jour. */
public record PasswordChangeRequest(
    @NotBlank(message = "Indiquez votre mot de passe actuel.") String currentPassword,
    @NotBlank(message = "Indiquez un nouveau mot de passe.")
        @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères.")
        String newPassword) {}
