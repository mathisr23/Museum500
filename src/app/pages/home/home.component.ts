import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IncidentsService } from '../../services/incidents.service';
import { ScrollService } from '../../services/scroll.service';
import { SeoService } from '../../services/seo.service';
import { GlitchTextComponent } from '../../components/glitch-text/glitch-text.component';
import { CorridorComponent } from '../../components/corridor/corridor.component';
import { MarqueeComponent } from '../../components/marquee/marquee.component';
import { ScrambleDirective } from '../../directives/scramble.directive';
import { ParallaxHeroDirective } from '../../directives/parallax-hero.directive';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe,
    GlitchTextComponent,
    CorridorComponent,
    MarqueeComponent,
    ScrambleDirective,
    ParallaxHeroDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private incidents = inject(IncidentsService);
  private scroll = inject(ScrollService);
  private seo = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  readonly rooms = this.incidents.list();
  readonly errorCount = signal(0);

  constructor() {
    this.seo.setHome();
    afterNextRender(() => {
      this.scroll.init();
      if (isPlatformBrowser(this.platformId)) this.startCounter();
    });
  }

  private startCounter(): void {
    const base = 38_294_103;
    let value = base;
    this.errorCount.set(value);
    setInterval(() => {
      value += 1 + Math.floor(Math.random() * 4);
      this.errorCount.set(value);
    }, 240);
  }
}
