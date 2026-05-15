import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import type { Incident } from '../data/incident.types';

const SITE_URL = 'https://museum-of-500s.vercel.app';
const SITE_NAME = 'Museum of 500s';
const DEFAULT_OG = `${SITE_URL}/og-default.svg`;

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private doc = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  setHome(): void {
    const desc =
      'Galerie scrollytelling sur les 5 plus grands bugs prod de l\'histoire — Cloudflare 2019, Knight Capital, GitLab, Therac-25, CrowdStrike.';
    this.applyBasic({
      title: `${SITE_NAME} — Le mémorial des bugs prod`,
      description: desc,
      canonical: SITE_URL,
      og: { title: SITE_NAME, description: desc, url: SITE_URL, image: DEFAULT_OG },
    });
    this.injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: desc,
    });
  }

  setIncident(inc: Incident): void {
    const url = `${SITE_URL}/musee/${inc.slug}`;
    this.applyBasic({
      title: `${inc.title} — ${SITE_NAME}`,
      description: inc.tagline,
      canonical: url,
      og: { title: inc.title, description: inc.tagline, url, image: DEFAULT_OG },
    });
    this.injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: inc.title,
      description: inc.tagline,
      datePublished: inc.date,
      url,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
      },
      keywords: ['bug', 'post-mortem', 'incident', inc.category, inc.shortName],
      citation: inc.postMortemUrl,
    });
  }

  private applyBasic(opts: {
    title: string;
    description: string;
    canonical: string;
    og: { title: string; description: string; url: string; image: string };
  }): void {
    this.title.setTitle(opts.title);
    this.meta.updateTag({ name: 'description', content: opts.description });
    this.setLink('canonical', opts.canonical);

    this.meta.updateTag({ property: 'og:title', content: opts.og.title });
    this.meta.updateTag({ property: 'og:description', content: opts.og.description });
    this.meta.updateTag({ property: 'og:url', content: opts.og.url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:image', content: opts.og.image });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: opts.og.title });
    this.meta.updateTag({ name: 'twitter:description', content: opts.og.description });
    this.meta.updateTag({ name: 'twitter:image', content: opts.og.image });
  }

  private setLink(rel: string, href: string): void {
    const head = this.doc.head;
    let link = head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = rel;
      head.appendChild(link);
    }
    link.href = href;
  }

  private injectJsonLd(data: Record<string, unknown>): void {
    if (!isPlatformBrowser(this.platformId)) {
      // Côté SSR, on ajoute le script directement au head pour qu'il soit dans le HTML prerendu
      const head = this.doc.head;
      let script = head.querySelector<HTMLScriptElement>('script[data-ld="page"]');
      if (!script) {
        script = this.doc.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-ld', 'page');
        head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
      return;
    }
    let script = this.doc.querySelector<HTMLScriptElement>('script[data-ld="page"]');
    if (!script) {
      script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-ld', 'page');
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
