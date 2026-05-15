export interface IncidentSummary {
  slug: string;
  title: string;
  date: string; // ISO 8601
  category: 'technical' | 'finance' | 'operational' | 'ethical' | 'recent';
  shortName: string;
  tagline: string;
  damages: {
    duration: string;
    impact: string;
    cost?: string;
  };
}

export interface IncidentTimelineEntry {
  time: string; // "T+00:03"
  event: string;
}

export interface IncidentTestimony {
  source: string;
  quote: string;
  url: string;
}

export interface IncidentLesson {
  title: string;
  body: string;
}

export interface Incident extends IncidentSummary {
  context: string; // markdown
  culpritCode?: {
    language: string;
    snippet: string;
    annotation: string;
  };
  timeline: IncidentTimelineEntry[];
  testimonies: IncidentTestimony[];
  lessons: IncidentLesson[];
  postMortemUrl: string;
}
