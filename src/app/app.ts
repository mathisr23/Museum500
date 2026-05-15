import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './components/loader/loader.component';
import { CursorComponent } from './components/cursor/cursor.component';
import { TransitionComponent } from './components/transition/transition.component';
import { AudioToggleComponent } from './components/audio-toggle/audio-toggle.component';
import { FxService } from './services/fx.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent, CursorComponent, TransitionComponent, AudioToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private fx = inject(FxService);

  constructor() {
    afterNextRender(() => this.fx.mount());
  }
}
