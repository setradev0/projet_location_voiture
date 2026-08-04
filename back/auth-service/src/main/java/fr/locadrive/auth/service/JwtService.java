package fr.locadrive.auth.service;

import fr.locadrive.auth.model.UserAccount;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/** Émet des JWT signés HS256. Le même secret permet aux autres services de les vérifier. */
@Service
public class JwtService {

  private final SecretKey key;
  private final Duration validity;

  public JwtService(
      @Value("${locadrive.jwt.secret}") String secret,
      @Value("${locadrive.jwt.validity:PT8H}") Duration validity) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.validity = validity;
  }

  public String issueToken(UserAccount account) {
    Instant now = Instant.now();
    return Jwts.builder()
        .subject(account.getId())
        .claim("name", account.getName())
        .claim("email", account.getEmail())
        .claim("role", account.getRole())
        .issuedAt(Date.from(now))
        .expiration(Date.from(now.plus(validity)))
        .signWith(key)
        .compact();
  }
}
