import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IncidentsService } from '../../services/incidents.service';
import { ScrollService } from '../../services/scroll.service';
import { GsapService } from '../../services/gsap.service';
import { SeoService } from '../../services/seo.service';
import { GlitchTextComponent } from '../../components/glitch-text/glitch-text.component';
import { IncidentHeroComponent } from '../../components/incident-hero/incident-hero.component';

@Component({
  selector: 'app-incident',
  imports: [RouterLink, DatePipe, DecimalPipe, GlitchTextComponent, IncidentHeroComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './incident.component.html',
  styleUrl: './incident.component.css',
})
export class IncidentComponent {
  private incidents = inject(IncidentsService);
  private scroll = inject(ScrollService);
  private gsapSvc = inject(GsapService);
  private seo = inject(SeoService);
  private platformId = inject(PLATFORM_ID);
  private root = viewChild<ElementRef<HTMLElement>>('root');

  slug = input.required<string>();

  readonly incident = computed(() => this.incidents.bySlug(this.slug()));
  readonly nextRoom = computed(() => this.incidents.next(this.slug()));
  readonly installation = computed(() => this.incidents.installationNumber(this.slug()));

  constructor() {
    effect(() => {
      const inc = this.incident();
      if (inc) this.seo.setIncident(inc);
    });
    afterNextRender(async () => {
      this.scroll.init();
      if (!isPlatformBrowser(this.platformId)) return;
      await this.setupScrollAnimations();
    });
  }

  private async setupScrollAnimations(): Promise<void> {
    const el = this.root()?.nativeElement;
    if (!el) return;

    // Reduced-motion : on saute toute l'animation et on s'assure que
    // les éléments sont visibles (au cas où un état initial CSS les masquerait).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.querySelectorAll<HTMLElement>('[data-reveal-child]').forEach((n) => {
        n.style.opacity = '1';
        n.style.transform = 'none';
      });
      return;
    }

    const { gsap } = await this.gsapSvc.load();

    // Reveal staggered de chaque section et de leurs enfants directs.
    // once: true → joue une fois et reste visible. Évite le bug où le bouton
    // disparaît si le ScrollTrigger reverse sur scroll-up et ne re-trigger plus.
    const sections = el.querySelectorAll<HTMLElement>('[data-reveal]');
    sections.forEach((section) => {
      const items = section.querySelectorAll<HTMLElement>('[data-reveal-child]');
      gsap.from(items.length ? items : [section], {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.07,
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true,
        },
      });
    });

    // Trait vertical de la timeline qui se dessine au scroll.
    const line = el.querySelector<HTMLElement>('[data-timeline-line]');
    const timeline = el.querySelector<HTMLElement>('[data-timeline]');
    if (line && timeline) {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: {
            trigger: timeline,
            start: 'top 75%',
            end: 'bottom 60%',
            scrub: 0.6,
          },
        },
      );
    }

    await this.gsapSvc.refresh();

    // Filet de sécurité : si après 1.8s certains data-reveal-child sont
    // toujours invisibles (trigger qui n'a jamais fire), on les révèle.
    setTimeout(() => {
      el.querySelectorAll<HTMLElement>('[data-reveal-child]').forEach((n) => {
        const cs = window.getComputedStyle(n);
        if (parseFloat(cs.opacity) < 0.05) {
          gsap.to(n, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
        }
      });
    }, 1800);
  }
}
