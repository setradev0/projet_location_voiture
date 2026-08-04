import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BookingCriteria } from '../../vehicles/domain/booking-criteria.model';
import { VehicleRepository } from '../../vehicles/domain/vehicle-repository';
import { FeaturedVehiclesSection } from '../ui/featured-vehicles-section';
import { HeroSection } from '../ui/hero-section';

@Component({
  selector: 'app-home-page',
  imports: [HeroSection, FeaturedVehiclesSection],
  template: `
    <app-hero-section (search)="onSearch($event)" />
    <app-featured-vehicles-section [vehicles]="featuredVehicles()" />
  `,
})
export class HomePage {
  private readonly repository = inject(VehicleRepository);
  private readonly router = inject(Router);

  protected readonly featuredVehicles = computed(() => this.repository.getFeatured());

  protected onSearch(criteria: BookingCriteria): void {
    this.router.navigate(['/recherche'], { queryParams: criteria });
  }
}
