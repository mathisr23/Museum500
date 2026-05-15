import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollService } from './scroll.service';

/**
 * Wrapper SSR-safe pour GSAP + ScrollTrigger.
 * - Charge dynamiquement côté browser uniquement
 * - Intègre Lenis avec ScrollTrigger : on notifie ScrollTrigger.update à
 *   chaque scroll Lenis. Sans ça, les triggers peuvent ne pas se déclencher.
 *
 * IMPORTANT : Lenis est piloté UNIQUEMENT par la boucle RAF de ScrollService.
 * Surtout NE PAS ajouter lenis.raf() à gsap.ticker — ça appellerait raf()
 * deux fois par frame et rendrait le scroll saccadé (cran par cran).
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

        // Intégration Lenis ↔ GSAP ScrollTrigger.
        // On se contente de notifier ScrollTrigger à chaque scroll.
        // Lenis reste piloté par la boucle RAF unique de ScrollService.
        await this.scrollSvc.init();
        const lenis = this.scrollSvc.getLenis();
        if (lenis) {
          lenis.on('scroll', () => stMod.ScrollTrigger.update());
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
