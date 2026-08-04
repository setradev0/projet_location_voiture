import { BookingCriteria } from './booking-criteria.model';
import { NewVehicle, Vehicle } from './vehicle.model';

/**
 * Port du domaine : toute source de véhicules (API, mock, cache…)
 * doit respecter ce contrat. Les composants n'en connaissent que
 * cette abstraction, jamais l'implémentation concrète.
 *
 * Les méthodes de lecture sont réactives : elles lisent l'état interne
 * via des signals et peuvent donc être appelées dans un `computed()`.
 */
export abstract class VehicleRepository {
  abstract getAll(): readonly Vehicle[];
  abstract getFeatured(): readonly Vehicle[];
  abstract getById(id: string): Vehicle | undefined;
  abstract search(criteria: BookingCriteria): readonly Vehicle[];
  abstract add(vehicle: NewVehicle): Vehicle;
  /** Remplace les données du véhicule ; `undefined` si l'identifiant est inconnu. */
  abstract update(id: string, data: NewVehicle): Vehicle | undefined;
  abstract remove(id: string): void;
}
