import { Injectable, signal } from '@angular/core';
import { AuthService } from '../domain/auth-service';
import {
  AuthResult,
  Credentials,
  OperationResult,
  ProfileUpdate,
  RegisterData,
  User,
} from '../domain/user.model';

interface StoredAccount extends User {
  readonly password: string;
}

const SEED_ACCOUNTS: readonly StoredAccount[] = [
  {
    id: 'agent-demo',
    name: 'Agathe Agent',
    email: 'agent@locadrive.fr',
    password: 'agent123',
    role: 'agent',
  },
  {
    id: 'client-demo',
    name: 'Camille Client',
    email: 'client@exemple.fr',
    password: 'client123',
    role: 'client',
  },
];

/**
 * Adaptateur mock : comptes en mémoire, session non persistée.
 * Les mots de passe en clair n'existent que pour la démo.
 */
@Injectable()
export class InMemoryAuthService extends AuthService {
  private accounts: StoredAccount[] = [...SEED_ACCOUNTS];
  private readonly user = signal<User | null>(null);

  readonly currentUser = this.user.asReadonly();

  async login(credentials: Credentials): Promise<AuthResult> {
    const email = credentials.email.trim().toLowerCase();
    const account = this.accounts.find(
      (a) => a.email.toLowerCase() === email && a.password === credentials.password,
    );
    if (!account) {
      return { ok: false, error: 'Email ou mot de passe incorrect.' };
    }
    const user = this.toUser(account);
    this.user.set(user);
    return { ok: true, user };
  }

  async register(data: RegisterData): Promise<AuthResult> {
    const email = data.email.trim().toLowerCase();
    if (this.accounts.some((a) => a.email.toLowerCase() === email)) {
      return { ok: false, error: 'Un compte existe déjà avec cet email.' };
    }
    const account: StoredAccount = {
      id: `u-${Date.now().toString(36)}`,
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      role: data.role,
    };
    this.accounts.push(account);
    const user = this.toUser(account);
    this.user.set(user);
    return { ok: true, user };
  }

  logout(): void {
    this.user.set(null);
  }

  async updateProfile(update: ProfileUpdate): Promise<User> {
    const current = this.user();
    if (!current) {
      throw new Error('Aucun utilisateur connecté.');
    }
    this.accounts = this.accounts.map((account) =>
      account.id === current.id
        ? { ...account, name: update.name.trim(), photoUrl: update.photoUrl }
        : account,
    );
    const updated = this.toUser(this.accounts.find((a) => a.id === current.id)!);
    this.user.set(updated);
    return updated;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<OperationResult> {
    const current = this.user();
    if (!current) {
      return { ok: false, error: 'Aucun utilisateur connecté.' };
    }
    const account = this.accounts.find((a) => a.id === current.id);
    if (!account || account.password !== currentPassword) {
      return { ok: false, error: 'Mot de passe actuel incorrect.' };
    }
    this.accounts = this.accounts.map((a) =>
      a.id === current.id ? { ...a, password: newPassword } : a,
    );
    return { ok: true };
  }

  private toUser({ id, name, email, role, photoUrl }: StoredAccount): User {
    return { id, name, email, role, photoUrl };
  }
}
