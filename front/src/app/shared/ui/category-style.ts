import { VehicleCategory } from '../../features/vehicles/domain/vehicle.model';

export interface CategoryStyle {
  readonly label: string;
  readonly gradient: string;
  readonly icon: string;
}

export const CATEGORY_STYLES: Record<VehicleCategory, CategoryStyle> = {
  citadine: { label: 'Citadine', gradient: 'from-sky-500 to-indigo-600', icon: '🚗' },
  berline: { label: 'Berline', gradient: 'from-slate-600 to-slate-900', icon: '🚙' },
  suv: { label: 'SUV', gradient: 'from-emerald-500 to-teal-700', icon: '🚙' },
  électrique: { label: 'Électrique', gradient: 'from-amber-400 to-orange-600', icon: '⚡' },
};
