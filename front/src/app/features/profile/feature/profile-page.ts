import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../auth/domain/auth-service';
import { UserAvatar } from '../../../shared/ui/user-avatar';
import { readImageAsDataUrl } from '../../../shared/util/image-file';

@Component({
  selector: 'app-profile-page',
  imports: [UserAvatar],
  template: `
    <section class="bg-slate-50 px-6 py-12" aria-labelledby="profile-title">
      <div class="mx-auto max-w-2xl">
        <h1 id="profile-title" class="text-3xl font-bold text-slate-900">Mon profil</h1>
        <p class="mt-2 text-slate-600">Gérez vos informations et votre photo de profil.</p>

        <div role="status" aria-live="polite">
          @if (saved()) {
            <p
              class="mt-6 rounded-lg bg-emerald-50 px-4 py-3 text-emerald-800 ring-1 ring-emerald-200"
            >
              Votre profil a été mis à jour.
            </p>
          }
        </div>

        <form
          novalidate
          class="mt-8 flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-md ring-1 ring-slate-200"
          (submit)="onSubmit($event)"
        >
          <!-- Photo de profil -->
          <div class="flex flex-wrap items-center gap-5">
            <app-user-avatar [name]="name()" [photoUrl]="photoUrl() ?? null" size="lg" />
            <div class="flex flex-col gap-2">
              <label
                for="profile-photo"
                class="cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Changer la photo
              </label>
              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                class="sr-only"
                (change)="onPhotoSelected($event)"
                [attr.aria-describedby]="photoError() ? 'profile-photo-error' : null"
              />
              @if (photoUrl()) {
                <button
                  type="button"
                  (click)="removePhoto()"
                  class="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Retirer la photo
                </button>
              }
            </div>
          </div>
          @if (photoError(); as error) {
            <p id="profile-photo-error" class="-mt-3 text-sm text-red-600">{{ error }}</p>
          }

          <div class="flex flex-col gap-1.5">
            <label for="profile-name" class="text-sm font-medium text-slate-700">Nom</label>
            <input
              id="profile-name"
              type="text"
              class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [value]="name()"
              (input)="onNameChange($event)"
              [attr.aria-invalid]="nameError()"
              [attr.aria-describedby]="nameError() ? 'profile-name-error' : null"
            />
            @if (nameError()) {
              <p id="profile-name-error" class="text-sm text-red-600">Indiquez votre nom.</p>
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="profile-email" class="text-sm font-medium text-slate-700">Email</label>
            <input
              id="profile-email"
              type="email"
              disabled
              class="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-slate-500"
              [value]="user()?.email ?? ''"
            />
            <p class="text-sm text-slate-500">L'email de connexion n'est pas modifiable.</p>
          </div>

          <div class="flex flex-col gap-1.5">
            <span class="text-sm font-medium text-slate-700">Rôle</span>
            <span
              class="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
            >
              {{ roleLabel() }}
            </span>
          </div>

          <button
            type="submit"
            class="w-fit rounded-lg bg-amber-500 px-6 py-2.5 font-semibold text-slate-900 transition hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            Enregistrer
          </button>
        </form>

        <form
          novalidate
          class="mt-6 flex flex-col gap-5 rounded-2xl bg-white p-8 shadow-md ring-1 ring-slate-200"
          (submit)="onSubmitPassword($event)"
        >
          <div>
            <h2 class="text-xl font-bold text-slate-900">Mot de passe</h2>
            <p class="mt-1 text-sm text-slate-600">
              Choisissez un mot de passe d'au moins 6 caractères.
            </p>
          </div>

          <div role="status" aria-live="polite">
            @if (passwordSaved()) {
              <p
                class="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200"
              >
                Votre mot de passe a été modifié.
              </p>
            }
          </div>

          @if (passwordError(); as error) {
            <p
              role="alert"
              class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200"
            >
              {{ error }}
            </p>
          }

          <div class="flex flex-col gap-1.5">
            <label for="current-password" class="text-sm font-medium text-slate-700">
              Mot de passe actuel
            </label>
            <input
              id="current-password"
              type="password"
              autocomplete="current-password"
              class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [value]="currentPassword()"
              (input)="onPasswordInput('current', $event)"
              [attr.aria-invalid]="currentPasswordError()"
              [attr.aria-describedby]="currentPasswordError() ? 'current-password-error' : null"
            />
            @if (currentPasswordError()) {
              <p id="current-password-error" class="text-sm text-red-600">
                Indiquez votre mot de passe actuel.
              </p>
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="new-password" class="text-sm font-medium text-slate-700">
              Nouveau mot de passe
            </label>
            <input
              id="new-password"
              type="password"
              autocomplete="new-password"
              class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [value]="newPassword()"
              (input)="onPasswordInput('new', $event)"
              [attr.aria-invalid]="newPasswordError()"
              [attr.aria-describedby]="newPasswordError() ? 'new-password-error' : null"
            />
            @if (newPasswordError()) {
              <p id="new-password-error" class="text-sm text-red-600">
                Le mot de passe doit contenir au moins 6 caractères.
              </p>
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="confirm-password" class="text-sm font-medium text-slate-700">
              Confirmer le nouveau mot de passe
            </label>
            <input
              id="confirm-password"
              type="password"
              autocomplete="new-password"
              class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [value]="confirmPassword()"
              (input)="onPasswordInput('confirm', $event)"
              [attr.aria-invalid]="confirmPasswordError()"
              [attr.aria-describedby]="confirmPasswordError() ? 'confirm-password-error' : null"
            />
            @if (confirmPasswordError()) {
              <p id="confirm-password-error" class="text-sm text-red-600">
                Les mots de passe ne correspondent pas.
              </p>
            }
          </div>

          <button
            type="submit"
            class="w-fit rounded-lg bg-slate-900 px-6 py-2.5 font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Changer le mot de passe
          </button>
        </form>
      </div>
    </section>
  `,
})
export class ProfilePage {
  private readonly auth = inject(AuthService);

