/**
 * Environnement par défaut (PRODUCTION).
 * En développement, Angular remplace ce fichier par `environment.development.ts`
 * grâce au `fileReplacements` de la configuration `development` (voir angular.json).
 *
 * `apiBaseUrl` est relatif : en production, le front et l'API sont servis derrière
 * le même domaine (reverse proxy), ce qui évite tout problème de CORS.
 */
export const environment = {
  production: true,
  apiBaseUrl: '/api',
};
