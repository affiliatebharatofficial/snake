// Dedicated Sound Engine with Synchronized Audio Synthesizer

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  constructor() {
    try {
      const saved = localStorage.getItem('snake_sound_muted');
      if (saved !== null) {
        this.isMuted = JSON.parse(saved);
      }
    } catch {
      this.isMuted = false;
    }
  }

  public init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        this.isInitialized = true;
      }
    } catch {}
  }

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('snake_sound_muted', JSON.stringify(this.isMuted));
    } catch {}
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('snake_sound_muted', JSON.stringify(this.isMuted));
    } catch {}
  }

  // 1. Button Click Pop
  public playClick() {
    this.init();
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  // 2. Dice Rolling Tumbling Sequence (600-800ms)
  public playDiceRoll() {
    this.init();
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Series of 7 tumbling clicks
    for (let i = 0; i < 7; i++) {
      const time = now + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180 + Math.random() * 220, time);

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.05);
    }
  }

  // 3. Token Step Hop
  public playStep(stepIndex: number = 0) {
    this.init();
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const freq = 480 + (stepIndex % 5) * 30;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.25, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  }

  // 4. Snake Bite / Hiss on Landing
  public playSnake() {
    this.init();
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Bite strike click
    const oscClick = ctx.createOscillator();
    const gainClick = ctx.createGain();
    oscClick.type = 'square';
    oscClick.frequency.setValueAtTime(700, now);
    oscClick.frequency.exponentialRampToValueAtTime(100, now + 0.08);
    gainClick.gain.setValueAtTime(0.3, now);
    gainClick.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    oscClick.connect(gainClick);
    gainClick.connect(ctx.destination);
    oscClick.start(now);
    oscClick.stop(now + 0.08);

    // Hiss slide
    const oscHiss = ctx.createOscillator();
    const gainHiss = ctx.createGain();
    oscHiss.type = 'sawtooth';
    oscHiss.frequency.setValueAtTime(380, now + 0.08);
    oscHiss.frequency.exponentialRampToValueAtTime(90, now + 0.55);
    gainHiss.gain.setValueAtTime(0.22, now + 0.08);
    gainHiss.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
    oscHiss.connect(gainHiss);
    gainHiss.connect(ctx.destination);
    oscHiss.start(now + 0.08);
    oscHiss.stop(now + 0.55);
  }

  // 5. Ladder Ascending Climb
  public playLadder() {
    this.init();
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5

    notes.forEach((freq, idx) => {
      const time = ctx.currentTime + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.24, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.12);
    });
  }

  // 6. Rolled Six Fanfare
  public playSix() {
    this.init();
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [440, 554.37, 659.25, 880];

    notes.forEach((freq, idx) => {
      const time = ctx.currentTime + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.1);
    });
  }

  // 7. Victory Celebration
  public playVictory() {
    this.init();
    const ctx = this.getContext();
    if (!ctx) return;
    const melody = [
      { f: 523.25, d: 0.14 },
      { f: 523.25, d: 0.14 },
      { f: 523.25, d: 0.14 },
      { f: 659.25, d: 0.35 },
      { f: 587.33, d: 0.18 },
      { f: 783.99, d: 0.55 },
    ];

    let current = ctx.currentTime;
    melody.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, current);

      gain.gain.setValueAtTime(0.28, current);
      gain.gain.exponentialRampToValueAtTime(0.01, current + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(current);
      osc.stop(current + note.d);

      current += note.d + 0.03;
    });
  }
}

export const sound = new SoundEngine();
