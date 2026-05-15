import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'm500-sound';

/**
 * Sound design synthétisé via Web Audio API — zéro asset.
 * - click : burst carré court (~50ms)
 * - hover : tick sinusoïdal très bref (~20ms)
 * - drone : pad ambiant loop (deux sinus détunés + filtre passe-bas)
 *
 * Default : muet. L'utilisateur active explicitement.
 * Le drone démarre/s'arrête sur toggle.
 */
@Injectable({ providedIn: 'root' })
export class AudioService {
  private platformId = inject(PLATFORM_ID);
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneNodes: { stop: () => void } | null = null;

  readonly enabled = signal(false);

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.enabled()) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === '1') this.enable();
  }

  toggle(): void {
    if (this.enabled()) this.disable();
    else this.enable();
  }

  private ensureCtx(): AudioContext | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    if (this.ctx) return this.ctx;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    this.ctx = new Ctor();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.0001;
    this.masterGain.connect(this.ctx.destination);
    return this.ctx;
  }

  private enable(): void {
    const ctx = this.ensureCtx();
    if (!ctx || !this.masterGain) return;
    if (ctx.state === 'suspended') ctx.resume();
    this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.4);
    this.startDrone();
    this.enabled.set(true);
    localStorage.setItem(STORAGE_KEY, '1');
  }

  private disable(): void {
    const ctx = this.ctx;
    if (ctx && this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    }
    this.stopDrone();
    this.enabled.set(false);
    localStorage.setItem(STORAGE_KEY, '0');
  }

  click(): void {
    if (!this.enabled()) return;
    const ctx = this.ctx;
    const master = this.masterGain;
    if (!ctx || !master) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.05);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 0.07);
  }

  hover(): void {
    if (!this.enabled()) return;
    const ctx = this.ctx;
    const master = this.masterGain;
    if (!ctx || !master) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2200, t);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.018, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  private startDrone(): void {
    const ctx = this.ctx;
    const master = this.masterGain;
    if (!ctx || !master) return;
    if (this.droneNodes) return;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 480;
    filter.Q.value = 0.8;

    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.06;
    filter.connect(droneGain).connect(master);

    const mkOsc = (freq: number, detune: number) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq;
      o.detune.value = detune;
      o.connect(filter);
      o.start();
      return o;
    };

    const a = mkOsc(55, -8);
    const b = mkOsc(82.5, +6);
    const c = mkOsc(110, -3);

    // LFO sur le filtre pour donner du mouvement
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 90;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    this.droneNodes = {
      stop: () => {
        const t = ctx.currentTime;
        droneGain.gain.cancelScheduledValues(t);
        droneGain.gain.linearRampToValueAtTime(0.0001, t + 0.3);
        setTimeout(() => {
          [a, b, c, lfo].forEach((n) => n.stop());
        }, 350);
      },
    };
  }

  private stopDrone(): void {
    this.droneNodes?.stop();
    this.droneNodes = null;
  }
}
