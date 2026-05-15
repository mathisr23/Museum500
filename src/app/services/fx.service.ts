import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AudioService } from './audio.service';

/**
 * Effets globaux DOM :
 * - click splash : "[CLICK 0xHEX]" qui pop puis fade au clic
 * - hover sound branché sur les éléments interactifs
 * Initialisé une fois côté browser.
 */
@Injectable({ providedIn: 'root' })
export class FxService {
  private platformId = inject(PLATFORM_ID);
  private audio = inject(AudioService);
  private mounted = false;

  mount(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.mounted) return;
    this.mounted = true;

    const interactive = 'a, button, [role="button"], [data-cursor]';

    document.addEventListener(
      'click',
      (e) => {
        this.audio.click();
        this.spawnSplash(e.clientX, e.clientY);
      },
      { passive: true },
    );

    document.addEventListener(
      'pointerover',
      (e) => {
        if ((e.target as HTMLElement).closest(interactive)) {
          this.audio.hover();
        }
      },
      { passive: true },
    );
  }

  private spawnSplash(x: number, y: number): void {
    const hex =
      '0x' +
      Math.floor(Math.random() * 0xfffff)
        .toString(16)
        .toUpperCase()
        .padStart(5, '0');
    const el = document.createElement('span');
    el.className = 'fx-splash';
    el.textContent = `[CLICK ${hex}]`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 700);
  }
}
