import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/domain/auth-service';
import { BookingRepository } from '../../bookings/domain/booking-repository';
import { RENTAL_OPTIONS, RentalOption } from '../../bookings/domain/rental';
import { rentalDays } from '../domain/booking-criteria.model';
import { VehicleRepository } from '../domain/vehicle-repository';
import { CATEGORY_STYLES } from '../../../shared/ui/category-style';
import { AriaryPipe } from '../../../shared/ui/ariary.pipe';

@Component({
  selector: 'app-vehicle-detail-page',
  imports: [RouterLink, AriaryPipe],
  template: `
    <section class="bg-slate-50 px-6 py-12">
      <div class="mx-auto max-w-5xl">
        @if (vehicle(); as vehicle) {
          <div class="grid gap-8 lg:grid-cols-[1fr_380px]">
            <article class="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200">
              @if (vehicle.photoUrl; as photo) {
                <img
                  [src]="photo"
                  [alt]="'Photo de ' + vehicle.brand + ' ' + vehicle.model"
                  class="h-56 w-full object-cover"
                />
              } @else {
                <div
                  class="flex h-56 items-center justify-center bg-gradient-to-br text-8xl {{
                    style()!.gradient
                  }}"
                  aria-hidden="true"
                >
                  {{ style()!.icon }}
                </div>
              }
              <div class="p-8">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <h1 class="text-3xl font-bold text-slate-900">
                    {{ vehicle.brand }} {{ vehicle.model }}
                  </h1>
                  <span class="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700">
                    {{ style()!.label }}
                  </span>
                </div>
                <p class="mt-2 font-medium text-slate-500">📍 Agence de {{ vehicle.city }}</p>
                <dl class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div class="rounded-xl bg-slate-50 p-4">
                    <dt class="text-sm text-slate-500">Places</dt>
                    <dd class="mt-1 font-semibold text-slate-900">{{ vehicle.seats }}</dd>
                  </div>
                  <div class="rounded-xl bg-slate-50 p-4">
                    <dt class="text-sm text-slate-500">Transmission</dt>
                    <dd class="mt-1 font-semibold text-slate-900 capitalize">
                      {{ vehicle.transmission }}
                    </dd>
                  </div>
                  <div class="rounded-xl bg-slate-50 p-4">
                    <dt class="text-sm text-slate-500">Carburant</dt>
                    <dd class="mt-1 font-semibold text-slate-900 capitalize">{{ vehicle.fuel }}</dd>
                  </div>
                  <div class="rounded-xl bg-slate-50 p-4">
                    <dt class="text-sm text-slate-500">Prix / jour</dt>
                    <dd class="mt-1 font-semibold text-slate-900">
                      {{ vehicle.pricePerDay | ariary }}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>

            <aside
              class="h-fit rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200"
              aria-labelledby="booking-title"
            >
              <h2 id="booking-title" class="text-xl font-bold text-slate-900">
                Réserver ce véhicule
              </h2>

              @if (user()) {
                <form novalidate class="mt-5 flex flex-col gap-4" (submit)="onSubmit($event)">
                  @if (bookingError(); as error) {
                    <p
                      role="alert"
                      class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200"
                    >
                      {{ error }}
                    </p>
                  }

                  <div class="flex flex-col gap-1.5">
                    <label for="booking-option" class="text-sm font-medium text-slate-700">
                      Formule
                    </label>
                    <select
                      id="booking-option"
                      class="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
                      (change)="onOptionChange($event)"
                    >
                      @for (opt of rentalOptions; track opt.value) {
                        <option [value]="opt.value" [selected]="opt.value === option()">
                          {{ opt.label }}
                        </option>
                      }
                    </select>
                  </div>

                  @if (option() === 'plusieurs-jours') {
                    <div class="flex flex-col gap-1.5">
                      <label for="booking-pickup" class="text-sm font-medium text-slate-700">
                        Départ
                      </label>
                      <input
                        id="booking-pickup"
                        type="date"
                        class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
                        [value]="startDate()"
                        (change)="onStartChange($event)"
                        [attr.aria-invalid]="startError()"
                      />
                      @if (startError()) {
                        <p class="text-sm text-red-600">Choisissez une date de départ.</p>
                      }
                    </div>

                    <div class="flex flex-col gap-1.5">
                      <label for="booking-return" class="text-sm font-medium text-slate-700">
                        Retour
                      </label>
                      <input
                        id="booking-return"
                        type="date"
                        class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
                        [value]="endDate()"
                        (change)="onEndChange($event)"
                        [attr.aria-invalid]="endError()"
                      />
                      @if (endError()) {
                        <p class="text-sm text-red-600">Choisissez une date de retour.</p>
                      }
                    </div>
                  } @else {
                    <div class="flex flex-col gap-1.5">
                      <label for="booking-date" class="text-sm font-medium text-slate-700">
                        Date de location
                      </label>
                      <input
                        id="booking-date"
                        type="date"
                        class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
                        [value]="startDate()"
                        (change)="onStartChange($event)"
                        [attr.aria-invalid]="startError()"
                      />
                      @if (startError()) {
                        <p class="text-sm text-red-600">Choisissez une date de location.</p>
                      }
                    </div>
                  }

                  @if (estimate(); as estimate) {
                    <p class="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      @switch (estimate.option) {
                        @case ('demi-journee') {
                          Demi-journée :
                          <strong class="text-slate-900">{{ estimate.total | ariary }}</strong>
                        }
                        @case ('journee') {
                          Journée :
                          <strong class="text-slate-900">{{ estimate.total | ariary }}</strong>
                        }
                        @default {
                          {{ estimate.days }} jour{{ estimate.days! > 1 ? 's' : '' }} ×
                          {{ vehicle.pricePerDay | ariary }} =
                          <strong class="text-slate-900">{{ estimate.total | ariary }}</strong>
                        }
                      }
                    </p>
                  }

                  <button
                    type="submit"
                    class="rounded-lg bg-amber-500 px-6 py-2.5 font-semibold text-slate-900 transition hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                  >
                    Confirmer la réservation
                  </button>
                </form>
              } @else {
                <p class="mt-4 text-slate-600">Connectez-vous pour réserver ce véhicule.</p>
                <a
                  [routerLink]="['/connexion']"
                  [queryParams]="{ returnUrl: currentUrl() }"
                  class="mt-4 inline-block rounded-lg bg-slate-900 px-6 py-2.5 font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                >
                  Se connecter
                </a>
              }
            </aside>
          </div>
        } @else {
          <div class="rounded-2xl bg-white p-10 text-center shadow-md ring-1 ring-slate-200">
            <h1 class="text-2xl font-bold text-slate-900">Véhicule introuvable</h1>
            <p class="mt-2 text-slate-600">Ce véhicule n'est plus dans notre flotte.</p>
            <a
              routerLink="/recherche"
              class="mt-6 inline-block rounded-lg bg-slate-900 px-6 py-2.5 font-semibold text-white transition hover:bg-slate-700"
            >
              Retour à la recherche
            </a>
          </div>
        }
      </div>
    </section>
  `,
})
export class VehicleDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly vehicles = inject(VehicleRepository);
  private readonly bookings = inject(BookingRepository);
  private readonly auth = inject(AuthService);

  private readonly params = toSignal(this.route.paramMap);

  protected readonly user = this.auth.currentUser;
  protected readonly vehicle = computed(() => {
    const id = this.params()?.get('id');
    return id ? this.vehicles.getById(id) : undefined;
  });
  protected readonly style = computed(() => {
    const vehicle = this.vehicle();
    return vehicle ? CATEGORY_STYLES[vehicle.category] : null;
  });
  protected readonly currentUrl = computed(() => this.router.url);

  protected readonly bookingError = signal<string | null>(null);
  protected readonly rentalOptions = RENTAL_OPTIONS;

  protected readonly option = signal<RentalOption>('plusieurs-jours');
  protected readonly startDate = signal(this.route.snapshot.queryParamMap.get('pickupDate') ?? '');
  protected readonly endDate = signal(this.route.snapshot.queryParamMap.get('returnDate') ?? '');
  private readonly submitted = signal(false);

  protected readonly startError = computed(() => this.submitted() && !this.startDate());
  protected readonly endError = computed(
    () => this.submitted() && this.option() === 'plusieurs-jours' && !this.endDate(),
  );

  protected readonly estimate = computed(() => {
    const vehicle = this.vehicle();
    if (!vehicle) {
      return null;
    }
    const option = this.option();
    if (option === 'demi-journee') {
      return { option, total: Math.round(vehicle.pricePerDay / 2) };
    }
    if (option === 'journee') {
      return { option, total: vehicle.pricePerDay };
    }
    const days = rentalDays({ city: '', pickupDate: this.startDate(), returnDate: this.endDate() });
    return days ? { option, days, total: days * vehicle.pricePerDay } : null;
  });

  protected onOptionChange(event: Event): void {
    this.option.set((event.target as HTMLSelectElement).value as RentalOption);
    this.bookingError.set(null);
  }

  protected onStartChange(event: Event): void {
    this.startDate.set((event.target as HTMLInputElement).value);
  }

  protected onEndChange(event: Event): void {
    this.endDate.set((event.target as HTMLInputElement).value);
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.submitted.set(true);
    this.bookingError.set(null);
    const user = this.user();
    const vehicle = this.vehicle();
    if (!user || !vehicle || !this.startDate()) {
      return;
    }
    const option = this.option();
    if (option === 'plusieurs-jours' && !this.endDate()) {
      return;
    }
    const result = await this.bookings.book({
      user,
      vehicle,
      option,
      startDate: this.startDate(),
      endDate: option === 'plusieurs-jours' ? this.endDate() : undefined,
    });
    if (!result.ok) {
      this.bookingError.set(result.error);
      return;
    }
    await this.router.navigateByUrl('/mes-reservations');
  }
}
