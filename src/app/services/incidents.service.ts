import { Injectable } from '@angular/core';
import { INCIDENTS } from '../data/incidents.generated';
import type { Incident, IncidentSummary } from '../data/incident.types';

@Injectable({ providedIn: 'root' })
export class IncidentsService {
  list(): IncidentSummary[] {
    return INCIDENTS.map(({ slug, title, shortName, date, category, tagline, damages }) => ({
      slug,
      title,
      shortName,
      date,
      category,
      tagline,
      damages,
    }));
  }

  bySlug(slug: string): Incident | undefined {
    return INCIDENTS.find((i) => i.slug === slug);
  }

  allSlugs(): string[] {
    return INCIDENTS.map((i) => i.slug);
  }

  next(slug: string): IncidentSummary | undefined {
    const list = this.list();
    const idx = list.findIndex((i) => i.slug === slug);
    return idx >= 0 && idx < list.length - 1 ? list[idx + 1] : undefined;
  }

  /** Numéro de salle 1-indexé (basé sur l'ordre chronologique). */
  installationNumber(slug: string): number {
    const idx = INCIDENTS.findIndex((i) => i.slug === slug);
    return idx >= 0 ? idx + 1 : 0;
  }
}
