import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/domain/auth-service';
import { BookingRepository } from '../../bookings/domain/booking-repository';
import { VehicleRepository } from '../../vehicles/domain/vehicle-repository';
import { VEHICLE_CATEGORIES } from '../../vehicles/domain/vehicle.model';
import { CATEGORY_STYLES } from '../../../shared/ui/category-style';
import { AriaryPipe } from '../../../shared/ui/ariary.pipe';

@Component({
  selector: 'app-agent-dashboard-page',
  imports: [RouterLink, AriaryPipe],
  template: `
    <section class="bg-slate-50 px-6 py-12" aria-labelledby="dashboard-title">
      <div class="mx-auto max-w-6xl">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 id="dashboard-title" class="text-3xl font-bold text-slate-900">Tableau de bord</h1>
            <p class="mt-2 text-slate-600">
              Bonjour {{ agentName() }}, voici l'activité de votre agence.
            </p>
          </div>
          <a
            routerLink="/agent/vehicules/nouveau"
            class="rounded-lg bg-amber-500 px-5 py-2.5 font-semibold text-slate-900 transition hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            + Ajouter un véhicule
          </a>
        </div>

        <!-- Indicateurs clés -->
        <dl class="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div class="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
            <dt class="text-sm font-medium text-slate-500">Véhicules en flotte</dt>
            <dd class="mt-2 text-3xl font-bold text-slate-900">{{ vehicleCount() }}</dd>
          </div>
          <div class="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
            <dt class="text-sm font-medium text-slate-500">Réservations confirmées</dt>
            <dd class="mt-2 text-3xl font-bold text-emerald-700">{{ confirmedCount() }}</dd>
          </div>
          <div class="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
            <dt class="text-sm font-medium text-slate-500">Chiffre d'affaires</dt>
            <dd class="mt-2 text-3xl font-bold text-slate-900">{{ revenue() | ariary }}</dd>
          </div>
          <div class="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
            <dt class="text-sm font-medium text-slate-500">Réservations annulées</dt>
            <dd class="mt-2 text-3xl font-bold text-slate-900">{{ cancelledCount() }}</dd>
          </div>
        </dl>

        <div class="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <!-- Dernières réservations -->
          <section
            class="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200"
            aria-labelledby="recent-title"
          >
            <div class="flex items-center justify-between gap-4">
              <h2 id="recent-title" class="text-xl font-bold text-slate-900">
                Dernières réservations
              </h2>
              <a
                routerLink="/agent/reservations"
                class="text-sm font-medium text-amber-600 transition hover:text-amber-500"
              >
                Tout voir →
              </a>
            </div>

            @if (recentBookings().length > 0) {
              <ul class="mt-4 flex list-none flex-col divide-y divide-slate-100">
                @for (booking of recentBookings(); track booking.id) {
                  <li class="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p class="font-semibold text-slate-900">{{ booking.vehicleLabel }}</p>
                      <p class="mt-0.5 text-sm text-slate-500">
                        {{ booking.userName }} · {{ booking.city }} · {{ booking.pickupDate }}
                      </p>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="font-semibold text-slate-900">
                        {{ booking.totalPrice | ariary }}
                      </span>
                      @if (booking.status === 'confirmée') {
                        <span
                          class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800"
                        >
                          Confirmée
                        </span>
                      } @else {
                        <span
                          class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          Annulée
                        </span>
                      }
                    </div>
                  </li>
                }
              </ul>
            } @else {
              <p class="mt-4 text-slate-600">Aucune réservation pour le moment.</p>
            }
          </section>

          <!-- Flotte par catégorie -->
          <section
            class="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200"
            aria-labelledby="fleet-title"
          >
            <div class="flex items-center justify-between gap-4">
              <h2 id="fleet-title" class="text-xl font-bold text-slate-900">Flotte par catégorie</h2>
              <a
                routerLink="/agent/flotte"
                class="text-sm font-medium text-amber-600 transition hover:text-amber-500"
              >
                Gérer →
              </a>
            </div>

            <ul class="mt-4 flex list-none flex-col gap-3">
              @for (row of fleetByCategory(); track row.category) {
                <li class="flex items-center gap-3">
                  <span
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-lg {{
                      row.style.gradient
                    }}"
                    aria-hidden="true"
                  >
                    {{ row.style.icon }}
                  </span>
                  <span class="flex-1 text-slate-700">{{ row.style.label }}</span>
                  <span class="font-semibold text-slate-900">{{ row.count }}</span>
                </li>
              }
            </ul>
          </section>
        </div>
      </div>
    </section>
  `,
})
export class AgentDashboardPage {
  private readonly auth = inject(AuthService);
  private readonly vehicles = inject(VehicleRepository);
  private readonly bookings = inject(BookingRepository);

  protected readonly agentName = computed(() => this.auth.currentUser()?.name ?? '');

  private readonly fleet = computed(() => this.vehicles.getAll());
  private readonly allBookings = computed(() => this.bookings.getAll());

  protected readonly vehicleCount = computed(() => this.fleet().length);
  protected readonly confirmedCount = computed(
    () => this.allBookings().filter((b) => b.status === 'confirmée').length,
  );
  protected readonly cancelledCount = computed(
    () => this.allBookings().filter((b) => b.status === 'annulée').length,
  );
  /** Chiffre d'affaires = somme des totaux des réservations confirmées. */
  protected readonly revenue = computed(() =>
    this.allBookings()
      .filter((b) => b.status === 'confirmée')
      .reduce((sum, b) => sum + b.totalPrice, 0),
  );
  protected readonly recentBookings = computed(() => this.allBookings().slice(0, 5));

  protected readonly fleetByCategory = computed(() =>
    VEHICLE_CATEGORIES.map((category) => ({
      category,
      style: CATEGORY_STYLES[category],
      count: this.fleet().filter((v) => v.category === category).length,
    })),
  );
}
