import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface BootLine {
  prefix: string;
  text: string;
  status: string;
  className: string;
}

const SESSION_KEY = 'm500-booted';

const LINES: BootLine[] = [
  { prefix: '$', text: 'museum.boot --quiet', status: '...', className: 'text-parchment/60' },
  { prefix: '>', text: 'mounting /memorial', status: 'OK', className: 'text-parchment' },
  { prefix: '>', text: 'loading 5 incident files', status: 'OK', className: 'text-parchment' },
  { prefix: '>', text: 'verifying post-mortems', status: 'OK', className: 'text-parchment' },
  { prefix: '>', text: 'stack trace integrity', status: 'WARN', className: 'text-error/80' },
  { prefix: '>', text: 'request /entry HTTP/1.1', status: '500', className: 'text-error' },
  { prefix: '>', text: 'forcing override', status: '200 OK', className: 'text-terminal' },
];

@Component({
  selector: 'app-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent {
  private platformId = inject(PLATFORM_ID);
  readonly lines = signal<BootLine[]>([]);
  readonly visible = signal(true);
  readonly fading = signal(false);

  constructor() {
    afterNextRender(() => {
      // Run once per session — not on every navigation.
      if (!isPlatformBrowser(this.platformId)) return;
      const seen = sessionStorage.getItem(SESSION_KEY);
      if (seen) {
        this.visible.set(false);
        return;
      }
      this.play();
    });
  }

  private async play(): Promise<void> {
    for (let i = 0; i < LINES.length; i++) {
      await this.wait(140 + Math.random() * 90);
      this.lines.update((l) => [...l, LINES[i]]);
    }
    await this.wait(420);
    this.fading.set(true);
    await this.wait(700);
    this.visible.set(false);
    sessionStorage.setItem(SESSION_KEY, '1');
  }

  private wait(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }
}
