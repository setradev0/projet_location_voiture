import { User } from '../../auth/domain/user.model';
import { Vehicle } from '../../vehicles/domain/vehicle.model';
import { RentalOption } from './rental';

export type BookingStatus = 'confirmée' | 'annulée';

export interface Booking {
  readonly id: string;
  readonly userId: string;
  readonly userName: string;
  readonly vehicleId: string;
  readonly vehicleLabel: string;
  readonly city: string;
  readonly pickupDate: string;
  readonly returnDate: string;
  readonly days: number;
  readonly totalPrice: number;
  readonly status: BookingStatus;
}

export interface BookingRequest {
  user: User;
  vehicle: Vehicle;
  option: RentalOption;
  /** Date de prise du véhicule (et date unique pour une demi-journée / journée). */
  startDate: string;
  /** Date de retour, requise uniquement pour la formule « plusieurs-jours ». */
  endDate?: string;
}

export type BookingResult = { ok: true; booking: Booking } | { ok: false; error: string };
