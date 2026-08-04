import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { BOOKINGS_ROUTES } from './features/bookings/bookings.routes';
import { DASHBOARD_ROUTES } from './features/dashboard/dashboard.routes';
import { PROFILE_ROUTES } from './features/profile/profile.routes';
import { SEARCH_ROUTES } from './features/search/search.routes';
import { VEHICLES_ROUTES } from './features/vehicles/vehicles.routes';

export const routes: Routes = [
  ...AUTH_ROUTES,
  ...SEARCH_ROUTES,
  ...VEHICLES_ROUTES,
  ...BOOKINGS_ROUTES,
  ...DASHBOARD_ROUTES,
  ...PROFILE_ROUTES,
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
