import { Pipe, PipeTransform } from '@angular/core';

/** Espace insécable : évite les retours à la ligne au milieu d'un montant. */
const NBSP = ' ';

/**
 * Formate un montant en ariary malgache : « 150 000 Ar ».
 * Séparateur de milliers par espace insécable, symbole « Ar » après le montant
 * (convention à Madagascar). L'ariary n'a pas de sous-unité usuelle : pas de décimales.
 */
@Pipe({ name: 'ariary' })
export class AriaryPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) {
      return '';
    }
    const grouped = Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
    return `${grouped}${NBSP}Ar`;
  }
}
