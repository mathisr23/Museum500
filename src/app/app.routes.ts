import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Museum of 500s — Le mémorial des bugs prod',
  },
  {
    path: 'musee/:slug',
    loadComponent: () =>
      import('./pages/incident/incident.component').then((m) => m.IncidentComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
