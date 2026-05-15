import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Curseur "scope" — crosshair full-viewport + label coordonnées.
 * Style forensic / surveyor : on est en train d'analyser une scène de crime tech.
 *
 * - Crosshair = 2 lignes 1px qui traversent l'écran, en mix-blend-mode: difference
 * - Label = "[ X: 1024 / Y: 768 ]" en mono, suit le pointeur
 * - Hover sur lien : crosshair vire rouge, label devient "→ ENTER"
 */
@Component({
  selector: 'app-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cursor.component.html',
  styleUrl: './cursor.component.css',
})
export class CursorComponent {
  private platformId = inject(PLATFORM_ID);
  private vLine = viewChild.required<ElementRef<HTMLDivElement>>('vline');
  private hLine = viewChild.required<ElementRef<HTMLDivElement>>('hline');
  private label = viewChild.required<ElementRef<HTMLDivElement>>('label');
  private root = viewChild.required<ElementRef<HTMLDivElement>>('root');

  readonly hovering = signal(false);
  readonly clicking = signal(false);
  readonly hoverLabel = signal<string | null>(null);
  readonly coordX = signal(0);
  readonly coordY = signal(0);

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      if (window.matchMedia('(pointer: coarse)').matches) return;

      const vLine = this.vLine().nativeElement;
      const hLine = this.hLine().nativeElement;
      const label = this.label().nativeElement;
      const root = this.root().nativeElement;

      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;

      const onMove = (e: PointerEvent) => {
        x = e.clientX;
        y = e.clientY;
        vLine.style.transform = `translateX(${x}px)`;
        hLine.style.transform = `translateY(${y}px)`;
        label.style.transform = `translate3d(${x + 18}px, ${y + 14}px, 0)`;
        // Update text without re-rendering Angular component (perf)
        this.coordX.set(Math.round(x));
        this.coordY.set(Math.round(y));
      };

      const interactive = 'a, button, [role="button"], [data-cursor]';
      const onOver = (e: Event) => {
        const el = (e.target as HTMLElement).closest<HTMLElement>(interactive);
        if (!el) return;
        this.hovering.set(true);
        const cue = el.getAttribute('data-cursor');
        if (cue) {
          this.hoverLabel.set(cue);
        } else if (el.tagName === 'A') {
          const href = (el as HTMLAnchorElement).getAttribute('href') ?? '';
          this.hoverLabel.set(href.startsWith('http') ? '↗ EXTERNAL' : `→ ${href}`);
        } else {
          this.hoverLabel.set('→ ENTER');
        }
      };
      const onOut = (e: Event) => {
        if ((e.target as HTMLElement).closest(interactive)) {
          this.hovering.set(false);
          this.hoverLabel.set(null);
        }
      };

      const onDown = () => this.clicking.set(true);
      const onUp = () => this.clicking.set(false);

      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerover', onOver, { passive: true });
      document.addEventListener('pointerout', onOut, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      window.addEventListener('pointerup', onUp, { passive: true });
      document.documentElement.classList.add('has-custom-cursor');

      // Initial position
      onMove({ clientX: x, clientY: y } as PointerEvent);
      root.classList.add('cursor-root--ready');

      return () => {
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerover', onOver);
        document.removeEventListener('pointerout', onOut);
        window.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointerup', onUp);
        document.documentElement.classList.remove('has-custom-cursor');
      };
    });
  }
}
