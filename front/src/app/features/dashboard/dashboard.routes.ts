import { Routes } from '@angular/router';
import { agentGuard } from '../auth/auth.guards';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'agent/tableau-de-bord',
    canActivate: [agentGuard],
    loadComponent: () =>
      import('./feature/agent-dashboard-page').then((m) => m.AgentDashboardPage),
  },
];
