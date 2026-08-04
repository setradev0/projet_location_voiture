import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../features/auth/domain/auth-service';
import { UserAvatar } from '../../shared/ui/user-avatar';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, UserAvatar],
  template: `
    <header class="bg-slate-950">
      <nav
        class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5"
        aria-label="Navigation principale"
      >
        <a
          routerLink="/"
          class="text-xl font-extrabold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
        >
          Loca<span class="text-amber-400">Drive</span>
        </a>

        <div class="flex items-center gap-4 text-sm font-medium">
          @if (user(); as user) {
            @if (user.role === 'agent') {
              <a
                routerLink="/agent/tableau-de-bord"
                class="text-slate-200 transition hover:text-white"
              >
                Tableau de bord
              </a>
              <a routerLink="/agent/flotte" class="text-slate-200 transition hover:text-white">
                Ma flotte
              </a>
              <a
                routerLink="/agent/reservations"
                class="text-slate-200 transition hover:text-white"
              >
                Réservations
              </a>
            } @else {
              <a routerLink="/recherche" class="text-slate-200 transition hover:text-white">
                Rechercher
              </a>
              <a routerLink="/mes-reservations" class="text-slate-200 transition hover:text-white">
                Mes réservations
              </a>
            }
            <span class="hidden text-slate-400 sm:inline" aria-hidden="true">·</span>
            <a
              routerLink="/profil"
              class="flex items-center gap-2 rounded-lg text-slate-200 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              <app-user-avatar [name]="user.name" [photoUrl]="user.photoUrl ?? null" size="sm" />
              <span class="hidden sm:inline">{{ user.name }}</span>
            </a>
            <button
              type="button"
              (click)="logout()"
              class="rounded-lg border border-slate-600 px-4 py-2 text-slate-200 transition hover:border-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              Déconnexion
            </button>
          } @else {
            <a routerLink="/connexion" class="text-slate-200 transition hover:text-white">
              Connexion
            </a>
            <a
              routerLink="/inscription"
              class="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-slate-900 transition hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              Inscription
            </a>
          }
        </div>
      </nav>
    </header>
  `,
})
export class SiteHeader {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = this.auth.currentUser;

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
