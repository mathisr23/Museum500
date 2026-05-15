import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-audio-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './audio-toggle.component.html',
  styleUrl: './audio-toggle.component.css',
})
export class AudioToggleComponent {
  private audio = inject(AudioService);
  readonly enabled = this.audio.enabled;

  constructor() {
    afterNextRender(() => this.audio.init());
  }

  onToggle(): void {
    this.audio.toggle();
  }
}
