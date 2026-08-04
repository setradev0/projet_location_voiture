package fr.locadrive.auth.controller;

import fr.locadrive.auth.dto.AuthResponse;
import fr.locadrive.auth.dto.LoginRequest;
import fr.locadrive.auth.dto.PasswordChangeRequest;
import fr.locadrive.auth.dto.ProfileUpdateRequest;
import fr.locadrive.auth.dto.RegisterRequest;
import fr.locadrive.auth.dto.UserResponse;
import fr.locadrive.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
  }

  /** Met à jour le profil (nom, photo) d'un utilisateur. */
  @PutMapping("/users/{id}")
  public UserResponse updateProfile(
      @PathVariable String id, @Valid @RequestBody ProfileUpdateRequest request) {
    return authService.updateProfile(id, request);
  }

  /** Change le mot de passe (après vérification du mot de passe actuel). */
  @PostMapping("/users/{id}/password")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void changePassword(
      @PathVariable String id, @Valid @RequestBody PasswordChangeRequest request) {
    authService.changePassword(id, request);
  }
}
