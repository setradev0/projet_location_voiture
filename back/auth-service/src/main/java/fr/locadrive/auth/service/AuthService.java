package fr.locadrive.auth.service;

import fr.locadrive.auth.dto.AuthResponse;
import fr.locadrive.auth.dto.LoginRequest;
import fr.locadrive.auth.dto.PasswordChangeRequest;
import fr.locadrive.auth.dto.ProfileUpdateRequest;
import fr.locadrive.auth.dto.RegisterRequest;
import fr.locadrive.auth.dto.UserResponse;
import fr.locadrive.auth.exception.EmailAlreadyUsedException;
import fr.locadrive.auth.exception.InvalidCredentialsException;
import fr.locadrive.auth.exception.InvalidPasswordException;
import fr.locadrive.auth.exception.UserNotFoundException;
import fr.locadrive.auth.model.UserAccount;
import fr.locadrive.auth.repository.UserAccountRepository;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/** Logique d'authentification : inscription et connexion. */
@Service
public class AuthService {

  private final UserAccountRepository repository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(
      UserAccountRepository repository, PasswordEncoder passwordEncoder, JwtService jwtService) {
    this.repository = repository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public AuthResponse register(RegisterRequest request) {
    if (repository.existsByEmailIgnoreCase(request.email())) {
      throw new EmailAlreadyUsedException();
    }
    UserAccount account =
        new UserAccount(
            "u-" + UUID.randomUUID(),
            request.name().trim(),
            request.email().trim().toLowerCase(),
            passwordEncoder.encode(request.password()),
            request.role());
    repository.save(account);
    return toAuthResponse(account);
  }

  public AuthResponse login(LoginRequest request) {
    UserAccount account =
        repository
            .findByEmailIgnoreCase(request.email().trim())
            .filter(user -> passwordEncoder.matches(request.password(), user.getPasswordHash()))
            .orElseThrow(InvalidCredentialsException::new);
    return toAuthResponse(account);
  }

  public UserResponse updateProfile(String id, ProfileUpdateRequest request) {
    UserAccount account = repository.findById(id).orElseThrow(UserNotFoundException::new);
    account.updateProfile(request.name().trim(), request.photoUrl());
    return UserResponse.of(repository.save(account));
  }

  public void changePassword(String id, PasswordChangeRequest request) {
    UserAccount account = repository.findById(id).orElseThrow(UserNotFoundException::new);
    if (!passwordEncoder.matches(request.currentPassword(), account.getPasswordHash())) {
      throw new InvalidPasswordException();
    }
    account.changePassword(passwordEncoder.encode(request.newPassword()));
    repository.save(account);
  }

  private AuthResponse toAuthResponse(UserAccount account) {
    return new AuthResponse(jwtService.issueToken(account), UserResponse.of(account));
  }
}
