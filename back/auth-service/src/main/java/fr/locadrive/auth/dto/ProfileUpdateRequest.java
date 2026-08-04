package fr.locadrive.auth.dto;

import jakarta.validation.constraints.NotBlank;

/** Champs modifiables depuis la page profil. */
public record ProfileUpdateRequest(
    @NotBlank(message = "Indiquez votre nom.") String name,
    /** Photo de profil (data URL), optionnelle. */
    String photoUrl) {}
