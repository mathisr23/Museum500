import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  vy: number;
  vx: number;
  text: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

const VOCAB = [
  '500', '502', '404', 'NULL', 'NaN', '0xDEAD', 'EOF',
  'rm -rf', 'CVE', 'panic', 'sigterm', 'OOM',
  'race', 'leak', 'overflow', 'undefined', '127.0.0.1',
  'fork()', 'segv', 'EBADF', 'EACCES', 'try{}',
];

/**
 * Champ de particules : caractères mono qui flottent vers le haut, fade in/out.
 * Canvas2D, devicePixelRatio-aware, throttle si onglet inactif.
 * Désactivé en reduced-motion.
 */
@Component({
  selector: 'app-particles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<canvas #canvas class="particles" aria-hidden="true"></canvas>',
  styles: [
    `
      :host {
        position: absolute;
        inset: 0;
        pointer-events: none;
        display: block;
      }
      .particles {
        width: 100%;
        height: 100%;
        display: block;
        opacity: 0.55;
      }
    `,
  ],
})
export class ParticlesComponent {
  private platformId = inject(PLATFORM_ID);
  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const cv = this.canvas().nativeElement;
      const ctx = cv.getContext('2d');
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let w = 0;
      let h = 0;
      const particles: Particle[] = [];
      const max = 28;

      const resize = () => {
        const r = cv.getBoundingClientRect();
        w = r.width;
        h = r.height;
        cv.width = Math.floor(w * dpr);
        cv.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(cv);

      const spawn = (): Particle => {
        const maxLife = 5500 + Math.random() * 4500;
        return {
          x: Math.random() * w,
          y: h + 20,
          vy: -(0.18 + Math.random() * 0.4),
          vx: (Math.random() - 0.5) * 0.12,
          text: VOCAB[Math.floor(Math.random() * VOCAB.length)],
          size: 9 + Math.random() * 5,
          alpha: 0,
          life: 0,
          maxLife,
        };
      };

      let raf = 0;
      let last = performance.now();
      const tick = (now: number) => {
        const dt = Math.min(48, now - last);
        last = now;

        if (particles.length < max && Math.random() < 0.06) particles.push(spawn());

        ctx.clearRect(0, 0, w, h);
        ctx.font = '500 11px "JetBrains Mono", monospace';
        ctx.textBaseline = 'middle';

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life += dt;
          p.x += p.vx * dt * 0.06;
          p.y += p.vy * dt * 0.12;
          // Fade in/out (in first 20%, out last 30%)
          const t = p.life / p.maxLife;
          if (t < 0.2) p.alpha = t / 0.2;
          else if (t > 0.7) p.alpha = (1 - t) / 0.3;
          else p.alpha = 1;

          if (t >= 1 || p.y < -20) {
            particles.splice(i, 1);
            continue;
          }

          ctx.font = `${Math.round(p.size)}px "JetBrains Mono", monospace`;
          ctx.fillStyle = `rgba(232, 230, 225, ${(p.alpha * 0.35).toFixed(3)})`;
          ctx.fillText(p.text, p.x, p.y);
        }

        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
      };
    });
  }
}
