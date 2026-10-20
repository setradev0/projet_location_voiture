import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { BookingCriteria } from '../domain/booking-criteria.model';
import {
  Fuel,
  NewVehicle,
  Transmission,
  Vehicle,
  VehicleCategory,
} from '../domain/vehicle.model';
import { VehicleRepository } from '../domain/vehicle-repository';

interface VehicleDto {
  id: string;
  brand: string;
  model: string;
  category: string;
  city: string;
  pricePerDay: number;
  seats: number;
  transmission: string;
  fuel: string;
  photoUrl?: string | null;
}

@Injectable()
export class HttpVehicleRepository extends VehicleRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly vehicles = signal<readonly Vehicle[]>([]);
  private hydratePromise: Promise<void> | null = null;

  async hydrate(): Promise<void> {
    if (!this.hydratePromise) {
      this.hydratePromise = firstValueFrom(
        this.http.get<VehicleDto[]>(`${this.baseUrl}/vehicles`).pipe(
          catchError(() => of([] as VehicleDto[])),
        ),
      ).then((list) => {
        this.vehicles.set(list.map((dto) => this.toVehicle(dto)));
      });
    }
    return this.hydratePromise;
  }

  getAll(): readonly Vehicle[] {
    return this.vehicles();
  }

  getFeatured(): readonly Vehicle[] {
    return this.vehicles().slice(0, 6);
  }

  getById(id: string): Vehicle | undefined {
    return this.vehicles().find((vehicle) => vehicle.id === id);
  }

  search(criteria: BookingCriteria): readonly Vehicle[] {
    const city = criteria.city.trim().toLowerCase();
    if (!city) {
      return this.vehicles();
    }
    return this.vehicles().filter((vehicle) => vehicle.city.toLowerCase().includes(city));
  }

  async add(data: NewVehicle): Promise<Vehicle> {
    const created = this.toVehicle(
      await firstValueFrom(this.http.post<VehicleDto>(`${this.baseUrl}/vehicles`, data)),
    );
    this.vehicles.update((list) => [created, ...list]);
    return created;
  }

  async update(id: string, data: NewVehicle): Promise<Vehicle | undefined> {
    if (!this.getById(id)) {
      return undefined;
    }
    const updated = this.toVehicle(
      await firstValueFrom(this.http.put<VehicleDto>(`${this.baseUrl}/vehicles/${id}`, data)),
    );
    this.vehicles.update((list) => list.map((vehicle) => (vehicle.id === id ? updated : vehicle)));
    return updated;
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.baseUrl}/vehicles/${id}`, { responseType: 'text' }),
    );
    this.vehicles.update((list) => list.filter((vehicle) => vehicle.id !== id));
  }

  private toVehicle(dto: VehicleDto): Vehicle {
    return {
      id: dto.id,
      brand: dto.brand,
      model: dto.model,
      category: dto.category as VehicleCategory,
      city: dto.city,
      pricePerDay: dto.pricePerDay,
      seats: dto.seats,
      transmission: dto.transmission as Transmission,
      fuel: dto.fuel as Fuel,
      photoUrl: dto.photoUrl ?? undefined,
    };
  }
}
