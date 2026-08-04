import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/home-page').then((m) => m.HomePage),
  },
];
