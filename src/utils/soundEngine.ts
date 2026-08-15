// Web Audio API Retro Chiptune Sound Engine

type ThemeName =
  | 'title'
  | 'forest'
  | 'cave'
  | 'swamp'
  | 'volcano'
  | 'tundra'
  | 'castle'
  | 'void'
  | 'sanctuary'
  | 'battle'
  | 'boss_battle'
  | 'victory'
  | 'game_over'
  | 'none';

type SfxName =
  | 'select'
  | 'attack'
  | 'magic'
  | 'hit'
  | 'heal'
  | 'levelup'
  | 'level_up'
  | 'buy'
  | 'gold'
  | 'boss_roar'
  | 'flee'
  | 'chest'
  | 'error';

class RetroSoundEngine {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private masterGainNode: GainNode | null = null;

  private isMuted: boolean = false;
  private musicVolume: number = 0.4;
  private sfxVolume: number = 0.6;

  private currentTheme: ThemeName = 'none';
  private musicTimer: number | null = null;
  private isUnlocked: boolean = false;

  constructor() {
    // Lazy initialize on first interaction
  }

  private initCtx() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();

    this.masterGainNode = this.ctx.createGain();
    this.musicGainNode = this.ctx.createGain();
    this.sfxGainNode = this.ctx.createGain();

    this.musicGainNode.gain.value = this.isMuted ? 0 : this.musicVolume;
    this.sfxGainNode.gain.value = this.isMuted ? 0 : this.sfxVolume;

