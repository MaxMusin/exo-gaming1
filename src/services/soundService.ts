class SoundService {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = true;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    try {
      // Create AudioContext on first user interaction
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private async resumeAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Generate sound effects using Web Audio API (no external files needed)
  private generateSound(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not available');

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let value = 0;

      switch (type) {
        case 'sine':
          value = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          value = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
        case 'triangle':
          value = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1;
          break;
      }

      // Apply envelope (fade in/out)
      const envelope = Math.exp(-t * 3); // Exponential decay
      data[i] = value * envelope * 0.3; // Volume control
    }

    return buffer;
  }

  private generateComplexSound(config: {
    frequencies: number[];
    duration: number;
    type?: OscillatorType;
    envelope?: 'decay' | 'sustain';
  }): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not available');

    const { frequencies, duration, type = 'sine', envelope = 'decay' } = config;
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let value = 0;

      // Mix multiple frequencies
      frequencies.forEach(freq => {
        switch (type) {
          case 'sine':
            value += Math.sin(2 * Math.PI * freq * t) / frequencies.length;
            break;
          case 'square':
            value += (Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1) / frequencies.length;
            break;
        }
      });

      // Apply envelope
      let envelopeValue = 1;
      if (envelope === 'decay') {
        envelopeValue = Math.exp(-t * 4);
      } else if (envelope === 'sustain') {
        envelopeValue = t < duration * 0.1 ? t / (duration * 0.1) : 
                      t > duration * 0.8 ? (duration - t) / (duration * 0.2) : 1;
      }

      data[i] = value * envelopeValue * 0.3;
    }

    return buffer;
  }

  async initialize(): Promise<void> {
    if (!this.audioContext) return;

    try {
      await this.resumeAudioContext();

      // Generate game sound effects
      this.sounds.set('whack', this.generateComplexSound({
        frequencies: [800, 1200],
        duration: 0.15,
        type: 'sine',
        envelope: 'decay'
      }));

      this.sounds.set('miss', this.generateSound(200, 0.2, 'square'));

      this.sounds.set('moleAppear', this.generateSound(600, 0.2, 'sine'));

      this.sounds.set('gameStart', this.generateComplexSound({
        frequencies: [523, 659, 784], // C, E, G chord
        duration: 0.5,
        type: 'sine',
        envelope: 'sustain'
      }));

      this.sounds.set('gameEnd', this.generateComplexSound({
        frequencies: [392, 330, 262], // Descending notes
        duration: 0.8,
        type: 'sine',
        envelope: 'decay'
      }));

      this.sounds.set('combo2', this.generateSound(1000, 0.1, 'sine'));
      this.sounds.set('combo3', this.generateSound(1200, 0.1, 'sine'));
      this.sounds.set('combo4', this.generateSound(1400, 0.1, 'sine'));
      this.sounds.set('combo5', this.generateSound(1600, 0.15, 'sine'));

      this.sounds.set('tick', this.generateSound(800, 0.05, 'square'));

      console.log('Sound service initialized with', this.sounds.size, 'sounds');
    } catch (error) {
      console.warn('Failed to initialize sounds:', error);
    }
  }

  private playBuffer(buffer: AudioBuffer, volume: number = 1): void {
    if (!this.audioContext || !this.enabled) return;

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = buffer;
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start();
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }

  play(soundName: string, volume: number = 1): void {
    const buffer = this.sounds.get(soundName);
    if (buffer) {
      this.playBuffer(buffer, volume);
    }
  }

  playWhack(): void {
    this.play('whack', 0.7);
  }

  playMiss(): void {
    this.play('miss', 0.5);
  }

  playGameStart(): void {
    this.play('gameStart', 0.6);
  }

  playGameEnd(): void {
    this.play('gameEnd', 0.8);
  }

  playCombo(comboCount: number): void {
    if (comboCount >= 2 && comboCount <= 5) {
      this.play(`combo${comboCount}`, 0.6);
    } else if (comboCount > 5) {
      this.play('combo5', 0.8); // Use highest combo sound for 5+
    }
  }

  playTick(): void {
    this.play('tick', 0.3);
  }

  playMoleAppear(): void {
    this.play('moleAppear', 0.4);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  // Initialize audio context on first user interaction
  async enableAudio(): Promise<void> {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }
    await this.initialize();
  }
}

export const soundService = new SoundService();
