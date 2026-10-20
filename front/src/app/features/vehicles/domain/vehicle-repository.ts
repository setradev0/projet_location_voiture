import { BookingCriteria } from './booking-criteria.model';
import { NewVehicle, Vehicle } from './vehicle.model';

/**
 * Port du domaine : toute source de véhicules (API, mock, cache…)
 * doit respecter ce contrat. Les composants n'en connaissent que
 * cette abstraction, jamais l'implémentation concrète.
 *
 * Les lectures sont réactives (cache interne, utilisable dans un `computed()`).
 * `hydrate()` charge ce cache depuis la source.
 */
export abstract class VehicleRepository {
  abstract hydrate(): Promise<void>;
  abstract getAll(): readonly Vehicle[];
  abstract getFeatured(): readonly Vehicle[];
  abstract getById(id: string): Vehicle | undefined;
  abstract search(criteria: BookingCriteria): readonly Vehicle[];
  abstract add(vehicle: NewVehicle): Promise<Vehicle>;
  /** Remplace les données du véhicule ; `undefined` si l'identifiant est inconnu. */
  abstract update(id: string, data: NewVehicle): Promise<Vehicle | undefined>;
  abstract remove(id: string): Promise<void>;
}
