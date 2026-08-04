import { Component, input } from '@angular/core';
import { Vehicle } from '../../vehicles/domain/vehicle.model';
import { VehicleCard } from '../../../shared/ui/vehicle-card';

@Component({
  selector: 'app-featured-vehicles-section',
  imports: [VehicleCard],
  template: `
    <section class="bg-slate-50 py-16 sm:py-20" aria-labelledby="featured-title">
      <div class="mx-auto max-w-6xl px-6">
        <div class="mb-10 max-w-2xl">
          <h2 id="featured-title" class="text-3xl font-bold text-slate-900 sm:text-4xl">
            Nos véhicules populaires
          </h2>
          <p class="mt-3 text-slate-600">
            Une sélection de nos modèles les plus demandés, entretenus et contrôlés avant chaque
            location.
          </p>
        </div>
        <ul class="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (vehicle of vehicles(); track vehicle.id) {
            <li>
              <app-vehicle-card [vehicle]="vehicle" />
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class FeaturedVehiclesSection {
  readonly vehicles = input.required<readonly Vehicle[]>();
}
