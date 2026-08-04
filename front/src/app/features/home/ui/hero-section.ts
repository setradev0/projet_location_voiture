import { Component, output } from '@angular/core';
import { BookingCriteria } from '../../vehicles/domain/booking-criteria.model';
import { BookingSearchForm } from '../../../shared/ui/booking-search-form';

@Component({
  selector: 'app-hero-section',
  imports: [BookingSearchForm],
  template: `
    <section class="relative overflow-hidden bg-slate-950" aria-labelledby="hero-title">
      <!-- Décor -->
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl"></div>
        <div
          class="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl"
        ></div>
      </div>

      <div class="relative mx-auto max-w-6xl px-6 pt-16 pb-16 sm:pt-24 lg:pt-28">
        <div class="max-w-2xl">
          <p
            class="mb-4 inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-sm font-medium text-amber-300"
          >
            Plus de 200 véhicules disponibles
          </p>
          <h1
            id="hero-title"
            class="text-4xl leading-tight font-extrabold text-white sm:text-5xl lg:text-6xl"
          >
            Louez la voiture qu'il vous faut,
            <span class="text-amber-400">en quelques clics</span>
          </h1>
          <p class="mt-6 text-lg text-slate-300">
            Citadines, SUV, berlines et électriques — récupérez votre véhicule dans l'une de nos 15
            agences en France, sans frais cachés et avec annulation gratuite.
          </p>
        </div>

        <div class="mt-10">
          <app-booking-search-form (search)="search.emit($event)" />
        </div>

        <dl class="mt-12 grid grid-cols-3 gap-6 text-center sm:max-w-md sm:text-left">
          <div>
            <dt class="text-sm text-slate-400">Véhicules</dt>
            <dd class="text-2xl font-bold text-white">200+</dd>
          </div>
          <div>
            <dt class="text-sm text-slate-400">Agences</dt>
            <dd class="text-2xl font-bold text-white">15</dd>
          </div>
          <div>
            <dt class="text-sm text-slate-400">Note clients</dt>
            <dd class="text-2xl font-bold text-white">4,8/5</dd>
          </div>
        </dl>
      </div>
    </section>
  `,
})
export class HeroSection {
  readonly search = output<BookingCriteria>();
}
