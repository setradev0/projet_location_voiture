package fr.locadrive.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "Indiquez votre nom.") String name,
    @NotBlank(message = "Indiquez votre email.") @Email(message = "Email invalide.") String email,
    @NotBlank(message = "Indiquez un mot de passe.")
        @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères.")
        String password,
    @NotBlank(message = "Indiquez un rôle.")
        @Pattern(regexp = "client|agent", message = "Le rôle doit être `client` ou `agent`.")
        String role) {}