  protected readonly user = this.auth.currentUser;

  protected readonly name = signal(this.auth.currentUser()?.name ?? '');
  protected readonly photoUrl = signal<string | undefined>(this.auth.currentUser()?.photoUrl);
  protected readonly photoError = signal<string | null>(null);
  protected readonly saved = signal(false);
  private readonly submitted = signal(false);

  protected readonly nameError = computed(() => this.submitted() && !this.name().trim());
  protected readonly roleLabel = computed(() =>
    this.user()?.role === 'agent' ? 'Agent' : 'Client',
  );

  protected readonly currentPassword = signal('');
  protected readonly newPassword = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly passwordError = signal<string | null>(null);
  protected readonly passwordSaved = signal(false);
  private readonly passwordSubmitted = signal(false);

  protected readonly currentPasswordError = computed(
    () => this.passwordSubmitted() && !this.currentPassword(),
  );
  protected readonly newPasswordError = computed(
    () => this.passwordSubmitted() && this.newPassword().length < 6,
  );
  protected readonly confirmPasswordError = computed(
    () => this.passwordSubmitted() && this.confirmPassword() !== this.newPassword(),
  );

  protected onNameChange(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
    this.saved.set(false);
  }

  protected async onPhotoSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.photoError.set(null);
    try {
      this.photoUrl.set(await readImageAsDataUrl(file));
      this.saved.set(false);
    } catch (error) {
      this.photoError.set(error instanceof Error ? error.message : 'Photo invalide.');
    } finally {
      input.value = '';
    }
  }

  protected removePhoto(): void {
    this.photoUrl.set(undefined);
    this.photoError.set(null);
    this.saved.set(false);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
    if (!this.name().trim()) {
      return;
    }
    this.auth.updateProfile({ name: this.name().trim(), photoUrl: this.photoUrl() });
    this.saved.set(true);
  }

  protected onPasswordInput(field: 'current' | 'new' | 'confirm', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (field === 'current') {
      this.currentPassword.set(value);
    } else if (field === 'new') {
      this.newPassword.set(value);
    } else {
      this.confirmPassword.set(value);
    }
    this.passwordSaved.set(false);
    this.passwordError.set(null);
  }

  protected onSubmitPassword(event: Event): void {
    event.preventDefault();
    this.passwordSubmitted.set(true);
    this.passwordError.set(null);
    if (
      !this.currentPassword() ||
      this.newPassword().length < 6 ||
      this.confirmPassword() !== this.newPassword()
    ) {
      return;
    }
    const result = this.auth.changePassword(this.currentPassword(), this.newPassword());
    if (!result.ok) {
      this.passwordError.set(result.error);
      return;
    }
    this.passwordSaved.set(true);
    this.passwordSubmitted.set(false);
    this.currentPassword.set('');
    this.newPassword.set('');
    this.confirmPassword.set('');
  }
}
