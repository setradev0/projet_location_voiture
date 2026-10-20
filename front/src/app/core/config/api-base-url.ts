import { InjectionToken } from '@angular/core';

/**
 * URL de base de l'API, injectable dans les adaptateurs HTTP.
 * Sa valeur provient de l'environnement actif (voir `environment.apiBaseUrl`),
 * fournie dans `app.config.ts`.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
