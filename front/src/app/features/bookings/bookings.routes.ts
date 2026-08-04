import { Routes } from '@angular/router';
import { agentGuard, authGuard } from '../auth/auth.guards';

export const BOOKINGS_ROUTES: Routes = [
  {
    path: 'mes-reservations',
    canActivate: [authGuard],
    loadComponent: () => import('./feature/my-bookings-page').then((m) => m.MyBookingsPage),
  },
  {
    path: 'agent/reservations',
    canActivate: [agentGuard],
    loadComponent: () => import('./feature/agent-bookings-page').then((m) => m.AgentBookingsPage),
  },
];
