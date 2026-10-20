import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { AuthService } from '../domain/auth-service';
import { Credentials } from '../domain/user.model';

@Component({
  selector: 'app-login-page',
  imports: [FormField, RouterLink],
  template: `
    <section class="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 py-16">
      <div class="w-full max-w-md">
        <h1 class="text-3xl font-bold text-slate-900">Connexion</h1>
        <p class="mt-2 text-slate-600">
          Pas encore de compte ?
          <a routerLink="/inscription" class="font-medium text-amber-600 hover:text-amber-500">
            Créez-en un
          </a>
        </p>

        <form
          novalidate
          class="mt-8 flex flex-col gap-5 rounded-2xl bg-white p-8 shadow-md ring-1 ring-slate-200"
          (submit)="onSubmit($event)"
        >
          @if (submitError(); as error) {
            <p role="alert" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
              {{ error }}
            </p>
          }

          <div class="flex flex-col gap-1.5">
            <label for="login-email" class="text-sm font-medium text-slate-700">Email</label>
            <input
              id="login-email"
              type="email"
              autocomplete="email"
              class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [formField]="loginForm.email"
              [attr.aria-invalid]="showError(loginForm.email())"
              [attr.aria-describedby]="showError(loginForm.email()) ? 'login-email-error' : null"
            />
            @if (showError(loginForm.email())) {
              <p id="login-email-error" class="text-sm text-red-600">Indiquez votre email.</p>
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="login-password" class="text-sm font-medium text-slate-700">
              Mot de passe
            </label>
            <input
              id="login-password"
              type="password"
              autocomplete="current-password"
              class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [formField]="loginForm.password"
              [attr.aria-invalid]="showError(loginForm.password())"
              [attr.aria-describedby]="showError(loginForm.password()) ? 'login-password-error' : null"
            />
            @if (showError(loginForm.password())) {
              <p id="login-password-error" class="text-sm text-red-600">
                Indiquez votre mot de passe.
              </p>
            }
          </div>

          <button
            type="submit"
            class="rounded-lg bg-slate-900 px-6 py-2.5 font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Se connecter
          </button>
        </form>

        <div class="mt-6 rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
          <p class="font-medium text-slate-700">Comptes de démonstration :</p>
          <ul class="mt-1 list-inside list-disc">
            <li>Agent : agent&#64;locadrive.fr / agent123</li>
            <li>Client : client&#64;exemple.fr / client123</li>
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly submitError = signal<string | null>(null);

  private readonly model = signal<Credentials>({ email: '', password: '' });

  protected readonly loginForm = form(this.model, (path) => {
    required(path.email);
    required(path.password);
  });

  protected showError(state: { touched: () => boolean; invalid: () => boolean }): boolean {
    return state.touched() && state.invalid();
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.submitError.set(null);
    await submit(this.loginForm, async () => {
      const result = await this.auth.login(this.model());
      if (!result.ok) {
        this.submitError.set(result.error);
        return undefined;
      }
      await this.redirectAfterAuth(result.user.role);
      return undefined;
    });
  }

  private async redirectAfterAuth(role: 'client' | 'agent'): Promise<void> {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl) {
      await this.router.navigateByUrl(returnUrl);
      return;
    }
    await this.router.navigateByUrl(role === 'agent' ? '/agent/tableau-de-bord' : '/recherche');
  }
}
