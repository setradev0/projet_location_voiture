import { Routes } from '@angular/router';
import { authGuard } from '../auth/auth.guards';

export const SEARCH_ROUTES: Routes = [
  {
    path: 'recherche',
    canActivate: [authGuard],
    loadComponent: () => import('./feature/search-results-page').then((m) => m.SearchResultsPage),
  },
];
