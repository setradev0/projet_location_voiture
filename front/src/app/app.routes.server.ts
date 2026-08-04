import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    // Pages avec état (session, query params) : rendu à la demande côté serveur.
    path: '**',
    renderMode: RenderMode.Server,
  },
];
