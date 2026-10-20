import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { form, FormField, min, required, submit } from '@angular/forms/signals';
import { NewVehicle, FUELS, TRANSMISSIONS, VEHICLE_CATEGORIES, Vehicle } from '../domain/vehicle.model';
import { VehicleRepository } from '../domain/vehicle-repository';
import { readImageAsDataUrl } from '../../../shared/util/image-file';
import { AriaryPipe } from '../../../shared/ui/ariary.pipe';

@Component({
  selector: 'app-vehicle-register-page',
  imports: [FormField, AriaryPipe],
  template: `
    <section class="bg-slate-50 px-6 py-16">
      <div class="mx-auto max-w-2xl">
        @if (editedId) {
          <h1 class="text-3xl font-bold text-slate-900">Modifier le véhicule</h1>
          <p class="mt-2 text-slate-600">
            Les changements sont visibles immédiatement dans la recherche et la flotte.
          </p>
        } @else {
          <h1 class="text-3xl font-bold text-slate-900">Enregistrer un véhicule</h1>
          <p class="mt-2 text-slate-600">
            Ajoutez un véhicule à la flotte : il devient immédiatement visible dans la recherche.
          </p>
        }

        <div role="status" aria-live="polite">
          @if (lastAdded(); as vehicle) {
            <p class="mt-6 rounded-lg bg-emerald-50 px-4 py-3 text-emerald-800 ring-1 ring-emerald-200">
              {{ vehicle.brand }} {{ vehicle.model }} ({{ vehicle.city }},
              {{ vehicle.pricePerDay | ariary }}/jour) a été ajouté à la flotte.
            </p>
          }
        </div>

        <form
          novalidate
          class="mt-8 grid gap-5 rounded-2xl bg-white p-8 shadow-md ring-1 ring-slate-200 sm:grid-cols-2"
          (submit)="onSubmit($event)"
        >
          <div class="flex flex-col gap-1.5">
            <label for="vehicle-brand" class="text-sm font-medium text-slate-700">Marque</label>
            <input
              id="vehicle-brand"
              type="text"
              placeholder="Renault"
              class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [formField]="vehicleForm.brand"
              [attr.aria-invalid]="showError(vehicleForm.brand())"
              [attr.aria-describedby]="showError(vehicleForm.brand()) ? 'vehicle-brand-error' : null"
            />
            @if (showError(vehicleForm.brand())) {
              <p id="vehicle-brand-error" class="text-sm text-red-600">Indiquez la marque.</p>
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="vehicle-model" class="text-sm font-medium text-slate-700">Modèle</label>
            <input
              id="vehicle-model"
              type="text"
              placeholder="Clio V"
              class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [formField]="vehicleForm.model"
              [attr.aria-invalid]="showError(vehicleForm.model())"
              [attr.aria-describedby]="showError(vehicleForm.model()) ? 'vehicle-model-error' : null"
            />
            @if (showError(vehicleForm.model())) {
              <p id="vehicle-model-error" class="text-sm text-red-600">Indiquez le modèle.</p>
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="vehicle-category" class="text-sm font-medium text-slate-700">
              Catégorie
            </label>
            <select
              id="vehicle-category"
              class="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 capitalize focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [formField]="vehicleForm.category"
            >
              @for (category of categories; track category) {
                <option [value]="category" class="capitalize">{{ category }}</option>
              }
            </select>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="vehicle-city" class="text-sm font-medium text-slate-700">
              Ville de l'agence
            </label>
            <input
              id="vehicle-city"
              type="text"
              placeholder="Lyon"
              class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [formField]="vehicleForm.city"
              [attr.aria-invalid]="showError(vehicleForm.city())"
              [attr.aria-describedby]="showError(vehicleForm.city()) ? 'vehicle-city-error' : null"
            />
            @if (showError(vehicleForm.city())) {
              <p id="vehicle-city-error" class="text-sm text-red-600">Indiquez la ville.</p>
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="vehicle-price" class="text-sm font-medium text-slate-700">
              Prix par jour (Ar)
            </label>
            <input
              id="vehicle-price"
              type="number"
              class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [formField]="vehicleForm.pricePerDay"
              [attr.aria-invalid]="showError(vehicleForm.pricePerDay())"
              [attr.aria-describedby]="
                showError(vehicleForm.pricePerDay()) ? 'vehicle-price-error' : null
              "
            />
            @if (showError(vehicleForm.pricePerDay())) {
              <p id="vehicle-price-error" class="text-sm text-red-600">
                Indiquez un prix valide.
              </p>
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="vehicle-seats" class="text-sm font-medium text-slate-700">
              Nombre de places
            </label>
            <input
              id="vehicle-seats"
              type="number"
              class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [formField]="vehicleForm.seats"
              [attr.aria-invalid]="showError(vehicleForm.seats())"
              [attr.aria-describedby]="showError(vehicleForm.seats()) ? 'vehicle-seats-error' : null"
            />
            @if (showError(vehicleForm.seats())) {
              <p id="vehicle-seats-error" class="text-sm text-red-600">
                Indiquez au moins 1 place.
              </p>
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="vehicle-transmission" class="text-sm font-medium text-slate-700">
              Transmission
            </label>
            <select
              id="vehicle-transmission"
              class="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 capitalize focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [formField]="vehicleForm.transmission"
            >
              @for (transmission of transmissions; track transmission) {
                <option [value]="transmission" class="capitalize">{{ transmission }}</option>
              }
            </select>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="vehicle-fuel" class="text-sm font-medium text-slate-700">Carburant</label>
            <select
              id="vehicle-fuel"
              class="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 capitalize focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
              [formField]="vehicleForm.fuel"
            >
              @for (fuel of fuels; track fuel) {
                <option [value]="fuel" class="capitalize">{{ fuel }}</option>
              }
            </select>
          </div>

          <div class="flex flex-col gap-1.5 sm:col-span-2">
            <label for="vehicle-photo" class="text-sm font-medium text-slate-700">
              Photo du véhicule
            </label>
            @if (photoUrl(); as photo) {
              <div class="flex flex-wrap items-center gap-4">
                <img
                  [src]="photo"
                  alt="Aperçu de la photo du véhicule"
                  class="h-24 w-36 rounded-lg object-cover ring-1 ring-slate-200"
                />
                <button
                  type="button"
                  (click)="removePhoto()"
                  class="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Retirer la photo
                </button>
              </div>
            }
            <input
              id="vehicle-photo"
              type="file"
              accept="image/*"
              (change)="onPhotoSelected($event)"
              class="text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-700"
              [attr.aria-describedby]="photoError() ? 'vehicle-photo-error' : 'vehicle-photo-hint'"
            />
            @if (photoError(); as error) {
              <p id="vehicle-photo-error" class="text-sm text-red-600">{{ error }}</p>
            } @else {
              <p id="vehicle-photo-hint" class="text-sm text-slate-500">
                Formats image (JPEG, PNG…), 8&nbsp;Mo max. Optionnel — un visuel par catégorie est
                utilisé à défaut.
              </p>
            }
          </div>

          <button
            type="submit"
            class="rounded-lg bg-amber-500 px-6 py-2.5 font-semibold text-slate-900 transition hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 sm:col-span-2"
          >
            {{ editedId ? 'Enregistrer les modifications' : 'Enregistrer le véhicule' }}
          </button>
        </form>
      </div>
    </section>
  `,
})
export class VehicleRegisterPage {
  private readonly repository = inject(VehicleRepository);
  private readonly router = inject(Router);

