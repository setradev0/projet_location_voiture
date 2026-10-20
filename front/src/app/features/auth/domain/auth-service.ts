import { Signal } from '@angular/core';
import {
  AuthResult,
  Credentials,
  OperationResult,
  ProfileUpdate,
  RegisterData,
  User,
} from './user.model';

/**
 * Port du domaine : l'authentification réelle (API, OAuth…) devra
 * respecter ce contrat. Les composants et guards n'injectent que
 * cette abstraction.
 */
export abstract class AuthService {
  /** Utilisateur connecté, ou null. Réactif : utilisable dans computed()/templates. */
  abstract readonly currentUser: Signal<User | null>;

  abstract login(credentials: Credentials): Promise<AuthResult>;
  abstract register(data: RegisterData): Promise<AuthResult>;
  abstract logout(): void;
  /** Met à jour le profil de l'utilisateur connecté et renvoie sa version à jour. */
  abstract updateProfile(update: ProfileUpdate): Promise<User>;
  /** Change le mot de passe après vérification du mot de passe actuel. */
  abstract changePassword(currentPassword: string, newPassword: string): Promise<OperationResult>;
}
