import { rentalDays } from './booking-criteria.model';

describe('rentalDays', () => {
  it('computes the number of days between two dates', () => {
    expect(rentalDays({ city: '', pickupDate: '2026-07-20', returnDate: '2026-07-25' })).toBe(5);
  });

  it('returns 1 for a single night', () => {
    expect(rentalDays({ city: '', pickupDate: '2026-07-20', returnDate: '2026-07-21' })).toBe(1);
  });

  it('returns null when a date is missing', () => {
    expect(rentalDays({ city: '', pickupDate: '', returnDate: '2026-07-25' })).toBeNull();
    expect(rentalDays({ city: '', pickupDate: '2026-07-20', returnDate: '' })).toBeNull();
  });

  it('returns null when the return date is before or equal to the pickup date', () => {
    expect(rentalDays({ city: '', pickupDate: '2026-07-25', returnDate: '2026-07-20' })).toBeNull();
    expect(rentalDays({ city: '', pickupDate: '2026-07-20', returnDate: '2026-07-20' })).toBeNull();
  });

  it('returns null for invalid dates', () => {
    expect(rentalDays({ city: '', pickupDate: 'invalide', returnDate: '2026-07-25' })).toBeNull();
  });
});
