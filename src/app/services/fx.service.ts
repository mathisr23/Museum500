import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Effet global DOM : click splash — "[CLICK 0xHEX]" qui pop puis fade au clic.
 * Initialisé une fois côté browser.
 */
@Injectable({ providedIn: 'root' })
export class FxService {
  private platformId = inject(PLATFORM_ID);
  private mounted = false;

  mount(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.mounted) return;
    this.mounted = true;

    document.addEventListener(
      'click',
      (e) => this.spawnSplash(e.clientX, e.clientY),
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
