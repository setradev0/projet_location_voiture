package fr.locadrive.auth.config;

import fr.locadrive.auth.model.UserAccount;
import fr.locadrive.auth.repository.UserAccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AuthConfig {

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  /** Comptes de démonstration, identiques aux mocks du front. */
  @Bean
  public CommandLineRunner seedUsers(UserAccountRepository repository, PasswordEncoder encoder) {
    return args -> {
      if (repository.count() > 0) {
        return;
      }
      repository.save(
          new UserAccount(
              "client-demo",
              "Camille Client",
              "client@exemple.fr",
              encoder.encode("client123"),
              "client"));
      repository.save(
          new UserAccount(
              "agent-demo",
              "Agathe Agent",
              "agent@locadrive.fr",
              encoder.encode("agent123"),
              "agent"));
    };
  }
}
