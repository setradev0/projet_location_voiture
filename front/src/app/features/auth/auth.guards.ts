import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './domain/auth-service';

/** Accès réservé aux utilisateurs connectés ; sinon redirection vers la connexion. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.currentUser()) {
    return true;
  }
  return router.createUrlTree(['/connexion'], { queryParams: { returnUrl: state.url } });
};

/** Accès réservé aux agents ; un client connecté est renvoyé vers la recherche. */
export const agentGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.currentUser();
  if (user?.role === 'agent') {
    return true;
  }
  if (!user) {
    return router.createUrlTree(['/connexion'], { queryParams: { returnUrl: state.url } });
  }
  return router.createUrlTree(['/recherche']);
};
