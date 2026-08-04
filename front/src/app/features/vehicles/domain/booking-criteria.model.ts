export interface BookingCriteria {
  city: string;
  pickupDate: string;
  returnDate: string;
}

/** Nombre de jours de location, ou null si les dates sont absentes/incohérentes. */
export function rentalDays(criteria: BookingCriteria): number | null {
  if (!criteria.pickupDate || !criteria.returnDate) {
    return null;
  }
  const from = Date.parse(criteria.pickupDate);
  const to = Date.parse(criteria.returnDate);
  if (Number.isNaN(from) || Number.isNaN(to) || to <= from) {
    return null;
  }
  return Math.round((to - from) / 86_400_000);
}

/** Renvoie le lendemain d'une date ISO (YYYY-MM-DD), en UTC pour rester déterministe. */
export function nextDay(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}
