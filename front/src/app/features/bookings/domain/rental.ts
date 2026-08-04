/** Formule de location proposée au client. */
export type RentalOption = 'demi-journee' | 'journee' | 'plusieurs-jours';

/** Durée (en jours) d'une demi-journée, pour le calcul du prix. */
export const HALF_DAY = 0.5;

/** Formules affichées dans le sélecteur, dans l'ordre. */
export const RENTAL_OPTIONS: readonly { readonly value: RentalOption; readonly label: string }[] = [
  { value: 'demi-journee', label: 'Demi-journée' },
  { value: 'journee', label: 'Journée' },
  { value: 'plusieurs-jours', label: 'Plusieurs jours' },
];

/** Libellé lisible d'une durée exprimée en jours (0.5 = demi-journée, 1 = journée). */
export function describeRentalDuration(days: number): string {
  if (days === HALF_DAY) {
    return 'Demi-journée';
  }
  if (days === 1) {
    return 'Journée';
  }
  return `${days} jours`;
}
