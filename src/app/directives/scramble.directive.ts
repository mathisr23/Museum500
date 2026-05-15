import {
  Directive,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  input,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const CHARS = '!<>-_\\/[]{}—=+*^?#0123456789';

/**
 * Scramble effect : à l'apparition, le texte se "déchiffre" caractère par caractère.
 * Au passage du curseur près de l'élément, redéclenche le scramble brièvement.
 */
@Directive({
  selector: '[appScramble]',
})
export class ScrambleDirective {
  private host: ElementRef<HTMLElement> = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  /** Délai avant démarrage (ms) */
  delay = input(0, { alias: 'appScrambleDelay' });
  /** Active le re-trigger au hover-proximity */
  proximity = input(true, { alias: 'appScrambleProximity' });

  private finalText = '';
  private running = false;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const el = this.host.nativeElement;
      this.finalText = el.textContent ?? '';
      const initialDelay = this.delay();

      // Observer pour démarrer quand l'élément entre dans le viewport
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => this.scramble(800), initialDelay);
              obs.disconnect();
            }
          });
        },
        { threshold: 0.4 },
      );
      obs.observe(el);

      if (this.proximity()) {
        const onMove = (e: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const d = Math.hypot(e.clientX - cx, e.clientY - cy);
          if (d < 120 && !this.running) {
            this.scramble(380);
          }
        };
        window.addEventListener('pointermove', onMove, { passive: true });
      }
    });
  }

  private scramble(duration: number): void {
    this.running = true;
    const el = this.host.nativeElement;
    const text = this.finalText;
    const length = text.length;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const reveal = Math.floor(t * length);
      let out = '';
      for (let i = 0; i < length; i++) {
        if (i < reveal || text[i] === ' ' || text[i] === '\n') {
          out += text[i];
        } else {
          out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      el.textContent = out;
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = text;
        this.running = false;
      }
    };
    requestAnimationFrame(tick);
  }
}
