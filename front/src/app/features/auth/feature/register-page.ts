import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { email, form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { AuthService } from '../domain/auth-service';
import { RegisterData } from '../domain/user.model';

@Component({
  selector: 'app-register-page',
  imports: [FormField, RouterLink],
  template: `
    <section class="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 py-16">
      <div class="w-full max-w-md">
        <h1 class="text-3xl font-bold text-slate-900">Créer un compte</h1>
        <p class="mt-2 text-slate-600">
          Déjà inscrit ?
          <a routerLink="/connexion" class="font-medium text-amber-600 hover:text-amber-500">
            Connectez-vous
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
            <label for="register-name" class="text-sm font-medium text-slate-700">Nom complet</label>
            <input
              id="register-name"
              type="text"
              autocomplete="name"
              class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [formField]="registerForm.name"
              [attr.aria-invalid]="showError(registerForm.name())"
              [attr.aria-describedby]="showError(registerForm.name()) ? 'register-name-error' : null"
            />
            @if (showError(registerForm.name())) {
              <p id="register-name-error" class="text-sm text-red-600">Indiquez votre nom.</p>
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="register-email" class="text-sm font-medium text-slate-700">Email</label>
            <input
              id="register-email"
              type="email"
              autocomplete="email"
              class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [formField]="registerForm.email"
              [attr.aria-invalid]="showError(registerForm.email())"
              [attr.aria-describedby]="showError(registerForm.email()) ? 'register-email-error' : null"
            />
            @if (showError(registerForm.email())) {
              <p id="register-email-error" class="text-sm text-red-600">
                Indiquez un email valide.
              </p>
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="register-password" class="text-sm font-medium text-slate-700">
              Mot de passe
            </label>
            <input
              id="register-password"
              type="password"
              autocomplete="new-password"
              class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [formField]="registerForm.password"
              [attr.aria-invalid]="showError(registerForm.password())"
              [attr.aria-describedby]="
                showError(registerForm.password()) ? 'register-password-error' : null
              "
            />
            @if (showError(registerForm.password())) {
              <p id="register-password-error" class="text-sm text-red-600">
                6 caractères minimum.
              </p>
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="register-role" class="text-sm font-medium text-slate-700">
              Type de compte
            </label>
            <select
              id="register-role"
              class="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [formField]="registerForm.role"
            >
              <option value="client">Client — je cherche à louer</option>
              <option value="agent">Agent — j'enregistre des véhicules</option>
            </select>
          </div>

          <button
            type="submit"
            class="rounded-lg bg-amber-500 px-6 py-2.5 font-semibold text-slate-900 transition hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            Créer mon compte
          </button>
        </form>
      </div>
    </section>
  `,
})
export class RegisterPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly submitError = signal<string | null>(null);

  private readonly model = signal<RegisterData>({
    name: '',
    email: '',
    password: '',
    role: 'client',
  });

  protected readonly registerForm = form(this.model, (path) => {
    required(path.name);
    required(path.email);
    email(path.email);
    required(path.password);
    minLength(path.password, 6);
  });

  protected showError(state: { touched: () => boolean; invalid: () => boolean }): boolean {
    return state.touched() && state.invalid();
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.submitError.set(null);
    await submit(this.registerForm, async () => {
      const result = this.auth.register(this.model());
      if (!result.ok) {
        this.submitError.set(result.error);
        return undefined;
      }
      await this.router.navigateByUrl(
        result.user.role === 'agent' ? '/agent/tableau-de-bord' : '/recherche',
      );
      return undefined;
    });
  }
}
