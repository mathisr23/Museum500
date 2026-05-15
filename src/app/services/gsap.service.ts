import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollService } from './scroll.service';

/**
 * Wrapper SSR-safe pour GSAP + ScrollTrigger.
 * - Charge dynamiquement côté browser uniquement
 * - Intègre Lenis avec ScrollTrigger : Lenis pilote via gsap.ticker,
 *   et notifie ScrollTrigger.update à chaque scroll. Sans ça, les
 *   ScrollTrigger peuvent ne pas se déclencher (Lenis intercepte les events natifs).
 */
@Injectable({ providedIn: 'root' })
export class GsapService {
  private platformId = inject(PLATFORM_ID);
  private scrollSvc = inject(ScrollService);
  private loaded: Promise<typeof import('gsap')> | null = null;

  async load() {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('GsapService.load called outside browser');
    }
    if (!this.loaded) {
      this.loaded = (async () => {
        const gsapMod = await import('gsap');
        const stMod = await import('gsap/ScrollTrigger');
        gsapMod.gsap.registerPlugin(stMod.ScrollTrigger);

        // Intégration Lenis ↔ GSAP ScrollTrigger
        await this.scrollSvc.init();
        const lenis = this.scrollSvc.getLenis();
        if (lenis) {
          lenis.on('scroll', () => stMod.ScrollTrigger.update());
          gsapMod.gsap.ticker.add((time) => lenis.raf(time * 1000));
          gsapMod.gsap.ticker.lagSmoothing(0);
        }

        return gsapMod;
      })();
    }
    return this.loaded;
  }

  /** Refresh ScrollTrigger après un changement de layout / route. */
  async refresh() {
    if (!isPlatformBrowser(this.platformId)) return;
    const stMod = await import('gsap/ScrollTrigger');
    stMod.ScrollTrigger.refresh();
  }
}
