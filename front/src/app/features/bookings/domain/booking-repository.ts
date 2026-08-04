import { Booking, BookingRequest, BookingResult } from './booking.model';

/**
 * Port du domaine réservation. Les méthodes de lecture sont réactives
 * (utilisables dans un computed()).
 */
export abstract class BookingRepository {
  abstract getAll(): readonly Booking[];
  abstract getForUser(userId: string): readonly Booking[];
  /** Vrai si aucune réservation confirmée ne chevauche la période demandée. */
  abstract isAvailable(vehicleId: string, pickupDate: string, returnDate: string): boolean;
  abstract book(request: BookingRequest): BookingResult;
  abstract cancel(bookingId: string): void;
}
