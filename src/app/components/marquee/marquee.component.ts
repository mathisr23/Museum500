import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Bandeau marquee horizontal : codes HTTP / mots-clés du musée qui défilent.
 * Animation CSS pure, zéro JS.
 */
@Component({
  selector: 'app-marquee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './marquee.component.html',
  styleUrl: './marquee.component.css',
})
export class MarqueeComponent {
  readonly items = [
    'HTTP/1.1 500',
    'KERNEL_PANIC',
    '— catastrophic backtracking —',
    'rm -rf /',
    'CVE-2024-???',
    'race condition',
    'segfault',
    'infinite loop',
    'OOM killed',
    'Malfunction 54',
    'exit code 137',
    '— null pointer —',
    'BSOD x 8 500 000',
    'PRODUCTION DOWN',
  ];
}
