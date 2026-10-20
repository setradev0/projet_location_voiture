import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { User } from '../../features/auth/domain/user.model';

const TOKEN_KEY = 'locadrive.token';
const USER_KEY = 'locadrive.user';

/** Session JWT + utilisateur, persistée dans localStorage côté navigateur. */
@Injectable({ providedIn: 'root' })
export class AuthSession {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly tokenState = signal<string | null>(null);
  private readonly userState = signal<User | null>(null);

  readonly token = this.tokenState.asReadonly();
  readonly user = this.userState.asReadonly();

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const token = localStorage.getItem(TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);
    if (!token || !rawUser) {
      return;
    }
    try {
      this.tokenState.set(token);
      this.userState.set(JSON.parse(rawUser) as User);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  set(token: string, user: User): void {
    this.tokenState.set(token);
    this.userState.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  setUser(user: User): void {
    this.userState.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  clear(): void {
    this.tokenState.set(null);
    this.userState.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }
}
