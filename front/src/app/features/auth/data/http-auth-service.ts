import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { apiErrorMessage } from '../../../core/http/api-error';
import { AuthSession } from '../../../core/http/auth-session';
import { AuthService } from '../domain/auth-service';
import {
  AuthResult,
  Credentials,
  OperationResult,
  ProfileUpdate,
  RegisterData,
  User,
  UserRole,
} from '../domain/user.model';

interface AuthApiResponse {
  token: string;
  user: UserDto;
}

interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
  photoUrl?: string | null;
}

@Injectable()
export class HttpAuthService extends AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly session = inject(AuthSession);

  readonly currentUser = this.session.user;

  async login(credentials: Credentials): Promise<AuthResult> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthApiResponse>(`${this.baseUrl}/auth/login`, {
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      );
      return this.storeSession(response);
    } catch (error) {
      return { ok: false, error: apiErrorMessage(error, 'Email ou mot de passe incorrect.') };
    }
  }

  async register(data: RegisterData): Promise<AuthResult> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthApiResponse>(`${this.baseUrl}/auth/register`, {
          name: data.name.trim(),
          email: data.email.trim(),
          password: data.password,
          role: data.role,
        }),
      );
      return this.storeSession(response);
    } catch (error) {
      return { ok: false, error: apiErrorMessage(error, "Impossible de créer le compte.") };
    }
  }

  logout(): void {
    this.session.clear();
  }

  async updateProfile(update: ProfileUpdate): Promise<User> {
    const current = this.session.user();
    if (!current) {
      throw new Error('Aucun utilisateur connecté.');
    }
    const user = this.toUser(
      await firstValueFrom(
        this.http.put<UserDto>(`${this.baseUrl}/auth/users/${current.id}`, {
          name: update.name.trim(),
          photoUrl: update.photoUrl ?? null,
        }),
      ),
    );
    this.session.setUser(user);
    return user;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<OperationResult> {
    const current = this.session.user();
    if (!current) {
      return { ok: false, error: 'Aucun utilisateur connecté.' };
    }
    try {
      await firstValueFrom(
        this.http.post(
          `${this.baseUrl}/auth/users/${current.id}/password`,
          { currentPassword, newPassword },
          { responseType: 'text' },
        ),
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error: apiErrorMessage(error, 'Mot de passe actuel incorrect.') };
    }
  }

  private storeSession(response: AuthApiResponse): AuthResult {
    const user = this.toUser(response.user);
    this.session.set(response.token, user);
    return { ok: true, user };
  }

  private toUser(dto: UserDto): User {
    const role: UserRole = dto.role === 'agent' ? 'agent' : 'client';
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      role,
      photoUrl: dto.photoUrl ?? undefined,
    };
  }
}
