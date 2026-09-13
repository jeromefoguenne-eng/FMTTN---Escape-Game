"use client";

/**
 * 🎵 Sound Engine for L'Arche FMTTN
 * 100% Procedural Web Audio API — No external MP3 downloads required.
 * Provides high-fidelity ambient space music, tension pulse, and sci-fi SFX.
 */

export type SfxType =
  | "click"
  | "snap"
  | "step"
  | "scan"
  | "success"
  | "error"
  | "unlock"
  | "victory"
  | "alarm"
  | "keystroke";

export type MusicMode = "ambient" | "tension" | "victory" | "off";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private musicMode: MusicMode = "off";

  // Ambient synth nodes
  private musicMasterGain: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  private droneGains: GainNode[] = [];
  private filterNode: BiquadFilterNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;

  // Arp & tension timer loops
  private arpTimer: any = null;
  private pulseTimer: any = null;

  constructor() {
    if (typeof window !== "undefined") {
      const storedSound = localStorage.getItem("fmttn_sound_enabled");
      const storedMusic = localStorage.getItem("fmttn_music_enabled");
      if (storedSound !== null) this.soundEnabled = storedSound === "true";
      if (storedMusic !== null) this.musicEnabled = storedMusic === "true";
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("fmttn_sound_enabled", String(enabled));
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("fmttn_music_enabled", String(enabled));
    }
    if (!enabled) {
      this.stopMusic();
    } else if (this.musicMode !== "off") {
      this.startMusic(this.musicMode);
    }
  }

  public toggleSound(): boolean {
    const next = !this.soundEnabled;
    this.setSoundEnabled(next);
    if (next) this.playSfx("click");
    return next;
  }

  public toggleMusic(): boolean {
    const next = !this.musicEnabled;
    this.setMusicEnabled(next);
    if (next) {
      this.startMusic("ambient");
      this.playSfx("click");
    }
    return next;
  }

  /* ─────────────────────────────────────────────────────────────
     🔊 RICH PROCEDURAL SOUND EFFECTS (SFX)
  ───────────────────────────────────────────────────────────── */
  public playSfx(type: SfxType) {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      switch (type) {
        case "click": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(1400, now);
          osc.frequency.exponentialRampToValueAtTime(700, now + 0.04);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }

        case "keystroke": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(900 + Math.random() * 200, now);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.03);
          break;
        }

        case "snap": {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = "triangle";
          osc2.type = "sine";
          osc1.frequency.setValueAtTime(440, now);
          osc1.frequency.exponentialRampToValueAtTime(220, now + 0.08);
          osc2.frequency.setValueAtTime(880, now);
          osc2.frequency.exponentialRampToValueAtTime(330, now + 0.08);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.09);
          osc2.stop(now + 0.09);
          break;
        }

        case "step": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.linearRampToValueAtTime(260, now + 0.06);
          osc.frequency.linearRampToValueAtTime(140, now + 0.12);

          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(800, now);

          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }

        case "scan": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(1800, now + 0.25);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }

        case "success": {
          const freqs = [523.25, 659.25, 783.99, 1046.5];
          freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);
            gain.gain.setValueAtTime(0.12, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.45);
          });
          break;
        }

        case "error": {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = "sawtooth";
          osc2.type = "sawtooth";
          osc1.frequency.setValueAtTime(145, now);
          osc2.frequency.setValueAtTime(153, now);

          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(450, now);

          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.28);
          osc2.stop(now + 0.28);
          break;
        }

        case "alarm": {
          [0, 0.2].forEach((offset) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(740, now + offset);
            osc.frequency.linearRampToValueAtTime(480, now + offset + 0.16);
            gain.gain.setValueAtTime(0.14, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.17);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + 0.17);
          });
          break;
        }

        case "unlock": {
          const freqs = [220, 277.18, 329.63, 440, 554.37, 659.25, 880];
          freqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = i < 3 ? "triangle" : "sine";
            osc.frequency.setValueAtTime(f, now + i * 0.08);
            gain.gain.setValueAtTime(0.1, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.7);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.7);
          });
          break;
        }

        case "victory": {
          const notes = [
            { f: 523.25, d: 0.2, t: 0 },
            { f: 659.25, d: 0.2, t: 0.2 },
            { f: 783.99, d: 0.2, t: 0.4 },
            { f: 1046.5, d: 0.6, t: 0.6 },
            { f: 880.0, d: 0.3, t: 1.0 },
            { f: 1046.5, d: 1.2, t: 1.3 },
          ];
          notes.forEach(({ f, d, t }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(f, now + t);
            gain.gain.setValueAtTime(0.18, now + t);
            gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + t);
            osc.stop(now + t + d);
          });
          break;
        }
      }
    } catch {
      // AudioContext catch
    }
  }

  /* ─────────────────────────────────────────────────────────────
     🎵 PROCEDURAL SCI-FI AMBIENT MUSIC SYNTHESIZER
  ───────────────────────────────────────────────────────────── */
  public startMusic(mode: MusicMode = "ambient") {
    this.musicMode = mode;
    if (!this.musicEnabled || mode === "off") return;

    const ctx = this.initContext();
    if (!ctx) return;

    this.stopMusicNodesOnly();

    const now = ctx.currentTime;

    this.musicMasterGain = ctx.createGain();
    this.musicMasterGain.gain.setValueAtTime(0.001, now);
    this.musicMasterGain.gain.linearRampToValueAtTime(0.06, now + 2.0);
    this.musicMasterGain.connect(ctx.destination);

    this.filterNode = ctx.createBiquadFilter();
    this.filterNode.type = "lowpass";
    this.filterNode.frequency.setValueAtTime(320, now);
    this.filterNode.Q.setValueAtTime(3.5, now);
    this.filterNode.connect(this.musicMasterGain);

    this.lfoOsc = ctx.createOscillator();
    this.lfoGain = ctx.createGain();
    this.lfoOsc.type = "sine";
    this.lfoOsc.frequency.setValueAtTime(0.12, now);
    this.lfoGain.gain.setValueAtTime(140, now);
    this.lfoOsc.connect(this.lfoGain);
    this.lfoGain.connect(this.filterNode.frequency);
    this.lfoOsc.start(now);

    const dronePitches = [55.0, 82.41, 110.0, 164.81];
    dronePitches.forEach((freq, i) => {
      if (!ctx || !this.filterNode) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = i === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.4, now);

      gain.gain.setValueAtTime(i === 0 ? 0.35 : 0.15, now);

      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(now);

      this.droneOscs.push(osc);
      this.droneGains.push(gain);
    });

    const pentatonicScale = [440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    this.arpTimer = setInterval(() => {
      if (!this.musicEnabled || !this.ctx || !this.musicMasterGain) return;
      try {
        const noteCtx = this.ctx;
        const noteNow = noteCtx.currentTime;
        const note = pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];

        const osc = noteCtx.createOscillator();
        const gain = noteCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(note, noteNow);

        gain.gain.setValueAtTime(0.035, noteNow);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteNow + 2.2);

        osc.connect(gain);
        gain.connect(this.musicMasterGain);
        osc.start(noteNow);
        osc.stop(noteNow + 2.2);
      } catch {}
    }, 2800);

    if (mode === "tension") {
      this.pulseTimer = setInterval(() => {
        if (!this.musicEnabled || !this.ctx || !this.musicMasterGain) return;
        try {
          const pulseCtx = this.ctx;
          const pNow = pulseCtx.currentTime;

          const osc = pulseCtx.createOscillator();
          const gain = pulseCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(65, pNow);
          osc.frequency.exponentialRampToValueAtTime(35, pNow + 0.18);

          gain.gain.setValueAtTime(0.18, pNow);
          gain.gain.exponentialRampToValueAtTime(0.001, pNow + 0.22);

          osc.connect(gain);
          gain.connect(this.musicMasterGain);
          osc.start(pNow);
          osc.stop(pNow + 0.22);
        } catch {}
      }, 1000);
    }
  }

  private stopMusicNodesOnly() {
    if (this.arpTimer) {
      clearInterval(this.arpTimer);
      this.arpTimer = null;
    }
    if (this.pulseTimer) {
      clearInterval(this.pulseTimer);
      this.pulseTimer = null;
    }

    this.droneOscs.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.droneOscs = [];
    this.droneGains = [];

    if (this.lfoOsc) {
      try {
        this.lfoOsc.stop();
        this.lfoOsc.disconnect();
      } catch {}
      this.lfoOsc = null;
    }

    if (this.filterNode) {
      try {
        this.filterNode.disconnect();
      } catch {}
      this.filterNode = null;
    }

    if (this.musicMasterGain) {
      try {
        this.musicMasterGain.disconnect();
      } catch {}
      this.musicMasterGain = null;
    }
  }

  public stopMusic() {
    this.musicMode = "off";
    this.stopMusicNodesOnly();
  }
}

export const soundEngine = new SoundEngine();
