import { Injectable, signal } from '@angular/core';
import { nextDay, rentalDays } from '../../vehicles/domain/booking-criteria.model';
import { Booking, BookingRequest, BookingResult } from '../domain/booking.model';
import { HALF_DAY } from '../domain/rental';
import { BookingRepository } from '../domain/booking-repository';

const SEED_BOOKINGS: readonly Booking[] = [
  {
    id: 'b-demo-1',
    userId: 'client-demo',
    userName: 'Camille Client',
    vehicleId: 'tesla-model-3',
    vehicleLabel: 'Tesla Model 3',
    city: 'Paris',
    pickupDate: '2026-08-01',
    returnDate: '2026-08-05',
    days: 4,
    totalPrice: 1580000,
    status: 'confirmée',
  },
];

/** Adaptateur mock : réservations en mémoire, remplaçable par un adaptateur HTTP. */
@Injectable()
export class InMemoryBookingRepository extends BookingRepository {
  private readonly bookings = signal<readonly Booking[]>(SEED_BOOKINGS);
  private nextId = 1;

  getAll(): readonly Booking[] {
    return this.bookings();
  }

  getForUser(userId: string): readonly Booking[] {
    return this.bookings().filter((b) => b.userId === userId);
  }

  isAvailable(vehicleId: string, pickupDate: string, returnDate: string): boolean {
    // Les dates ISO (YYYY-MM-DD) se comparent lexicographiquement.
    return !this.bookings().some(
      (b) =>
        b.vehicleId === vehicleId &&
        b.status === 'confirmée' &&
        b.pickupDate < returnDate &&
        pickupDate < b.returnDate,
    );
  }

  book(request: BookingRequest): BookingResult {
    const { option, startDate, endDate, vehicle } = request;
    if (!startDate) {
      return { ok: false, error: 'Choisissez une date de location.' };
    }

    // Durée, date de retour (fin exclusive) et prix selon la formule choisie.
    // Demi-journée et journée occupent la date entière pour la disponibilité.
    let days: number;
    let returnDate: string;
    if (option === 'plusieurs-jours') {
      const computed = rentalDays({ city: '', pickupDate: startDate, returnDate: endDate ?? '' });
      if (!computed) {
        return { ok: false, error: 'La date de retour doit être après la date de départ.' };
      }
      days = computed;
      returnDate = endDate as string;
    } else {
      days = option === 'demi-journee' ? HALF_DAY : 1;
      returnDate = nextDay(startDate);
    }

    if (!this.isAvailable(vehicle.id, startDate, returnDate)) {
      return { ok: false, error: 'Ce véhicule est déjà réservé sur ces dates.' };
    }

    const totalPrice =
      option === 'demi-journee'
        ? Math.round(vehicle.pricePerDay / 2)
        : days * vehicle.pricePerDay;
    const booking: Booking = {
      id: `b-${Date.now().toString(36)}-${this.nextId++}`,
      userId: request.user.id,
      userName: request.user.name,
      vehicleId: vehicle.id,
      vehicleLabel: `${vehicle.brand} ${vehicle.model}`,
      city: vehicle.city,
      pickupDate: startDate,
      returnDate,
      days,
      totalPrice,
      status: 'confirmée',
    };
    this.bookings.update((list) => [booking, ...list]);
    return { ok: true, booking };
  }

  cancel(bookingId: string): void {
    this.bookings.update((list) =>
      list.map((b) => (b.id === bookingId ? { ...b, status: 'annulée' as const } : b)),
    );
  }
}
