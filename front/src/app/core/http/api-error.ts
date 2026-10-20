import { HttpErrorResponse } from '@angular/common/http';

/** Extrait le message `{ error }` renvoyé par les services Spring. */
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as { error?: unknown } | string | null;
    if (body && typeof body === 'object' && typeof body.error === 'string' && body.error) {
      return body.error;
    }
  }
  return fallback;
}
