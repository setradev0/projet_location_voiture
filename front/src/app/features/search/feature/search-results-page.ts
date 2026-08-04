import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingRepository } from '../../bookings/domain/booking-repository';
import {
  BookingCriteria,
  rentalDays,
} from '../../vehicles/domain/booking-criteria.model';
import { VEHICLE_CATEGORIES, VehicleCategory } from '../../vehicles/domain/vehicle.model';
import { VehicleRepository } from '../../vehicles/domain/vehicle-repository';
import { BookingSearchForm } from '../../../shared/ui/booking-search-form';
import { VehicleCard } from '../../../shared/ui/vehicle-card';

@Component({
  selector: 'app-search-results-page',
  imports: [BookingSearchForm, VehicleCard],
  template: `
    <section class="bg-slate-50 px-6 py-12" aria-labelledby="results-title">
      <div class="mx-auto max-w-6xl">
        <h1 id="results-title" class="text-3xl font-bold text-slate-900">
          @if (criteria().city) {
            Véhicules disponibles à {{ criteria().city }}
          } @else {
            Tous nos véhicules
          }
        </h1>
        <p class="mt-2 text-slate-600" role="status" aria-live="polite">
          {{ results().length }} véhicule{{ results().length > 1 ? 's' : '' }} disponible{{
            results().length > 1 ? 's' : ''
          }}
          @if (days(); as d) {
            pour {{ d }} jour{{ d > 1 ? 's' : '' }} de location
          }
        </p>

        <div class="mt-8">
          <app-booking-search-form [initial]="criteria()" (search)="onSearch($event)" />
        </div>

        <div class="mt-6 flex items-center gap-3">
          <label for="category-filter" class="text-sm font-medium text-slate-700">
            Catégorie :
          </label>
          <select
            id="category-filter"
            class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 capitalize focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
            [value]="categoryFilter() ?? ''"
            (change)="onCategoryChange($event)"
          >
            <option value="">Toutes</option>
            @for (category of categories; track category) {
              <option [value]="category" class="capitalize">{{ category }}</option>
            }
          </select>
        </div>

        @if (results().length > 0) {
          <ul class="mt-8 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (vehicle of results(); track vehicle.id) {
              <li>
                <app-vehicle-card
                  [vehicle]="vehicle"
                  [rentalDays]="days()"
                  [criteria]="criteria()"
                />
              </li>
            }
          </ul>
        } @else {
          <div class="mt-8 rounded-2xl bg-white p-10 text-center shadow-md ring-1 ring-slate-200">
            <p class="text-lg font-semibold text-slate-900">
              Aucun véhicule disponible pour cette recherche.
            </p>
            <p class="mt-2 text-slate-600">
              Essayez d'autres dates, une autre catégorie, ou une autre ville : Paris, Lyon,
              Marseille ou Bordeaux.
            </p>
          </div>
        }
      </div>
    </section>
  `,
})
export class SearchResultsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly vehicles = inject(VehicleRepository);
  private readonly bookings = inject(BookingRepository);

  private readonly queryParams = toSignal(this.route.queryParamMap);

  protected readonly categories = VEHICLE_CATEGORIES;
  protected readonly categoryFilter = signal<VehicleCategory | null>(null);

  protected readonly criteria = computed<BookingCriteria>(() => {
    const params = this.queryParams();
    return {
      city: params?.get('city') ?? '',
      pickupDate: params?.get('pickupDate') ?? '',
      returnDate: params?.get('returnDate') ?? '',
    };
  });

  protected readonly days = computed(() => rentalDays(this.criteria()));

  protected readonly results = computed(() => {
    const criteria = this.criteria();
    const category = this.categoryFilter();
    const days = this.days();
    return this.vehicles
      .search(criteria)
      .filter((v) => !category || v.category === category)
      .filter(
        (v) =>
          !days || this.bookings.isAvailable(v.id, criteria.pickupDate, criteria.returnDate),
      );
  });

  protected onSearch(criteria: BookingCriteria): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: criteria });
  }

  protected onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.categoryFilter.set(value ? (value as VehicleCategory) : null);
  }
}
