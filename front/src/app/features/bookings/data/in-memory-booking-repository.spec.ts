import { InMemoryBookingRepository } from './in-memory-booking-repository';
import { BookingRequest } from '../domain/booking.model';
import { User } from '../../auth/domain/user.model';
import { Vehicle } from '../../vehicles/domain/vehicle.model';

const USER: User = { id: 'u1', name: 'Test User', email: 'test@exemple.fr', role: 'client' };
const VEHICLE: Vehicle = {
  id: 'v1',
  brand: 'Renault',
  model: 'Clio V',
  category: 'citadine',
  city: 'Paris',
  pricePerDay: 30,
  seats: 5,
  transmission: 'manuelle',
  fuel: 'essence',
};

const request = (overrides: Partial<BookingRequest> = {}): BookingRequest => ({
  user: USER,
  vehicle: VEHICLE,
  option: 'plusieurs-jours',
  startDate: '2026-09-01',
  endDate: '2026-09-05',
  ...overrides,
});

describe('InMemoryBookingRepository', () => {
  let repository: InMemoryBookingRepository;

  beforeEach(() => {
    repository = new InMemoryBookingRepository();
  });

  it('creates a confirmed booking with computed total price', () => {
    const result = repository.book(request());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.booking.days).toBe(4);
      expect(result.booking.totalPrice).toBe(120);
      expect(result.booking.status).toBe('confirmée');
    }
  });

  it('lists bookings per user', () => {
    repository.book(request());
    expect(repository.getForUser('u1').length).toBe(1);
    expect(repository.getForUser('autre').length).toBe(0);
  });

  it('rejects incoherent dates', () => {
    const result = repository.book(request({ endDate: '2026-08-30' }));
    expect(result.ok).toBe(false);
  });

  it('books a full day (journée) for one day at the daily price', () => {
    const result = repository.book(
      request({ option: 'journee', startDate: '2026-09-10', endDate: undefined }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.booking.days).toBe(1);
      expect(result.booking.totalPrice).toBe(30);
    }
  });

  it('books a half day (demi-journée) at half the daily price', () => {
    const result = repository.book(
      request({ option: 'demi-journee', startDate: '2026-09-10', endDate: undefined }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.booking.days).toBe(0.5);
      expect(result.booking.totalPrice).toBe(15);
    }
  });

  it('blocks the whole day for a single-day booking', () => {
    repository.book(request({ option: 'journee', startDate: '2026-09-10', endDate: undefined }));
    const overlap = repository.book(request({ startDate: '2026-09-10', endDate: '2026-09-12' }));
    expect(overlap.ok).toBe(false);
  });

  it('rejects an overlapping booking on the same vehicle', () => {
    repository.book(request());
    const overlap = repository.book(request({ startDate: '2026-09-04', endDate: '2026-09-08' }));
    expect(overlap.ok).toBe(false);
  });

  it('accepts back-to-back bookings (return day = next pickup day)', () => {
    repository.book(request());
    const contiguous = repository.book(request({ startDate: '2026-09-05', endDate: '2026-09-08' }));
    expect(contiguous.ok).toBe(true);
  });

  it('frees the dates when the booking is cancelled', () => {
    const first = repository.book(request());
    expect(repository.isAvailable('v1', '2026-09-01', '2026-09-05')).toBe(false);
    if (first.ok) {
      repository.cancel(first.booking.id);
    }
    expect(repository.isAvailable('v1', '2026-09-01', '2026-09-05')).toBe(true);
  });

  it('marks the booking as cancelled without deleting it', () => {
    const result = repository.book(request());
    if (result.ok) {
      repository.cancel(result.booking.id);
    }
    const bookings = repository.getForUser('u1');
    expect(bookings.length).toBe(1);
    expect(bookings[0].status).toBe('annulée');
  });
});
