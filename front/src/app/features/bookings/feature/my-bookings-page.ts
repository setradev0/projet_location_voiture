import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/domain/auth-service';
import { BookingRepository } from '../domain/booking-repository';
import { describeRentalDuration } from '../domain/rental';
import { AriaryPipe } from '../../../shared/ui/ariary.pipe';

@Component({
  selector: 'app-my-bookings-page',
  imports: [RouterLink, AriaryPipe],
  template: `
    <section class="bg-slate-50 px-6 py-12" aria-labelledby="bookings-title">
      <div class="mx-auto max-w-4xl">
        <h1 id="bookings-title" class="text-3xl font-bold text-slate-900">Mes réservations</h1>
        <p class="mt-2 text-slate-600" role="status" aria-live="polite">
          {{ bookings().length }} réservation{{ bookings().length > 1 ? 's' : '' }}
        </p>

        @if (bookings().length > 0) {
          <ul class="mt-8 flex list-none flex-col gap-4">
            @for (booking of bookings(); track booking.id) {
              <li
                class="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200"
              >
                <div>
                  <p class="text-lg font-semibold text-slate-900">{{ booking.vehicleLabel }}</p>
                  <p class="mt-1 text-sm text-slate-600">
                    📍 {{ booking.city }} ·
                    @if (booking.days >= 2) {
                      du {{ booking.pickupDate }} au {{ booking.returnDate }} ·
                      {{ describeDuration(booking.days) }}
                    } @else {
                      le {{ booking.pickupDate }} · {{ describeDuration(booking.days) }}
                    }
                  </p>
                  <p class="mt-1 font-semibold text-slate-900">{{ booking.totalPrice | ariary }}</p>
                </div>
                <div class="flex items-center gap-3">
                  @if (booking.status === 'confirmée') {
                    <span
                      class="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800"
                    >
                      Confirmée
                    </span>
                    <button
                      type="button"
                      (click)="cancel(booking.id)"
                      class="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      Annuler
                    </button>
                  } @else {
                    <span
                      class="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600"
                    >
                      Annulée
                    </span>
                  }
                </div>
              </li>
            }
          </ul>
        } @else {
          <div class="mt-8 rounded-2xl bg-white p-10 text-center shadow-md ring-1 ring-slate-200">
            <p class="text-lg font-semibold text-slate-900">Aucune réservation pour le moment.</p>
            <a
              routerLink="/recherche"
              class="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-2.5 font-semibold text-slate-900 transition hover:bg-amber-400"
            >
              Trouver un véhicule
            </a>
          </div>
        }
      </div>
    </section>
  `,
})
export class MyBookingsPage {
  private readonly auth = inject(AuthService);
  private readonly repository = inject(BookingRepository);

  protected readonly describeDuration = describeRentalDuration;

  protected readonly bookings = computed(() => {
    const user = this.auth.currentUser();
    return user ? this.repository.getForUser(user.id) : [];
  });

  protected cancel(bookingId: string): void {
    this.repository.cancel(bookingId);
  }
}
