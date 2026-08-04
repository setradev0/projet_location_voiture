package fr.locadrive.vehicle.exception;

/** Corps d'erreur uniforme attendu par le front : `{ "error": "…" }`. */
public record ErrorResponse(String error) {}