    this.musicGainNode.connect(this.masterGainNode);
    this.sfxGainNode.connect(this.masterGainNode);
    this.masterGainNode.connect(this.ctx.destination);
  }

  public unlock() {
    this.initCtx();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.isUnlocked = true;
      });
    } else {
      this.isUnlocked = true;
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = muted ? 0 : this.musicVolume;
    }
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.value = muted ? 0 : this.sfxVolume;
    }
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGainNode && !this.isMuted) {
      this.musicGainNode.gain.value = this.musicVolume;
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGainNode && !this.isMuted) {
      this.sfxGainNode.gain.value = this.sfxVolume;
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public getMusicVolume() {
    return this.musicVolume;
  }

  public getSfxVolume() {
    return this.sfxVolume;
  }

  // --- SOUND EFFECTS ---
  public playSfx(sfx: SfxName) {
    this.unlock();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    const now = this.ctx.currentTime;

    switch (sfx) {
      case 'select': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.04);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      case 'attack': {
        // Noise burst + pitch bend
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }

      case 'hit': {
        // Impact hit
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.2);

        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }

      case 'magic': {
        // Arpeggiated magic sweep
        const freqs = [330, 440, 554, 659, 880, 1108, 1318];
        freqs.forEach((f, idx) => {
          if (!this.ctx || !this.sfxGainNode) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = f;

          const start = now + idx * 0.04;
          gain.gain.setValueAtTime(0.2, start);
          gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);

          osc.connect(gain);
          gain.connect(this.sfxGainNode);
          osc.start(start);
          osc.stop(start + 0.15);
        });
        break;
      }

      case 'heal': {
        // Harmonic sparkles
        const freqs = [261.6, 329.6, 392.0, 523.2, 659.2];
        freqs.forEach((f, idx) => {
          if (!this.ctx || !this.sfxGainNode) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = f;

          const start = now + idx * 0.06;
          gain.gain.setValueAtTime(0.3, start);
          gain.gain.exponentialRampToValueAtTime(0.01, start + 0.2);

          osc.connect(gain);
          gain.connect(this.sfxGainNode);
          osc.start(start);
          osc.stop(start + 0.2);
        });
        break;
      }

      case 'level_up':
      case 'levelup': {
        // Triumphant 8-bit fanfare sequence
        const notes = [
          { f: 523.25, t: 0 },
          { f: 659.25, t: 0.1 },
          { f: 783.99, t: 0.2 },
          { f: 1046.50, t: 0.35 },
          { f: 880.00, t: 0.5 },
          { f: 1046.50, t: 0.65 },
        ];
        notes.forEach((n) => {
          if (!this.ctx || !this.sfxGainNode) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.value = n.f;

          const start = now + n.t;
          gain.gain.setValueAtTime(0.35, start);
          gain.gain.exponentialRampToValueAtTime(0.01, start + 0.2);

          osc.connect(gain);
          gain.connect(this.sfxGainNode);
          osc.start(start);
          osc.stop(start + 0.2);
        });
        break;
      }

      case 'gold':
      case 'buy': {
        // Coin clink
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, now); // B5
        osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.sfxGainNode);

        osc1.start(now);
        osc1.stop(now + 0.1);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.25);
        break;
      }

      case 'boss_roar': {
        // Low growl rumble
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(45, now + 0.6);

        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);
        osc.start(now);
        osc.stop(now + 0.6);
        break;
      }

      case 'flee': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }

      case 'chest': {
        const freqs = [440, 554.37, 659.25, 880];
        freqs.forEach((f, idx) => {
          if (!this.ctx || !this.sfxGainNode) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.value = f;

          const start = now + idx * 0.08;
          gain.gain.setValueAtTime(0.3, start);
          gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);

          osc.connect(gain);
          gain.connect(this.sfxGainNode);
          osc.start(start);
          osc.stop(start + 0.15);
        });
        break;
      }

      case 'error': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.setValueAtTime(120, now + 0.1);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }
    }
  }

  // --- CHIPTUNE MUSIC SYSTEM ---
  public playMusic(theme: ThemeName) {
    this.unlock();
    if (this.currentTheme === theme) return;

    this.stopMusic();
    this.currentTheme = theme;

    if (theme === 'none' || !this.ctx || !this.musicGainNode) return;

    let step = 0;
    const noteTime = 0.16; // Tempo speed

    // Note frequencies (Hz)
    const N = {
      C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
      OFF: 0,
    };

    let melody: number[] = [];
    let bass: number[] = [];
    let waveType: OscillatorType = 'square';

    switch (theme) {
      case 'title':
        waveType = 'square';
        melody = [
          N.C4, N.E4, N.G4, N.C5, N.B4, N.G4, N.E4, N.C4,
          N.D4, N.F4, N.A4, N.D5, N.C5, N.A4, N.F4, N.D4,
          N.E4, N.G4, N.B4, N.E5, N.D5, N.B4, N.G4, N.E4,
          N.C5, N.G4, N.E4, N.G4, N.C5, N.OFF, N.C5, N.OFF,
        ];
        bass = [
          N.C3, N.OFF, N.C3, N.OFF, N.D3, N.OFF, N.D3, N.OFF,
          N.E3, N.OFF, N.E3, N.OFF, N.C3, N.G3, N.C3, N.OFF,
        ];
        break;

      case 'forest':
        waveType = 'square';
        melody = [
          N.E4, N.G4, N.A4, N.B4, N.A4, N.G4, N.E4, N.D4,
          N.E4, N.G4, N.A4, N.C5, N.B4, N.A4, N.G4, N.OFF,
          N.A4, N.C5, N.D5, N.E5, N.D5, N.C5, N.A4, N.G4,
          N.E4, N.A4, N.G4, N.E4, N.D4, N.E4, N.E4, N.OFF,
        ];
        bass = [N.E3, N.OFF, N.G3, N.OFF, N.A3, N.OFF, N.E3, N.OFF];
        break;

      case 'cave':
        waveType = 'triangle';
        melody = [
          N.A3, N.C4, N.E4, N.A4, N.G4, N.E4, N.C4, N.A3,
          N.F3, N.A3, N.C4, N.F4, N.E4, N.C4, N.A3, N.F3,
          N.D3, N.F3, N.A3, N.D4, N.C4, N.A3, N.F3, N.D3,
          N.E3, N.G3, N.B3, N.E4, N.D4, N.B3, N.G3, N.E3,
        ];
        bass = [N.A3, N.OFF, N.OFF, N.A3, N.F3, N.OFF, N.OFF, N.F3];
        break;

      case 'swamp':
        waveType = 'triangle';
        melody = [
          N.D4, N.F4, N.G4, N.A4, N.G4, N.F4, N.D4, N.C4,
          N.D4, N.F4, N.G4, N.C5, N.B4, N.G4, N.F4, N.OFF,
          N.G4, N.B4, N.C5, N.D5, N.C5, N.B4, N.G4, N.F4,
          N.D4, N.G4, N.F4, N.D4, N.C4, N.D4, N.D4, N.OFF,
        ];
        bass = [N.D3, N.OFF, N.F3, N.OFF, N.G3, N.OFF, N.D3, N.OFF];
        break;

      case 'volcano':
        waveType = 'sawtooth';
        melody = [
          N.E4, N.E4, N.G4, N.E4, N.A4, N.E4, N.B4, N.E4,
          N.C5, N.B4, N.A4, N.G4, N.F4, N.E4, N.D4, N.D4,
          N.E4, N.E4, N.G4, N.E4, N.A4, N.E4, N.B4, N.E4,
          N.D5, N.C5, N.B4, N.A4, N.G4, N.E4, N.E4, N.OFF,
        ];
        bass = [N.E3, N.E3, N.OFF, N.E3, N.G3, N.OFF, N.E3, N.OFF];
        break;

      case 'tundra':
        waveType = 'sine';
        melody = [
          N.C4, N.G4, N.B4, N.C5, N.E5, N.D5, N.B4, N.G4,
          N.A4, N.E5, N.G5, N.E5, N.D5, N.C5, N.A4, N.OFF,
          N.F4, N.C5, N.E5, N.F5, N.E5, N.C5, N.A4, N.F4,
          N.G4, N.D5, N.F5, N.D5, N.B4, N.G4, N.C5, N.OFF,
        ];
        bass = [N.C3, N.OFF, N.A3, N.OFF, N.F3, N.OFF, N.G3, N.OFF];
        break;

      case 'castle':
        waveType = 'square';
        melody = [
          N.A3, N.A3, N.C4, N.A3, N.D4, N.A3, N.E4, N.A3,
          N.F4, N.E4, N.D4, N.C4, N.B3, N.A3, N.G3, N.A3,
          N.A3, N.C4, N.E4, N.A4, N.G4, N.F4, N.E4, N.D4,
          N.C4, N.B3, N.A3, N.G3, N.A3, N.A3, N.OFF, N.OFF,
        ];
        bass = [N.A3, N.OFF, N.A3, N.OFF, N.D3, N.OFF, N.E3, N.OFF];
        break;

      case 'void':
        waveType = 'sawtooth';
        melody = [
          N.C4, N.D4, N.E4, N.F4, N.E4, N.D4, N.C4, N.B3,
          N.A3, N.B3, N.C4, N.D4, N.C4, N.B3, N.A3, N.G3,
          N.C4, N.E4, N.G4, N.C5, N.B4, N.G4, N.E4, N.C4,
          N.F4, N.E4, N.D4, N.C4, N.B3, N.A3, N.A3, N.OFF,
        ];
        bass = [N.C3, N.C3, N.OFF, N.C3, N.A3, N.A3, N.OFF, N.A3];
        break;

      case 'sanctuary':
        waveType = 'sine';
        melody = [
          N.E4, N.G4, N.B4, N.E5, N.G5, N.F5, N.E5, N.D5,
          N.C5, N.E5, N.G5, N.C5, N.B4, N.A4, N.G4, N.OFF,
          N.A4, N.C5, N.E5, N.A5, N.G5, N.E5, N.D5, N.C5,
          N.B4, N.D5, N.F5, N.E5, N.C5, N.B4, N.C5, N.OFF,
        ];
        bass = [N.E3, N.G3, N.C3, N.E3, N.A3, N.C4, N.G3, N.B3];
        break;

      case 'battle':
        waveType = 'square';
        melody = [
          N.A4, N.A4, N.C5, N.A4, N.D5, N.A4, N.E5, N.A4,
          N.G5, N.F5, N.E5, N.D5, N.C5, N.B4, N.A4, N.G4,
          N.A4, N.A4, N.C5, N.A4, N.D5, N.A4, N.E5, N.A4,
          N.A5, N.G5, N.E5, N.C5, N.A4, N.A4, N.OFF, N.OFF,
        ];
        bass = [N.A3, N.A3, N.C4, N.A3, N.D3, N.D3, N.E3, N.E3];
        break;

      case 'boss_battle':
        waveType = 'sawtooth';
        melody = [
          N.E4, N.F4, N.E4, N.D4, N.E4, N.G4, N.F4, N.E4,
          N.A4, N.G4, N.F4, N.E4, N.D4, N.C4, N.B3, N.A3,
          N.E4, N.G4, N.B4, N.E5, N.D5, N.C5, N.B4, N.A4,
          N.G4, N.F4, N.E4, N.D4, N.E4, N.E4, N.OFF, N.OFF,
        ];
        bass = [N.E3, N.E3, N.OFF, N.E3, N.E3, N.OFF, N.G3, N.F3];
        break;

      case 'victory':
        waveType = 'square';
        melody = [
          N.C4, N.E4, N.G4, N.C5, N.G4, N.C5, N.OFF, N.C5,
        ];
        bass = [N.C3, N.OFF, N.E3, N.OFF, N.G3, N.OFF, N.C3, N.OFF];
        break;

      case 'game_over':
        waveType = 'triangle';
        melody = [
          N.E4, N.D4, N.C4, N.B3, N.A3, N.G3, N.F3, N.E3,
        ];
        bass = [N.E3, N.OFF, N.C3, N.OFF, N.A3, N.OFF, N.E3, N.OFF];
        break;

      default:
        return;
    }

    const playStep = () => {
      if (this.currentTheme !== theme || !this.ctx || !this.musicGainNode) return;

      const now = this.ctx.currentTime;
      const mNote = melody[step % melody.length];
      const bNote = bass[step % bass.length];

      // Play Melody note
      if (mNote && mNote > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = waveType;
        osc.frequency.setValueAtTime(mNote, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + noteTime * 0.9);

        osc.connect(gain);
        gain.connect(this.musicGainNode);
        osc.start(now);
        osc.stop(now + noteTime * 0.9);
      }

      // Play Bass note
      if (bNote && bNote > 0) {
        const oscB = this.ctx.createOscillator();
        const gainB = this.ctx.createGain();
        oscB.type = 'triangle';
        oscB.frequency.setValueAtTime(bNote, now);

        gainB.gain.setValueAtTime(0.18, now);
        gainB.gain.exponentialRampToValueAtTime(0.01, now + noteTime * 0.9);

        oscB.connect(gainB);
        gainB.connect(this.musicGainNode);
        oscB.start(now);
        oscB.stop(now + noteTime * 0.9);
      }

      step++;
      this.musicTimer = window.setTimeout(playStep, noteTime * 1000);
    };

    playStep();
  }

  public stopMusic() {
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    this.currentTheme = 'none';
  }
}

export const soundEngine = new RetroSoundEngine();
