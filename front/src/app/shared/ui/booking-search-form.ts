import { Component, effect, input, output, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { BookingCriteria } from '../../features/vehicles/domain/booking-criteria.model';

@Component({
  selector: 'app-booking-search-form',
  imports: [FormField],
  template: `
    <form
      novalidate
      class="grid gap-4 rounded-2xl bg-white p-6 shadow-2xl sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-start"
      (submit)="onSubmit($event)"
    >
      <div class="flex flex-col gap-1.5">
        <label for="search-city" class="text-sm font-medium text-slate-700">Ville de départ</label>
        <input
          id="search-city"
          type="text"
          placeholder="Paris, Lyon, Marseille…"
          autocomplete="address-level2"
          class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
          [formField]="searchForm.city"
          [attr.aria-invalid]="showError(searchForm.city())"
          [attr.aria-describedby]="showError(searchForm.city()) ? 'search-city-error' : null"
        />
        @if (showError(searchForm.city())) {
          <p id="search-city-error" class="text-sm text-red-600">Indiquez une ville de départ.</p>
        }
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="search-pickup" class="text-sm font-medium text-slate-700">Départ</label>
        <input
          id="search-pickup"
          type="date"
          class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
          [formField]="searchForm.pickupDate"
          [attr.aria-invalid]="showError(searchForm.pickupDate())"
          [attr.aria-describedby]="showError(searchForm.pickupDate()) ? 'search-pickup-error' : null"
        />
        @if (showError(searchForm.pickupDate())) {
          <p id="search-pickup-error" class="text-sm text-red-600">
            Choisissez une date de départ.
          </p>
        }
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="search-return" class="text-sm font-medium text-slate-700">Retour</label>
        <input
          id="search-return"
          type="date"
          class="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
          [formField]="searchForm.returnDate"
          [attr.aria-invalid]="showError(searchForm.returnDate())"
          [attr.aria-describedby]="showError(searchForm.returnDate()) ? 'search-return-error' : null"
        />
        @if (showError(searchForm.returnDate())) {
          <p id="search-return-error" class="text-sm text-red-600">
            Choisissez une date de retour.
          </p>
        }
      </div>

      <div class="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
        <span class="hidden text-sm font-medium lg:block" aria-hidden="true">&nbsp;</span>
        <button
          type="submit"
          class="rounded-lg bg-amber-500 px-6 py-2.5 font-semibold text-slate-900 transition hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
        >
          Rechercher
        </button>
      </div>
    </form>
  `,
})
export class BookingSearchForm {
  /** Critères initiaux (ex. depuis l'URL) pour pré-remplir le formulaire. */
  readonly initial = input<BookingCriteria | null>(null);
  readonly search = output<BookingCriteria>();

  private readonly model = signal<BookingCriteria>({
    city: '',
    pickupDate: '',
    returnDate: '',
  });

  protected readonly searchForm = form(this.model, (path) => {
    required(path.city);
    required(path.pickupDate);
    required(path.returnDate);
  });

  constructor() {
    effect(() => {
      const initial = this.initial();
      if (initial) {
        this.model.set({ ...initial });
      }
    });
  }

  protected showError(state: { touched: () => boolean; invalid: () => boolean }): boolean {
    return state.touched() && state.invalid();
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.searchForm, async () => {
      this.search.emit({ ...this.model() });
      return undefined;
    });
  }
}