  protected readonly categories = VEHICLE_CATEGORIES;
  protected readonly transmissions = TRANSMISSIONS;
  protected readonly fuels = FUELS;

  protected readonly lastAdded = signal<Vehicle | null>(null);

  /** Identifiant du véhicule en cours de modification, `null` en mode création. */
  protected readonly editedId: string | null;

  private readonly emptyVehicle: NewVehicle = {
    brand: '',
    model: '',
    category: 'citadine',
    city: '',
    pricePerDay: 150000,
    seats: 5,
    transmission: 'manuelle',
    fuel: 'essence',
  };

  private readonly model = signal<NewVehicle>({ ...this.emptyVehicle });

  /** Aperçu de la photo courante (création, ou véhicule en cours d'édition). */
  protected readonly photoUrl = computed(() => this.model().photoUrl ?? null);
  protected readonly photoError = signal<string | null>(null);

  constructor() {
    const id = inject(ActivatedRoute).snapshot.paramMap.get('id');
    const existing = id ? this.repository.getById(id) : undefined;
    this.editedId = existing ? id : null;
    if (id && !existing) {
      // Identifiant inconnu (véhicule retiré, lien obsolète) : retour à la flotte.
      void this.router.navigateByUrl('/agent/flotte');
    }
    if (existing) {
      const { id: _, ...data } = existing;
      this.model.set(data);
    }
  }

  protected readonly vehicleForm = form(this.model, (path) => {
    required(path.brand);
    required(path.model);
    required(path.city);
    required(path.pricePerDay);
    min(path.pricePerDay, 1);
    required(path.seats);
    min(path.seats, 1);
  });

  protected showError(state: { touched: () => boolean; invalid: () => boolean }): boolean {
    return state.touched() && state.invalid();
  }

  protected async onPhotoSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.photoError.set(null);
    try {
      const dataUrl = await readImageAsDataUrl(file);
      this.model.update((vehicle) => ({ ...vehicle, photoUrl: dataUrl }));
    } catch (error) {
      this.photoError.set(error instanceof Error ? error.message : 'Photo invalide.');
    } finally {
      // Réinitialise l'input pour permettre de re-sélectionner le même fichier.
      input.value = '';
    }
  }

  protected removePhoto(): void {
    this.photoError.set(null);
    this.model.update((vehicle) => ({ ...vehicle, photoUrl: undefined }));
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.vehicleForm, async () => {
      if (this.editedId) {
        await this.repository.update(this.editedId, { ...this.model() });
        await this.router.navigateByUrl('/agent/flotte');
        return undefined;
      }
      const added = await this.repository.add({ ...this.model() });
      this.lastAdded.set(added);
      this.model.set({ ...this.emptyVehicle });
      this.photoError.set(null);
      this.vehicleForm().reset();
      return undefined;
    });
  }
}
