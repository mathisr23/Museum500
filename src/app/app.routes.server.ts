import { RenderMode, type ServerRoute } from '@angular/ssr';
import { INCIDENTS } from './data/incidents.generated';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'musee/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => INCIDENTS.map((i) => ({ slug: i.slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
