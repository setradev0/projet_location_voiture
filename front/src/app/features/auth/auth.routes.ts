import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'connexion',
    loadComponent: () => import('./feature/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'inscription',
    loadComponent: () => import('./feature/register-page').then((m) => m.RegisterPage),
  },
];
