import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { apiErrorMessage } from '../../../core/http/api-error';
import { Booking, BookingRequest, BookingResult, BookingStatus } from '../domain/booking.model';
import { BookingRepository } from '../domain/booking-repository';

interface BookingDto {
  id: string;
  userId: string;
  userName: string;
  vehicleId: string;
  vehicleLabel: string;
  city: string;
  pickupDate: string;
  returnDate: string;
  days: number;
  totalPrice: number;
  status: string;
}

@Injectable()
export class HttpBookingRepository extends BookingRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly bookings = signal<readonly Booking[]>([]);
  private hydratePromise: Promise<void> | null = null;

  async hydrate(): Promise<void> {
    if (!this.hydratePromise) {
      this.hydratePromise = this.refresh();
    }
    return this.hydratePromise;
  }

  getAll(): readonly Booking[] {
    return this.bookings();
  }

  getForUser(userId: string): readonly Booking[] {
    return this.bookings().filter((booking) => booking.userId === userId);
  }

  isAvailable(vehicleId: string, pickupDate: string, returnDate: string): boolean {
    return !this.bookings().some(
      (booking) =>
        booking.vehicleId === vehicleId &&
        booking.status === 'confirmée' &&
        booking.pickupDate < returnDate &&
        pickupDate < booking.returnDate,
    );
  }

  async book(request: BookingRequest): Promise<BookingResult> {
    const { option, startDate, endDate, vehicle, user } = request;
    if (!startDate) {
      return { ok: false, error: 'Choisissez une date de location.' };
    }
    try {
      const created = this.toBooking(
        await firstValueFrom(
          this.http.post<BookingDto>(`${this.baseUrl}/bookings`, {
            userId: user.id,
            userName: user.name,
            vehicleId: vehicle.id,
            option,
            pickupDate: startDate,
            returnDate: option === 'plusieurs-jours' ? endDate : undefined,
          }),
        ),
      );
      this.bookings.update((list) => [created, ...list]);
      return { ok: true, booking: created };
    } catch (error) {
      return {
        ok: false,
        error: apiErrorMessage(error, 'Impossible d’enregistrer la réservation.'),
      };
    }
  }

  async cancel(bookingId: string): Promise<void> {
    const updated = this.toBooking(
      await firstValueFrom(
        this.http.post<BookingDto>(`${this.baseUrl}/bookings/${bookingId}/cancel`, {}),
      ),
    );
    this.bookings.update((list) =>
      list.map((booking) => (booking.id === bookingId ? updated : booking)),
    );
  }

  private async refresh(): Promise<void> {
    const list = await firstValueFrom(
      this.http.get<BookingDto[]>(`${this.baseUrl}/bookings`).pipe(
        catchError(() => of([] as BookingDto[])),
      ),
    );
    this.bookings.set(list.map((dto) => this.toBooking(dto)));
  }

  private toBooking(dto: BookingDto): Booking {
    return {
      id: dto.id,
      userId: dto.userId,
      userName: dto.userName,
      vehicleId: dto.vehicleId,
      vehicleLabel: dto.vehicleLabel,
      city: dto.city,
      pickupDate: dto.pickupDate,
      returnDate: dto.returnDate,
      days: dto.days,
      totalPrice: dto.totalPrice,
      status: dto.status === 'annulée' ? 'annulée' : ('confirmée' as BookingStatus),
    };
  }
}
