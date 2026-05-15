import { Injectable, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import type { Subscription } from 'rxjs';

interface LenisLike {
  raf(t: number): void;
  scrollTo(target: number, opts?: { immediate?: boolean }): void;
  on(event: 'scroll', cb: () => void): void;
  destroy(): void;
}

/**
 * Wrapper SSR-safe autour de Lenis + scroll-restoration sur navigation.
 * Lenis manipule window/document — initialisé uniquement côté browser.
 * Sur NavigationEnd : scroll instantané au top (Lenis si dispo, sinon natif).
 */
@Injectable({ providedIn: 'root' })
export class ScrollService implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private lenis: LenisLike | null = null;
  private rafId: number | null = null;
  private routerSub: Subscription | null = null;

  async init(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.lenis) {
      const { default: Lenis } = await import('lenis');
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      }) as unknown as LenisLike;

      const tick = (time: number) => {
        this.lenis?.raf(time);
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    }

    if (!this.routerSub) {
      this.routerSub = this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(() => this.toTop());
    }
  }

  /** Accès à l'instance Lenis pour intégration GSAP/ScrollTrigger. */
  getLenis(): LenisLike | null {
    return this.lenis;
  }

  /** Scroll instantané au top — utilisé sur changement de route. */
  toTop(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.lenis) {
      this.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.lenis?.destroy();
    this.routerSub?.unsubscribe();
  }
}
