import { Component, computed, inject } from '@angular/core';
import { BookingRepository } from '../domain/booking-repository';
import { describeRentalDuration } from '../domain/rental';
import { AriaryPipe } from '../../../shared/ui/ariary.pipe';

@Component({
  selector: 'app-agent-bookings-page',
  imports: [AriaryPipe],
  template: `
    <section class="bg-slate-50 px-6 py-12" aria-labelledby="agent-bookings-title">
      <div class="mx-auto max-w-5xl">
        <h1 id="agent-bookings-title" class="text-3xl font-bold text-slate-900">
          Réservations de la flotte
        </h1>
        <p class="mt-2 text-slate-600">
          {{ bookings().length }} réservation{{ bookings().length > 1 ? 's' : '' }} au total
        </p>

        @if (bookings().length > 0) {
          <div class="mt-8 overflow-x-auto rounded-2xl bg-white shadow-md ring-1 ring-slate-200">
            <table class="w-full text-left text-sm">
              <thead class="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th scope="col" class="px-5 py-3.5 font-medium">Client</th>
                  <th scope="col" class="px-5 py-3.5 font-medium">Véhicule</th>
                  <th scope="col" class="px-5 py-3.5 font-medium">Ville</th>
                  <th scope="col" class="px-5 py-3.5 font-medium">Période</th>
                  <th scope="col" class="px-5 py-3.5 text-right font-medium">Total</th>
                  <th scope="col" class="px-5 py-3.5 font-medium">Statut</th>
                  <th scope="col" class="px-5 py-3.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-900">
                @for (booking of bookings(); track booking.id) {
                  <tr>
                    <td class="px-5 py-4">{{ booking.userName }}</td>
                    <td class="px-5 py-4 font-medium">{{ booking.vehicleLabel }}</td>
                    <td class="px-5 py-4">{{ booking.city }}</td>
                    <td class="px-5 py-4">
                      @if (booking.days >= 2) {
                        {{ booking.pickupDate }} → {{ booking.returnDate }}
                      } @else {
                        {{ booking.pickupDate }}
                      }
                      <span class="text-slate-500">· {{ describeDuration(booking.days) }}</span>
                    </td>
                    <td class="px-5 py-4 text-right font-semibold">
                      {{ booking.totalPrice | ariary }}
                    </td>
                    <td class="px-5 py-4">
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
                    </td>
                    <td class="px-5 py-4 text-right">
                      @if (booking.status === 'confirmée') {
                        <button
                          type="button"
                          (click)="cancel(booking.id)"
                          class="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                          Annuler
                        </button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="mt-8 rounded-2xl bg-white p-10 text-center shadow-md ring-1 ring-slate-200">
            <p class="text-lg font-semibold text-slate-900">Aucune réservation pour le moment.</p>
          </div>
        }
      </div>
    </section>
  `,
})
export class AgentBookingsPage {
  private readonly repository = inject(BookingRepository);

  protected readonly describeDuration = describeRentalDuration;

  protected readonly bookings = computed(() => this.repository.getAll());

  protected cancel(bookingId: string): void {
    void this.repository.cancel(bookingId);
  }
}
