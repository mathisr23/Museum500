import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Overlay de transition entre routes.
 * NavigationStart → curtain noir + ligne terminal "GET /…"
 * NavigationEnd   → ligne "200 OK" puis lift du curtain
 */
@Component({
  selector: 'app-transition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transition.component.html',
  styleUrl: './transition.component.css',
})
export class TransitionComponent {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  readonly active = signal(false);
  readonly status = signal<'request' | 'response'>('request');
  readonly path = signal('/');

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      this.router.events
        .pipe(filter((e) => e instanceof NavigationStart))
        .subscribe((e) => {
          // Skip la transition initiale (refresh)
          if ((e as NavigationStart).restoredState !== null) return;
          this.path.set((e as NavigationStart).url);
          this.status.set('request');
          this.active.set(true);
        });

      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe(() => {
          if (!this.active()) return;
          this.status.set('response');
          setTimeout(() => this.active.set(false), 480);
        });
    });
  }
}
