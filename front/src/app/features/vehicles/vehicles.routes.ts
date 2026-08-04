import { Routes } from '@angular/router';
import { agentGuard } from '../auth/auth.guards';

export const VEHICLES_ROUTES: Routes = [
  {
    path: 'vehicules/:id',
    loadComponent: () => import('./feature/vehicle-detail-page').then((m) => m.VehicleDetailPage),
  },
  {
    path: 'agent/vehicules/nouveau',
    canActivate: [agentGuard],
    loadComponent: () => import('./feature/vehicle-register-page').then((m) => m.VehicleRegisterPage),
  },
  {
    path: 'agent/vehicules/:id/modifier',
    canActivate: [agentGuard],
    loadComponent: () => import('./feature/vehicle-register-page').then((m) => m.VehicleRegisterPage),
  },
  {
    path: 'agent/flotte',
    canActivate: [agentGuard],
    loadComponent: () => import('./feature/fleet-page').then((m) => m.FleetPage),
  },
];
