import { Booking, BookingRequest, BookingResult } from './booking.model';

/**
 * Port du domaine réservation. Les lectures sont réactives
 * (cache interne, utilisable dans un computed()).
 */
export abstract class BookingRepository {
  abstract hydrate(): Promise<void>;
  abstract getAll(): readonly Booking[];
  abstract getForUser(userId: string): readonly Booking[];
  /** Vrai si aucune réservation confirmée ne chevauche la période demandée. */
  abstract isAvailable(vehicleId: string, pickupDate: string, returnDate: string): boolean;
  abstract book(request: BookingRequest): Promise<BookingResult>;
  abstract cancel(bookingId: string): Promise<void>;
}
