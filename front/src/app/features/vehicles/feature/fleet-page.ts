import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VehicleRepository } from '../domain/vehicle-repository';
import { CATEGORY_STYLES } from '../../../shared/ui/category-style';
import { AriaryPipe } from '../../../shared/ui/ariary.pipe';

@Component({
  selector: 'app-fleet-page',
  imports: [RouterLink, AriaryPipe],
  template: `
    <section class="bg-slate-50 px-6 py-12" aria-labelledby="fleet-title">
      <div class="mx-auto max-w-5xl">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 id="fleet-title" class="text-3xl font-bold text-slate-900">Ma flotte</h1>
            <p class="mt-2 text-slate-600">
              {{ vehicles().length }} véhicule{{ vehicles().length > 1 ? 's' : '' }} en service
            </p>
          </div>
          <a
            routerLink="/agent/vehicules/nouveau"
            class="rounded-lg bg-amber-500 px-5 py-2.5 font-semibold text-slate-900 transition hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            + Ajouter un véhicule
          </a>
        </div>

        <div class="mt-8 overflow-x-auto rounded-2xl bg-white shadow-md ring-1 ring-slate-200">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th scope="col" class="px-5 py-3.5 font-medium">Véhicule</th>
                <th scope="col" class="px-5 py-3.5 font-medium">Catégorie</th>
                <th scope="col" class="px-5 py-3.5 font-medium">Ville</th>
                <th scope="col" class="px-5 py-3.5 text-right font-medium">Prix / jour</th>
                <th scope="col" class="px-5 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-900">
              @for (vehicle of vehicles(); track vehicle.id) {
                <tr>
                  <td class="px-5 py-4 font-medium">
                    <div class="flex items-center gap-3">
                      @if (vehicle.photoUrl; as photo) {
                        <img
                          [src]="photo"
                          [alt]="'Photo de ' + vehicle.brand + ' ' + vehicle.model"
                          class="h-10 w-14 shrink-0 rounded object-cover"
                        />
                      } @else {
                        <span
                          class="flex h-10 w-14 shrink-0 items-center justify-center rounded bg-gradient-to-br text-lg {{
                            categoryStyles[vehicle.category].gradient
                          }}"
                          aria-hidden="true"
                        >
                          {{ categoryStyles[vehicle.category].icon }}
                        </span>
                      }
                      <a
                        [routerLink]="['/vehicules', vehicle.id]"
                        class="text-slate-900 underline-offset-2 hover:underline"
                      >
                        {{ vehicle.brand }} {{ vehicle.model }}
                      </a>
                    </div>
                  </td>
                  <td class="px-5 py-4 capitalize">{{ vehicle.category }}</td>
                  <td class="px-5 py-4">{{ vehicle.city }}</td>
                  <td class="px-5 py-4 text-right">{{ vehicle.pricePerDay | ariary }}</td>
                  <td class="px-5 py-4 text-right">
                    <div class="inline-flex items-center gap-2">
                      <a
                        [routerLink]="['/agent/vehicules', vehicle.id, 'modifier']"
                        class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                      >
                        Modifier
                      </a>
                      <button
                        type="button"
                        (click)="remove(vehicle.id)"
                        class="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      >
                        Retirer
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
})
export class FleetPage {
  private readonly repository = inject(VehicleRepository);

  protected readonly categoryStyles = CATEGORY_STYLES;
  protected readonly vehicles = computed(() => this.repository.getAll());

  protected remove(id: string): void {
    void this.repository.remove(id);
  }
}
