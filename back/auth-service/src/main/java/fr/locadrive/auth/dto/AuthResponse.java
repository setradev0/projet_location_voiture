package fr.locadrive.auth.dto;

public record AuthResponse(String token, UserResponse user) {}
