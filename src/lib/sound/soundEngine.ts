"use client";

/**
 * 🎵 Classical Music & SFX Engine for L'Arche FMTTN
 * 
 * 100% Procedural Web Audio API — No external MP3 downloads required.
 * - Classical Piece in D Minor (Baroque / Classical Romantic string & piano synthesis).
 * - Dynamically becomes more oppressive, faster, and intense as the chrono counts down!
 * - Automatic browser autoplay unlock on first click/touch.
 * - Complete SFX suite.
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

export type MusicMode = "classical" | "victory" | "off";

// Note frequencies in Hz for classical D minor palette
const N = {
  // Bass octave 1 & 2
  D1: 36.71,
  A1: 55.0,
  Bb1: 58.27,
  C2: 65.41,
  CS2: 69.3,
  D2: 73.42,
  E2: 82.41,
  F2: 87.31,
  G2: 98.0,
  A2: 110.0,
  Bb2: 116.54,
  CS3: 138.59,
  // Mid octave 3
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  Bb3: 233.08,
  CS4: 277.18,
  // High octave 4 & 5
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  Bb4: 466.16,
  CS5: 554.37,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
};

// 8-measure Classical progression in D Minor (Bach / Vivaldi / Beethoven style)
interface Measure {
  bass: number[];
  chords: number[][];
  melody: { note: number; beat: number; dur: number }[];
}

const CLASSICAL_MEASURES: Measure[] = [
  // Measure 1: D minor (Solemn, noble)
  {
    bass: [N.D2, N.A1, N.D2, N.A1],
    chords: [
      [N.D3, N.F3, N.A3, N.D4],
      [N.F3, N.A3, N.D4, N.F4],
      [N.A3, N.D4, N.F4, N.A4],
      [N.D4, N.F4, N.A4, N.D5],
    ],
    melody: [
      { note: N.D4, beat: 0, dur: 0.8 },
      { note: N.F4, beat: 1, dur: 0.8 },
      { note: N.A4, beat: 2, dur: 1.2 },
      { note: N.D5, beat: 3.2, dur: 0.6 },
    ],
  },
  // Measure 2: G minor / Bb (Melancholic questioning)
  {
    bass: [N.G2, N.D2, N.Bb1, N.D2],
    chords: [
      [N.G3, N.Bb3, N.D4, N.G4],
      [N.Bb3, N.D4, N.G4, N.Bb4],
      [N.D4, N.G4, N.Bb4, N.D5],
      [N.Bb3, N.D4, N.G4, N.Bb4],
    ],
    melody: [
      { note: N.Bb4, beat: 0, dur: 1.0 },
      { note: N.A4, beat: 1, dur: 0.5 },
      { note: N.G4, beat: 1.5, dur: 0.5 },
      { note: N.D4, beat: 2, dur: 1.8 },
    ],
  },
  // Measure 3: C# diminished / A7 (Tension building)
  {
    bass: [N.CS2, N.A1, N.CS2, N.A1],
    chords: [
      [N.A3, N.CS4, N.E4, N.G4],
      [N.CS4, N.E4, N.G4, N.A4],
      [N.E4, N.G4, N.A4, N.CS5],
      [N.G4, N.A4, N.CS5, N.E5],
    ],
    melody: [
      { note: N.CS5, beat: 0, dur: 0.8 },
      { note: N.E5, beat: 1, dur: 0.8 },
      { note: N.CS5, beat: 2, dur: 0.8 },
      { note: N.A4, beat: 3, dur: 1.0 },
    ],
  },
  // Measure 4: D minor (First cadence)
  {
    bass: [N.D2, N.F2, N.A2, N.D2],
    chords: [
      [N.D3, N.F3, N.A3, N.D4],
      [N.A3, N.D4, N.F4, N.A4],
      [N.F3, N.A3, N.D4, N.F4],
      [N.D3, N.F3, N.A3, N.D4],
    ],
    melody: [
      { note: N.D5, beat: 0, dur: 1.5 },
      { note: N.CS5, beat: 1.5, dur: 0.5 },
      { note: N.D5, beat: 2, dur: 1.8 },
    ],
  },
  // Measure 5: Bb Major (Dramatic expansion)
  {
    bass: [N.Bb1, N.F2, N.Bb1, N.F2],
    chords: [
      [N.Bb3, N.D4, N.F4, N.Bb4],
      [N.D4, N.F4, N.Bb4, N.D5],
      [N.F4, N.Bb4, N.D5, N.F5],
      [N.D4, N.F4, N.Bb4, N.D5],
    ],
    melody: [
      { note: N.F5, beat: 0, dur: 1.0 },
      { note: N.D5, beat: 1, dur: 0.8 },
      { note: N.Bb4, beat: 2, dur: 1.0 },
      { note: N.A4, beat: 3, dur: 0.8 },
    ],
  },
  // Measure 6: G minor 7 (Descent into darkness)
  {
    bass: [N.G2, N.Bb1, N.D2, N.G2],
    chords: [
      [N.G3, N.Bb3, N.D4, N.F4],
      [N.Bb3, N.D4, N.F4, N.G4],
      [N.D4, N.F4, N.G4, N.Bb4],
      [N.F4, N.G4, N.Bb4, N.D5],
    ],
    melody: [
      { note: N.G4, beat: 0, dur: 0.8 },
      { note: N.Bb4, beat: 1, dur: 0.8 },
      { note: N.D5, beat: 2, dur: 1.2 },
      { note: N.CS5, beat: 3.2, dur: 0.6 },
    ],
  },
  // Measure 7: A7 with flat 9 (Maximum Baroque / Oppressive Suspense!)
  {
    bass: [N.A1, N.CS2, N.E2, N.A1],
    chords: [
      [N.A3, N.CS4, N.E4, N.Bb4],
      [N.CS4, N.E4, N.G4, N.Bb4],
      [N.E4, N.G4, N.Bb4, N.CS5],
      [N.G4, N.Bb4, N.CS5, N.E5],
    ],
    melody: [
      { note: N.E5, beat: 0, dur: 0.8 },
      { note: N.F5, beat: 0.8, dur: 0.4 },
      { note: N.E5, beat: 1.2, dur: 0.4 },
      { note: N.D5, beat: 1.6, dur: 0.4 },
      { note: N.CS5, beat: 2.0, dur: 1.8 },
    ],
  },
  // Measure 8: Climax & Resolution to D minor
  {
    bass: [N.D1, N.A1, N.D2, N.D1],
    chords: [
      [N.D3, N.F3, N.A3, N.D4],
      [N.F3, N.A3, N.D4, N.F4],
      [N.A3, N.D4, N.F4, N.A4],
      [N.D3, N.A3, N.D4, N.F4],
    ],
    melody: [
      { note: N.D5, beat: 0, dur: 1.0 },
      { note: N.A4, beat: 1, dur: 1.0 },
      { note: N.F4, beat: 2, dur: 0.8 },
      { note: N.D4, beat: 2.8, dur: 1.2 },
    ],
  },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private musicMode: MusicMode = "off";

  // Gain and filtering
  private musicMasterGain: GainNode | null = null;
  private stringFilter: BiquadFilterNode | null = null;

  // Tension metrics (0.0 = calm start, 1.0 = final emergency)
  private tensionRatio: number = 0.0;
  private currentBpm: number = 66;

  // Music sequencer state
  private isSequencerRunning: boolean = false;
  private currentMeasureIndex: number = 0;
  private nextMeasureTime: number = 0;
  private scheduleTimer: any = null;

  constructor() {
    if (typeof window !== "undefined") {
      const storedSound = localStorage.getItem("fmttn_sound_enabled");
      const storedMusic = localStorage.getItem("fmttn_music_enabled");
      if (storedSound !== null) this.soundEnabled = storedSound === "true";
      if (storedMusic !== null) this.musicEnabled = storedMusic === "true";

      // Global unlock on ANY user touch or click
      const unlockAudio = () => {
        this.unlockContext();
      };
      window.addEventListener("click", unlockAudio, { passive: true });
      window.addEventListener("touchstart", unlockAudio, { passive: true });
      window.addEventListener("keydown", unlockAudio, { passive: true });
    }
  }

  public unlockContext(): AudioContext | null {
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
      this.ctx.resume().catch(() => {});
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
    } else {
      this.startMusic("classical");
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
      this.playSfx("click");
    }
    return next;
  }

  /* ─────────────────────────────────────────────────────────────
     ⏳ ADAPTIVE TENSION CONTROLLER (OPPRESSION CROISSANTE)
     Appelé à chaque seconde avec le temps restant (ex: 1800 -> 0)
  ───────────────────────────────────────────────────────────── */
  public updateChronoTension(timeLeftSeconds: number, totalSeconds: number = 1800) {
    const clamped = Math.max(0, Math.min(totalSeconds, timeLeftSeconds));
    // tensionRatio: 0.0 au début (30 min) -> 1.0 à la fin (0 min)
    this.tensionRatio = 1.0 - clamped / totalSeconds;

    // Progression du Tempo :
    // - Début (30:00 - 22:00) : Adagio majestueux ~64 bpm
    // - Milieu (22:00 - 10:00) : Andante / Moderato ~82 - 96 bpm
    // - Fin (10:00 - 3:00)   : Allegro dramatique ~108 - 120 bpm
    // - Urgence (< 3:00)     : Presto oppressant ~130 - 138 bpm !
    const baseBpm = 64;
    const maxBpm = 138;
    this.currentBpm = Math.round(baseBpm + Math.pow(this.tensionRatio, 1.3) * (maxBpm - baseBpm));

    // Ajuster le filtre audio en temps réel si actif
    if (this.ctx && this.stringFilter) {
      const now = this.ctx.currentTime;
      // Au début son feutré et soyeux (900 Hz), à la fin son tranchant et métallique (3400 Hz)
      const targetCutoff = 900 + this.tensionRatio * 2500;
      this.stringFilter.frequency.setTargetAtTime(targetCutoff, now, 0.5);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     🎵 MOTEUR DE MUSIQUE CLASSIQUE BAROQUE & ROMANTIQUE
  ───────────────────────────────────────────────────────────── */
  public startMusic(mode: MusicMode = "classical") {
    this.musicMode = mode;
    if (!this.musicEnabled || mode === "off") return;

    const ctx = this.unlockContext();
    if (!ctx) return;

    this.stopMusicNodesOnly();

    const now = ctx.currentTime;

    // Master Gain pour la musique classique (Volume équilibré et audible)
    this.musicMasterGain = ctx.createGain();
    this.musicMasterGain.gain.setValueAtTime(0.01, now);
    this.musicMasterGain.gain.linearRampToValueAtTime(0.24, now + 1.2);
    this.musicMasterGain.connect(ctx.destination);

    // Filtre pour sculpter le son des cordes et du piano classique
    this.stringFilter = ctx.createBiquadFilter();
    this.stringFilter.type = "lowpass";
    this.stringFilter.frequency.setValueAtTime(1000 + this.tensionRatio * 2000, now);
    this.stringFilter.Q.setValueAtTime(2.2, now);
    this.stringFilter.connect(this.musicMasterGain);

    this.isSequencerRunning = true;
    this.currentMeasureIndex = 0;
    this.nextMeasureTime = now + 0.1;

    this.runSequencerLoop();
  }

  private runSequencerLoop = () => {
    if (!this.isSequencerRunning || !this.ctx || !this.stringFilter) return;

    const lookahead = 0.25; // Programmer 250ms à l'avance
    const now = this.ctx.currentTime;

    while (this.nextMeasureTime < now + lookahead) {
      this.scheduleMeasure(this.currentMeasureIndex, this.nextMeasureTime);

      const secondsPerBeat = 60.0 / this.currentBpm;
      const measureDuration = secondsPerBeat * 4; // 4 temps par mesure

      this.nextMeasureTime += measureDuration;
      this.currentMeasureIndex = (this.currentMeasureIndex + 1) % CLASSICAL_MEASURES.length;
    }

    this.scheduleTimer = setTimeout(this.runSequencerLoop, 100);
  };

  /**
   * Planifie une mesure complète avec polyphonie classique :
   * 1. Basse de violoncelle (archet + résonance)
   * 2. Arpèges de piano / clavecin baroque
   * 3. Violon solo expressif
   * 4. Horloge pendulaire & battement oppressant (proportionnel à la tension)
   */
  private scheduleMeasure(measureIndex: number, measureStart: number) {
    if (!this.ctx || !this.stringFilter) return;

    const ctx = this.ctx;
    const filter = this.stringFilter;
    const measure = CLASSICAL_MEASURES[measureIndex];
    const secPerBeat = 60.0 / this.currentBpm;

    // ──────────────────────────────────────────────
    // 1. BASSE DE VIOLONCELLE / CONTREBASSE (4 temps)
    // ──────────────────────────────────────────────
    measure.bass.forEach((pitch, beatIdx) => {
      const noteTime = measureStart + beatIdx * secPerBeat;
      if (noteTime < ctx.currentTime) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Son riche de corde frottée (triangle + warm saw)
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(pitch, noteTime);

      // Enveloppe d'archet baroque
      const noteDur = secPerBeat * 0.95;
      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.linearRampToValueAtTime(0.20, noteTime + 0.06);
      gain.gain.setValueAtTime(0.18, noteTime + noteDur * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + noteDur);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(noteTime);
      osc.stop(noteTime + noteDur + 0.05);
    });

    // ──────────────────────────────────────────────
    // 2. ARPÈGES DE PIANO / CLAVECIN BAROQUE
    // ──────────────────────────────────────────────
    const isRapidArp = this.tensionRatio > 0.4;
    measure.chords.forEach((chord, chordIdx) => {
      const beatStart = measureStart + chordIdx * secPerBeat;

      chord.forEach((freq, noteIdx) => {
        const subOffset = isRapidArp ? (noteIdx * secPerBeat) / 4.5 : (noteIdx * secPerBeat) / 3.2;
        const noteTime = beatStart + subOffset;
        if (noteTime < ctx.currentTime) return;

        const osc = ctx.createOscillator();
        const oscOct = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, noteTime);

        // Harmonique claire
        oscOct.type = "sine";
        oscOct.frequency.setValueAtTime(freq * 2, noteTime);

        // Enveloppe percussive de piano à queue
        const noteDur = secPerBeat * 1.8;
        const pianoVol = 0.14 + (this.tensionRatio > 0.6 ? 0.05 : 0);

        gain.gain.setValueAtTime(pianoVol, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + noteDur);

        osc.connect(gain);
        oscOct.connect(gain);
        gain.connect(filter);

        osc.start(noteTime);
        oscOct.start(noteTime);
        osc.stop(noteTime + noteDur);
        oscOct.stop(noteTime + noteDur);
      });
    });

    // ──────────────────────────────────────────────
    // 3. VIOLON SOLO / FLÛTE (Ligne mélodique classique)
    // ──────────────────────────────────────────────
    measure.melody.forEach(({ note, beat, dur }) => {
      const noteTime = measureStart + beat * secPerBeat;
      if (noteTime < ctx.currentTime) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(note, noteTime);

      // Vibrato classique expressif (5.4 Hz)
      vibrato.frequency.setValueAtTime(5.4, noteTime);
      vibratoGain.gain.setValueAtTime(note * 0.015, noteTime);
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);

      const actualDur = dur * secPerBeat;
      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.18, noteTime + 0.08);
      gain.gain.setValueAtTime(0.15, noteTime + actualDur * 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + actualDur);

      osc.connect(gain);
      gain.connect(filter);

      vibrato.start(noteTime);
      osc.start(noteTime);
      vibrato.stop(noteTime + actualDur + 0.05);
      osc.stop(noteTime + actualDur + 0.05);
    });

    // ──────────────────────────────────────────────
    // 4. ÉLÉMENTS D'OPPRESSION CROISSANTE (Tension > 0.25)
    // ──────────────────────────────────────────────
    // A) Tic-tac régulier d'horloge mécanique (pendule implacable)
    if (this.tensionRatio >= 0.25) {
      for (let b = 0; b < 4; b++) {
        const tickTime = measureStart + b * secPerBeat;
        if (tickTime < ctx.currentTime) continue;

        const tickOsc = ctx.createOscillator();
        const tickGain = ctx.createGain();
        tickOsc.type = "sine";
        tickOsc.frequency.setValueAtTime(b % 2 === 0 ? 920 : 680, tickTime);

        const tickVol = 0.035 + this.tensionRatio * 0.06;
        tickGain.gain.setValueAtTime(tickVol, tickTime);
        tickGain.gain.exponentialRampToValueAtTime(0.0001, tickTime + 0.04);

        tickOsc.connect(tickGain);
        tickGain.connect(filter);
        tickOsc.start(tickTime);
        tickOsc.stop(tickTime + 0.05);
      }
    }

    // B) Battement cardiaque sub-bass angoissant (Tension > 0.60, < 12 min restantes)
    if (this.tensionRatio >= 0.6) {
      const heartBeats = [0, 0.4];
      heartBeats.forEach((offset, idx) => {
        const hTime = measureStart + offset * secPerBeat;
        if (hTime < ctx.currentTime) return;

        const hOsc = ctx.createOscillator();
        const hGain = ctx.createGain();
        hOsc.type = "sine";
        hOsc.frequency.setValueAtTime(60 - idx * 10, hTime);
        hOsc.frequency.exponentialRampToValueAtTime(32, hTime + 0.18);

        const hVol = 0.14 + (this.tensionRatio - 0.6) * 0.35;
        hGain.gain.setValueAtTime(hVol, hTime);
        hGain.gain.exponentialRampToValueAtTime(0.0001, hTime + 0.22);

        hOsc.connect(hGain);
        if (this.musicMasterGain) hGain.connect(this.musicMasterGain);
        hOsc.start(hTime);
        hOsc.stop(hTime + 0.25);
      });
    }

    // C) Accords d'orgue tragiques / dissonances (Tension > 0.85, < 5 min restantes !)
    if (this.tensionRatio >= 0.85 && (measureIndex === 2 || measureIndex === 6)) {
      const droneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      droneOsc.type = "sawtooth";
      droneOsc.frequency.setValueAtTime(207.65, measureStart); // Tritone dramatique

      droneGain.gain.setValueAtTime(0.10, measureStart);
      droneGain.gain.exponentialRampToValueAtTime(0.001, measureStart + secPerBeat * 3);

      droneOsc.connect(droneGain);
      droneGain.connect(filter);
      droneOsc.start(measureStart);
      droneOsc.stop(measureStart + secPerBeat * 3);
    }
  }

  private stopMusicNodesOnly() {
    this.isSequencerRunning = false;
    if (this.scheduleTimer) {
      clearTimeout(this.scheduleTimer);
      this.scheduleTimer = null;
    }

    if (this.stringFilter) {
      try {
        this.stringFilter.disconnect();
      } catch {}
      this.stringFilter = null;
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

  /* ─────────────────────────────────────────────────────────────
     🔊 10 EFFETS SONORES DIDACTIQUES (SFX)
  ───────────────────────────────────────────────────────────── */
  public playSfx(type: SfxType) {
    if (!this.soundEnabled) return;
    const ctx = this.unlockContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      switch (type) {
        case "click": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(1200, now);
          osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }

        case "snap": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        case "step": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(587.33, now);
          osc.frequency.setValueAtTime(880, now + 0.07);
          gain.gain.setValueAtTime(0.16, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        case "scan": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(1400, now + 0.25);
          gain.gain.setValueAtTime(0.10, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }

        case "success": {
          [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + i * 0.08);
            gain.gain.setValueAtTime(0.18, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.35);
          });
          break;
        }

        case "error": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.linearRampToValueAtTime(75, now + 0.3);
          gain.gain.setValueAtTime(0.24, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        }

        case "unlock": {
          [350, 520, 780].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, now + i * 0.05);
            gain.gain.setValueAtTime(0.20, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.15);
          });
          break;
        }

        case "alarm": {
          for (let i = 0; i < 3; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "square";
            osc.frequency.setValueAtTime(800, now + i * 0.14);
            osc.frequency.setValueAtTime(600, now + i * 0.14 + 0.07);
            gain.gain.setValueAtTime(0.16, now + i * 0.14);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.14 + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.14);
            osc.stop(now + i * 0.14 + 0.12);
          }
          break;
        }

        case "keystroke": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(900 + Math.random() * 200, now);
          gain.gain.setValueAtTime(0.10, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.03);
          break;
        }

        case "victory": {
          // Fanfare classique en Ré Majeur triomphale (D - F# - A - D)
          const notes = [
            { f: 293.66, d: 0.25, t: 0 },
            { f: 369.99, d: 0.25, t: 0.2 },
            { f: 440.0, d: 0.25, t: 0.4 },
            { f: 587.33, d: 0.7, t: 0.6 },
            { f: 554.37, d: 0.25, t: 1.1 },
            { f: 587.33, d: 1.4, t: 1.35 },
          ];
          notes.forEach(({ f, d, t }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(f, now + t);
            gain.gain.setValueAtTime(0.26, now + t);
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
      // Audio error catch
    }
  }
}

export const soundEngine = new SoundEngine();
