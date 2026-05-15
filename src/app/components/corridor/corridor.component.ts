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
import { ParticlesComponent } from '../particles/particles.component';

/**
 * Couloir de musée en perspective CSS pure : sol, plafond, murs en grilles
 * qui convergent vers un point de fuite. Parallaxe au mouvement souris.
 * Particles canvas en overlay.
 */
@Component({
  selector: 'app-corridor',
  imports: [ParticlesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './corridor.component.html',
  styleUrl: './corridor.component.css',
})
export class CorridorComponent {
  private platformId = inject(PLATFORM_ID);
  private root = viewChild.required<ElementRef<HTMLDivElement>>('root');

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const root = this.root().nativeElement;
      let target = { x: 50, y: 50 };
      let current = { x: 50, y: 50 };
      let raf = 0;

      const tick = () => {
        current.x += (target.x - current.x) * 0.06;
        current.y += (target.y - current.y) * 0.06;
        root.style.setProperty('--px', current.x.toFixed(2));
        root.style.setProperty('--py', current.y.toFixed(2));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      const onMove = (e: PointerEvent) => {
        target.x = (e.clientX / window.innerWidth) * 100;
        target.y = (e.clientY / window.innerHeight) * 100;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', onMove);
      };
    });
  }
}
