import {
  Directive,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Hero parallax 3D — chaque enfant direct (.parallax-layer) reçoit une translation 3D
 * basée sur sa profondeur (data-depth) et la position de la souris.
 * Active uniquement côté browser, désactive en reduced-motion.
 */
@Directive({
  selector: '[appParallaxHero]',
})
export class ParallaxHeroDirective {
  private host: ElementRef<HTMLElement> = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const root = this.host.nativeElement;
      const layers = Array.from(root.querySelectorAll<HTMLElement>('.parallax-layer'));
      if (!layers.length) return;

      let tx = 0,
        ty = 0,
        cx = 0,
        cy = 0;
      let raf = 0;

      const onMove = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) / r.width;
        ty = (e.clientY - (r.top + r.height / 2)) / r.height;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      const tick = () => {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        for (const layer of layers) {
          const depth = parseFloat(layer.dataset['depth'] ?? '1');
          const x = cx * depth * 22;
          const y = cy * depth * 14;
          layer.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', onMove);
      };
    });
  }
}
