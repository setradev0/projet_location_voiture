import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingCriteria } from '../../features/vehicles/domain/booking-criteria.model';
import { Vehicle } from '../../features/vehicles/domain/vehicle.model';
import { CATEGORY_STYLES } from './category-style';
import { AriaryPipe } from './ariary.pipe';

@Component({
  selector: 'app-vehicle-card',
  imports: [RouterLink, AriaryPipe],
  template: `
    <article
      class="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
    >
      @if (vehicle().photoUrl; as photo) {
        <img
          [src]="photo"
          [alt]="'Photo de ' + vehicle().brand + ' ' + vehicle().model"
          class="h-36 w-full object-cover"
        />
      } @else {
        <div
          class="flex h-36 items-center justify-center bg-gradient-to-br text-6xl {{ style().gradient }}"
          aria-hidden="true"
        >
          {{ style().icon }}
        </div>
      }
      <div class="flex flex-1 flex-col gap-3 p-5">
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-lg font-semibold text-slate-900">
            {{ vehicle().brand }} {{ vehicle().model }}
          </h3>
          <span
            class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium whitespace-nowrap text-slate-700"
          >
            {{ style().label }}
          </span>
        </div>
        <p class="text-sm font-medium text-slate-500">📍 {{ vehicle().city }}</p>
        <ul class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
          <li>{{ vehicle().seats }} places</li>
          <li class="capitalize">{{ vehicle().transmission }}</li>
          <li class="capitalize">{{ vehicle().fuel }}</li>
        </ul>
        <div class="mt-auto flex items-center justify-between pt-2">
          <p class="text-slate-900">
            <span class="text-2xl font-bold">{{ vehicle().pricePerDay | ariary }}</span>
            <span class="text-sm text-slate-500">/ jour</span>
            @if (totalPrice(); as total) {
              <span class="block text-sm text-emerald-700">
                {{ total | ariary }} pour {{ rentalDays() }} jour{{ rentalDays()! > 1 ? 's' : '' }}
              </span>
            }
          </p>
          <a
            [routerLink]="['/vehicules', vehicle().id]"
            [queryParams]="linkParams()"
            class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Réserver
          </a>
        </div>
      </div>
    </article>
  `,
})
export class VehicleCard {
  readonly vehicle = input.required<Vehicle>();
  /** Durée du séjour recherché ; affiche le total sur la carte si renseignée. */
  readonly rentalDays = input<number | null>(null);
  /** Critères de recherche à propager vers la page de détail. */
  readonly criteria = input<BookingCriteria | null>(null);

  protected readonly style = computed(() => CATEGORY_STYLES[this.vehicle().category]);
  protected readonly totalPrice = computed(() => {
    const days = this.rentalDays();
    return days ? days * this.vehicle().pricePerDay : null;
  });
  protected readonly linkParams = computed(() => {
    const criteria = this.criteria();
    return criteria
      ? { pickupDate: criteria.pickupDate, returnDate: criteria.returnDate }
      : {};
  });
}
