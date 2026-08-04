import { InMemoryVehicleRepository } from './in-memory-vehicle-repository';
import { NewVehicle } from '../domain/vehicle.model';

const NEW_VEHICLE: NewVehicle = {
  brand: 'Citroën',
  model: 'C3',
  category: 'citadine',
  city: 'Toulouse',
  pricePerDay: 32,
  seats: 5,
  transmission: 'manuelle',
  fuel: 'essence',
};

describe('InMemoryVehicleRepository', () => {
  let repository: InMemoryVehicleRepository;

  beforeEach(() => {
    repository = new InMemoryVehicleRepository();
  });

  it('seeds the catalog with vehicles', () => {
    expect(repository.getAll().length).toBeGreaterThan(0);
    expect(repository.getFeatured().length).toBeLessThanOrEqual(6);
  });

  it('finds a vehicle by id', () => {
    expect(repository.getById('clio-5')?.brand).toBe('Renault');
    expect(repository.getById('inconnu')).toBeUndefined();
  });

  it('filters by city, case-insensitively', () => {
    const results = repository.search({ city: 'lyon', pickupDate: '', returnDate: '' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((v) => v.city === 'Lyon')).toBe(true);
  });

  it('returns every vehicle when the city is empty', () => {
    const results = repository.search({ city: '  ', pickupDate: '', returnDate: '' });
    expect(results.length).toBe(repository.getAll().length);
  });

  it('adds a vehicle with a generated id, visible in search', () => {
    const added = repository.add(NEW_VEHICLE);
    expect(added.id).toBeTruthy();
    const results = repository.search({ city: 'Toulouse', pickupDate: '', returnDate: '' });
    expect(results.map((v) => v.id)).toContain(added.id);
  });

  it('updates a vehicle while keeping its id', () => {
    const added = repository.add(NEW_VEHICLE);
    const updated = repository.update(added.id, { ...NEW_VEHICLE, pricePerDay: 45, city: 'Nice' });
    expect(updated?.id).toBe(added.id);
    expect(repository.getById(added.id)?.pricePerDay).toBe(45);
    expect(repository.getById(added.id)?.city).toBe('Nice');
  });

  it('returns undefined when updating an unknown vehicle', () => {
    expect(repository.update('inconnu', NEW_VEHICLE)).toBeUndefined();
    expect(repository.getById('inconnu')).toBeUndefined();
  });

  it('removes a vehicle from the catalog', () => {
    const added = repository.add(NEW_VEHICLE);
    repository.remove(added.id);
    expect(repository.getById(added.id)).toBeUndefined();
  });
});
