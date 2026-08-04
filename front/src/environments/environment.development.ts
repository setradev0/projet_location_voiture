/**
 * Environnement de DÉVELOPPEMENT.
 * Utilisé par `ng serve` et `ng build --configuration development`.
 *
 * `apiBaseUrl` pointe vers l'api-gateway lancé en local (voir back/start-all.sh).
 */
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api',
};
