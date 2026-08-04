export type UserRole = 'client' | 'agent';

export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  /** Photo de profil (data URL). Absente : les initiales sont affichées. */
  readonly photoUrl?: string;
}

/** Champs modifiables depuis la page profil. */
export interface ProfileUpdate {
  name: string;
  photoUrl?: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export type AuthResult = { ok: true; user: User } | { ok: false; error: string };

/** Résultat d'une opération sans valeur de retour (ex. changement de mot de passe). */
export type OperationResult = { ok: true } | { ok: false; error: string };
