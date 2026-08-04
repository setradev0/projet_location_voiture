export type VehicleCategory = 'citadine' | 'berline' | 'suv' | 'électrique';
export type Transmission = 'manuelle' | 'automatique';
export type Fuel = 'essence' | 'diesel' | 'hybride' | 'électrique';

export interface Vehicle {
  readonly id: string;
  readonly brand: string;
  readonly model: string;
  readonly category: VehicleCategory;
  readonly city: string;
  readonly pricePerDay: number;
  readonly seats: number;
  readonly transmission: Transmission;
  readonly fuel: Fuel;
  /** Photo réelle du véhicule (data URL). Absente : un visuel par catégorie est affiché. */
  readonly photoUrl?: string;
}

/** Données saisies par un agent avant attribution d'un identifiant. */
export type NewVehicle = Omit<Vehicle, 'id'>;

export const VEHICLE_CATEGORIES: readonly VehicleCategory[] = [
  'citadine',
  'berline',
  'suv',
  'électrique',
];
export const TRANSMISSIONS: readonly Transmission[] = ['manuelle', 'automatique'];
export const FUELS: readonly Fuel[] = ['essence', 'diesel', 'hybride', 'électrique'];
