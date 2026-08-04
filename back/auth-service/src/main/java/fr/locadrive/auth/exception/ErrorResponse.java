package fr.locadrive.auth.exception;

/** Corps d'erreur uniforme attendu par le front : `{ "error": "…" }`. */
public record ErrorResponse(String error) {}
