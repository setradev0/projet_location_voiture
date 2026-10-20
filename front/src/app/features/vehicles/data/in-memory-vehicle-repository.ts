import { Injectable, signal } from '@angular/core';
import { BookingCriteria } from '../domain/booking-criteria.model';
import { NewVehicle, Vehicle } from '../domain/vehicle.model';
import { VehicleRepository } from '../domain/vehicle-repository';

const SEED_VEHICLES: readonly Vehicle[] = [
  {
    id: 'clio-5',
    brand: 'Renault',
    model: 'Clio V',
    category: 'citadine',
    city: 'Paris',
    pricePerDay: 145000,
    seats: 5,
    transmission: 'manuelle',
    fuel: 'essence',
  },
  {
    id: 'peugeot-3008',
    brand: 'Peugeot',
    model: '3008',
    category: 'suv',
    city: 'Lyon',
    pricePerDay: 275000,
    seats: 5,
    transmission: 'automatique',
    fuel: 'hybride',
  },
  {
    id: 'tesla-model-3',
    brand: 'Tesla',
    model: 'Model 3',
    category: 'électrique',
    city: 'Paris',
    pricePerDay: 395000,
    seats: 5,
    transmission: 'automatique',
    fuel: 'électrique',
  },
  {
    id: 'bmw-serie-3',
    brand: 'BMW',
    model: 'Série 3',
    category: 'berline',
    city: 'Bordeaux',
    pricePerDay: 345000,
    seats: 5,
    transmission: 'automatique',
    fuel: 'diesel',
  },
  {
    id: 'fiat-500e',
    brand: 'Fiat',
    model: '500e',
    category: 'électrique',
    city: 'Marseille',
    pricePerDay: 175000,
    seats: 4,
    transmission: 'automatique',
    fuel: 'électrique',
  },
  {
    id: 'dacia-duster',
    brand: 'Dacia',
    model: 'Duster',
    category: 'suv',
    city: 'Lyon',
    pricePerDay: 195000,
    seats: 5,
    transmission: 'manuelle',
    fuel: 'essence',
  },
];

/** Adaptateur en mémoire — sera remplacé par un adaptateur HTTP sans toucher aux composants. */
@Injectable()
export class InMemoryVehicleRepository extends VehicleRepository {
  private readonly vehicles = signal<readonly Vehicle[]>(SEED_VEHICLES);
  private nextId = 1;

  async hydrate(): Promise<void> {
    return;
  }

  getAll(): readonly Vehicle[] {
    return this.vehicles();
  }

  getFeatured(): readonly Vehicle[] {
    return this.vehicles().slice(0, 6);
  }

  getById(id: string): Vehicle | undefined {
    return this.vehicles().find((v) => v.id === id);
  }

  search(criteria: BookingCriteria): readonly Vehicle[] {
    const city = criteria.city.trim().toLowerCase();
    if (!city) {
      return this.vehicles();
    }
    return this.vehicles().filter((v) => v.city.toLowerCase().includes(city));
  }

  async add(data: NewVehicle): Promise<Vehicle> {
    const vehicle: Vehicle = { ...data, id: `v-${Date.now().toString(36)}-${this.nextId++}` };
    this.vehicles.update((list) => [vehicle, ...list]);
    return vehicle;
  }

  async update(id: string, data: NewVehicle): Promise<Vehicle | undefined> {
    if (!this.getById(id)) {
      return undefined;
    }
    const vehicle: Vehicle = { ...data, id };
    this.vehicles.update((list) => list.map((v) => (v.id === id ? vehicle : v)));
    return vehicle;
  }

  async remove(id: string): Promise<void> {
    this.vehicles.update((list) => list.filter((v) => v.id !== id));
  }
}
