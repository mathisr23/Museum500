import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Titre avec effet glitch (RGB split + clip layers).
 * Pure CSS, SSR-safe, pas de JS.
 */
@Component({
  selector: 'app-glitch-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './glitch-text.component.html',
  styleUrl: './glitch-text.component.css',
})
export class GlitchTextComponent {
  text = input.required<string>();
  /** Active la variation chromatique RGB-split */
  chroma = input(true, { transform: (v: boolean | string) => v === '' || v === true });
}
