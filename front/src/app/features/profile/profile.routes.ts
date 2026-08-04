import { Routes } from '@angular/router';
import { authGuard } from '../auth/auth.guards';

export const PROFILE_ROUTES: Routes = [
  {
    path: 'profil',
    canActivate: [authGuard],
    loadComponent: () => import('./feature/profile-page').then((m) => m.ProfilePage),
  },
];
