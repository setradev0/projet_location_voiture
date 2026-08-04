package fr.locadrive.auth.dto;

import fr.locadrive.auth.model.UserAccount;

public record UserResponse(String id, String name, String email, String role, String photoUrl) {

  public static UserResponse of(UserAccount account) {
    return new UserResponse(
        account.getId(),
        account.getName(),
        account.getEmail(),
        account.getRole(),
        account.getPhotoUrl());
  }
}
