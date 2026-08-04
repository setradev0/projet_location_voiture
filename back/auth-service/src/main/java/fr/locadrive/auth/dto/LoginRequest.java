package fr.locadrive.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank(message = "Indiquez votre email.") String email,
    @NotBlank(message = "Indiquez votre mot de passe.") String password) {}
