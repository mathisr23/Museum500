import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Hero image plein-bleed 21:9 pour les pages incident.
 * - srcset 800/1280/1920 webp
 * - vignette top/bottom pour lisibilité
 * - label mono "INSTALLATION 0X · {SLUG_UPPER}"
 * - parallaxe au scroll (image translée plus lentement que le contenu)
 * - eager + fetchpriority high (c'est le LCP de la page)
 */
@Component({
  selector: 'app-incident-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './incident-hero.component.html',
  styleUrl: './incident-hero.component.css',
})
export class IncidentHeroComponent {
  slug = input.required<string>();
  installation = input.required<number>();

  private platformId = inject(PLATFORM_ID);
  private root = viewChild.required<ElementRef<HTMLElement>>('root');

  readonly base = computed(() => `/images/incidents/${this.slug()}`);
  readonly src = computed(() => `${this.base()}-1280.webp`);
  readonly srcset = computed(
    () =>
      `${this.base()}-800.webp 800w, ${this.base()}-1280.webp 1280w, ${this.base()}-1920.webp 1920w`,
  );
  readonly label = computed(() => {
    const num = String(this.installation()).padStart(2, '0');
    return `INSTALLATION ${num} · ${this.slug().toUpperCase().replace(/-/g, '_')}`;
  });

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const root = this.root().nativeElement;
      const img = root.querySelector<HTMLImageElement>('.hero-img');
      if (!img) return;

      let raf = 0;
      const tick = () => {
        const r = root.getBoundingClientRect();
        const vh = window.innerHeight;
        // -1 quand l'élément vient juste d'apparaître par le bas, +1 quand il sort par le haut
        const t = (r.top - vh) / (r.height + vh);
        const offset = Math.max(-1, Math.min(1, t)) * 60; // ±60 px max
        img.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.12)`;
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      return () => cancelAnimationFrame(raf);
    });
  }
}
