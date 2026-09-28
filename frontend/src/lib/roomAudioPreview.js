/**
 * AURA | Experience Your Room — Luxury Sound Preview Engine
 * 
 * Generates an illustrative, premium Web Audio preview tailored to the customer's
 * room dimensions, room type, speaker model, and audio configuration.
 * 
 * Audio Style: Cinematic, elegant, warm, high-end, minimal instrumental.
 * Target duration: exactly 7 seconds with automatic stop.
 * Disclaimer: An illustrative sound preview based on your room and system configuration.
 */

// 1. DETERMINISTIC SOUND PROFILE CALCULATION
export function calculateSoundCharacter({
  dimensions,
  roomType = "home-cinema",
  audioSetup = "5.1",
  selectedSpeaker = "eclipse-x1",
}) {
  const isFeet = dimensions?.unit === "FT";
  const length = Number(dimensions?.length) || 22;
  const width = Number(dimensions?.width) || 16;
  const height = Number(dimensions?.height) || 10;

  const rawVol = length * width * height;
  const cuFt = isFeet ? rawVol : Math.round(rawVol * 35.3147);

  // Volume scale
  let roomScale = "Medium";
  let sizeLabel = "Balanced Studio";
  if (cuFt < 1800) {
    roomScale = "Small";
    sizeLabel = "Intimate Acoustic Space";
  } else if (cuFt > 3500) {
    roomScale = "Large";
    sizeLabel = "Grand Listening Salon";
  }

  // Base values for Medium studio
  let warmness = 72;
  let bass = 68;
  let clarity = 80;
  let soundstage = 70;

  // Room Size effects
  if (roomScale === "Small") {
    warmness += 8;
    bass -= 8; // tighter low end, less natural acoustic reinforcement
    clarity += 6; // near-field intimacy
    soundstage -= 14; // narrower stereo impression
  } else if (roomScale === "Large") {
    warmness += 5;
    bass += 12; // deep room pressurization
    clarity -= 4; // slight diffusion
    soundstage += 16; // expansive spatial width
  }

  // Room Type effects
  switch (roomType) {
    case "music-room":
      warmness += 12;
      clarity += 8;
      soundstage += 4;
      break;
    case "home-cinema":
      bass += 14;
      soundstage += 12;
      warmness -= 2;
      break;
    case "living-room":
      warmness += 6;
      clarity += 4;
      soundstage += 6;
      break;
    case "gaming-room":
      clarity += 12;
      soundstage += 10;
      bass += 6;
      warmness -= 4;
      break;
    default:
      break;
  }

  // Audio Setup effects
  switch (audioSetup) {
    case "2.0":
      soundstage -= 8;
      bass -= 6;
      break;
    case "2.1":
      bass += 12;
      soundstage += 2;
      break;
    case "5.1":
      soundstage += 14;
      bass += 8;
      break;
    case "7.1":
      soundstage += 18;
      bass += 10;
      break;
    case "5.1.2":
      soundstage += 22;
      bass += 12;
      clarity += 6;
      break;
    default:
      break;
  }

  // Speaker Choice effects
  const speakerKey = (selectedSpeaker || "").toLowerCase();
  if (speakerKey.includes("eclipse")) {
    bass += 12;
    soundstage += 8;
    warmness += 5;
  } else if (speakerKey.includes("aether")) {
    clarity += 14;
    warmness += 9;
    soundstage += 6;
    bass += 2;
  } else if (speakerKey.includes("pulse")) {
    clarity += 10;
    bass -= 6;
    soundstage -= 4;
  }

  // Helper clamp
  const clamp = (val) => Math.max(20, Math.min(96, Math.round(val)));

  const finalWarmness = clamp(warmness);
  const finalBass = clamp(bass);
  const finalClarity = clamp(clarity);
  const finalSoundstage = clamp(soundstage);

  // High-end illustrative summary
  let descriptor = "Balanced reference tuning with cohesive stereophonic staging.";
  if (finalSoundstage >= 85 && finalBass >= 80) {
    descriptor = "Expansive cinematic soundstage with authoritative, subterranean low-frequency weight.";
  } else if (finalClarity >= 85) {
    descriptor = "Pristine acoustic articulation, ribbon-treble transparency, and delicate vocal air.";
  } else if (finalWarmness >= 82) {
    descriptor = "Silky analog warmth, organic midrange presence, and effortless musicality.";
  } else if (roomScale === "Small") {
    descriptor = "Intimate, high-density acoustic sweet spot with tightly focused stereo imaging.";
  }

  return {
    warmness: finalWarmness,
    bass: finalBass,
    clarity: finalClarity,
    soundstage: finalSoundstage,
    roomScale,
    sizeLabel,
    cuFt,
    descriptor,
  };
}

// 2. SYNTHESIZED LUXURY AUDIO PREVIEW (WEB AUDIO API)
export class RoomSoundPreviewEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.stopTimeout = null;
    this.progressInterval = null;
    this.activeNodes = [];
    this.onStateChange = null;
    this.onProgress = null;
    this.durationSeconds = 7.0; // Target: 7 seconds by default
  }

  // Initialize or resume AudioContext on user gesture
  getOrCreateContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Play the 7-second illustrative sound preview.
   *
   * @param {Object} profile - Calculated sound character from calculateSoundCharacter
   * @param {Function} onFinish - Callback when preview naturally finishes or is stopped
   */
  async play(profile, onFinish) {
    // If currently playing, stop gracefully first
    this.stop(false);

    const ctx = this.getOrCreateContext();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    this.isPlaying = true;
    this.onStateChange?.(true);

    const now = ctx.currentTime;
    const dur = this.durationSeconds;

    // --- MASTER OUTPUT BUS ---
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    // Smooth swell in over 0.8s
    masterGain.gain.exponentialRampToValueAtTime(0.85, now + 0.8);
    // Sustain until 5.2s, then smooth organic release to silence at 7.0s
    masterGain.gain.setValueAtTime(0.85, now + 5.2);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    // --- MASTER EQ (Mapped to profile) ---
    // 1. Low shelf for Bass response
    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = "lowshelf";
    bassFilter.frequency.value = 140;
    // Map bass (20..96) to -4dB .. +6dB
    const bassGainDb = ((profile.bass - 50) / 46) * 6;
    bassFilter.gain.value = bassGainDb;

    // 2. High shelf for Clarity response
    const trebleFilter = ctx.createBiquadFilter();
    trebleFilter.type = "highshelf";
    trebleFilter.frequency.value = 4500;
    // Map clarity (20..96) to -3dB .. +5dB
    const trebleGainDb = ((profile.clarity - 50) / 46) * 5;
    trebleFilter.gain.value = trebleGainDb;

    // 3. Peaking filter for Warmth response (midrange harmonic richness)
    const warmthFilter = ctx.createBiquadFilter();
    warmthFilter.type = "peaking";
    warmthFilter.frequency.value = 450;
    warmthFilter.Q.value = 1.2;
    const warmthGainDb = ((profile.warmness - 50) / 46) * 4;
    warmthFilter.gain.value = warmthGainDb;

    // --- STEREO SPATIALIZER / REVERB (Mapped to Soundstage) ---
    // Stereo spread factor: 0.2 (narrow) to 0.95 (wide immersive)
    const spread = 0.2 + (profile.soundstage / 100) * 0.75;
    const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (pannerL) pannerL.pan.value = -spread;
    if (pannerR) pannerR.pan.value = spread;

    // Sub-delay spatial reflections to evoke room volume
    const delayL = ctx.createDelay();
    const delayR = ctx.createDelay();
    // Delay time scaled by room cubic volume
    const baseDelay = profile.roomScale === "Small" ? 0.018 : profile.roomScale === "Large" ? 0.045 : 0.028;
    delayL.delayTime.value = baseDelay;
    delayR.delayTime.value = baseDelay * 1.45;

    const delayFeedback = ctx.createGain();
    delayFeedback.gain.value = profile.roomScale === "Large" ? 0.38 : 0.22;

    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = "lowpass";
    delayFilter.frequency.value = profile.warmness > 75 ? 2400 : 4200;

    // Connect master chain
    masterGain.connect(bassFilter);
    bassFilter.connect(warmthFilter);
    warmthFilter.connect(trebleFilter);
    trebleFilter.connect(ctx.destination);

    // --- LAYER 1: LUXURY WARM ANALOG PAD ---
    // Elegant audiophile chord: D-Flat Major 9 (Db3, F3, Ab3, C4, Eb4)
    // Inflects smoothly at t = 3.2s to Gb Major 7 (Gb3, Bb3, Db4, F4)
    const chordFrequenciesPart1 = [138.59, 174.61, 207.65, 261.63, 311.13];
    const chordFrequenciesPart2 = [146.83, 185.00, 220.00, 277.18, 329.63];

    const padGain = ctx.createGain();
    padGain.gain.setValueAtTime(0.22, now);
    padGain.connect(masterGain);

    chordFrequenciesPart1.forEach((freq, idx) => {
      // Create detuned oscillator pair for lush analog warmth
      const oscA = ctx.createOscillator();
      const oscB = ctx.createOscillator();

      oscA.type = "triangle";
      oscB.type = "sine";

      // Slight detune in cents for rich shimmer
      const detune = (idx % 2 === 0 ? 1 : -1) * (4 + idx);
      oscA.detune.setValueAtTime(detune, now);
      oscB.detune.setValueAtTime(-detune, now);

      oscA.frequency.setValueAtTime(freq, now);
      oscB.frequency.setValueAtTime(freq, now);

      // Graceful chord progression at 3.2s
      const nextFreq = chordFrequenciesPart2[idx];
      oscA.frequency.setValueAtTime(freq, now + 3.0);
      oscA.frequency.exponentialRampToValueAtTime(nextFreq, now + 3.8);
      oscB.frequency.setValueAtTime(freq, now + 3.0);
      oscB.frequency.exponentialRampToValueAtTime(nextFreq, now + 3.8);

      const oscGain = ctx.createGain();
      oscGain.gain.value = 1 / (chordFrequenciesPart1.length * 1.4);

      // Lowpass filter for analog silkiness
      const oscFilter = ctx.createBiquadFilter();
      oscFilter.type = "lowpass";
      const filterCutoff = 900 + (profile.clarity / 100) * 1600;
      oscFilter.frequency.setValueAtTime(filterCutoff * 0.7, now);
      oscFilter.frequency.exponentialRampToValueAtTime(filterCutoff, now + 2.0);

      oscA.connect(oscGain);
      oscB.connect(oscGain);
      oscGain.connect(oscFilter);

      // Alternate spatial positioning
      if (idx % 2 === 0 && pannerL) {
        oscFilter.connect(pannerL);
        pannerL.connect(padGain);
      } else if (pannerR) {
        oscFilter.connect(pannerR);
        pannerR.connect(padGain);
      } else {
        oscFilter.connect(padGain);
      }

      oscA.start(now);
      oscB.start(now);
      oscA.stop(now + dur);
      oscB.stop(now + dur);

      this.activeNodes.push(oscA, oscB, oscGain, oscFilter);
    });

    // --- LAYER 2: DEEP SUB-BASS RESONANCE ---
    // Pure sine low-end foundation (34.65Hz / Db1 or 43.65Hz / F1)
    const subOsc = ctx.createOscillator();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(34.65, now);
    // Glide up slightly at harmonic change
    subOsc.frequency.setValueAtTime(34.65, now + 3.0);
    subOsc.frequency.exponentialRampToValueAtTime(43.65, now + 3.8);

    const subGain = ctx.createGain();
    // Subwoofer setup (2.1, 5.1, 5.1.2) receives authoritative weight
    const isSubActive = ["2.1", "5.1", "7.1", "5.1.2"].includes(profile.audioSetup);
    const subWeight = (isSubActive ? 0.36 : 0.22) * (profile.bass / 75);
    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.exponentialRampToValueAtTime(subWeight, now + 1.0);
    subGain.gain.setValueAtTime(subWeight, now + 5.0);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    subOsc.connect(subGain);
    subGain.connect(masterGain);
    subOsc.start(now);
    subOsc.stop(now + dur);
    this.activeNodes.push(subOsc, subGain);

    // --- LAYER 3: ACOUSTIC CRYSTAL SHIMMER / BELL ---
    // Delicate, pristine high-register notes demonstrating treble transparency
    const shimmerNotes = [
      { freq: 830.61, time: 0.9, gain: 0.08 }, // Ab5
      { freq: 1046.50, time: 3.4, gain: 0.09 }, // C6
      { freq: 1244.51, time: 4.6, gain: 0.06 }, // Eb6
    ];

    shimmerNotes.forEach(({ freq, time, gain }) => {
      const bellOsc = ctx.createOscillator();
      bellOsc.type = "sine";
      bellOsc.frequency.setValueAtTime(freq, now + time);

      const bellGain = ctx.createGain();
      bellGain.gain.setValueAtTime(0.0001, now + time);
      bellGain.gain.exponentialRampToValueAtTime(gain * (profile.clarity / 75), now + time + 0.05);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + time + 1.8);

      bellOsc.connect(bellGain);

      // Reverb delay loop
      bellGain.connect(delayL);
      bellGain.connect(masterGain);

      bellOsc.start(now + time);
      bellOsc.stop(now + time + 1.9);
      this.activeNodes.push(bellOsc, bellGain);
    });

    // Hook delay network
    delayL.connect(delayFilter);
    delayFilter.connect(delayFeedback);
    delayFeedback.connect(delayR);
    delayR.connect(masterGain);

    this.activeNodes.push(masterGain, bassFilter, warmthFilter, trebleFilter, delayL, delayR, delayFilter, delayFeedback);
    if (pannerL) this.activeNodes.push(pannerL);
    if (pannerR) this.activeNodes.push(pannerR);

    // Track playhead progress (0.0 to 1.0)
    const startTime = Date.now();
    const totalMs = dur * 1000;

    clearInterval(this.progressInterval);
    this.progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / totalMs);
      const remainingSeconds = Math.max(0, dur - elapsed / 1000);
      this.onProgress?.({ progress, remainingSeconds, elapsedSeconds: elapsed / 1000 });

      if (progress >= 1) {
        clearInterval(this.progressInterval);
      }
    }, 50);

    // Auto-stop exactly at duration
    clearTimeout(this.stopTimeout);
    this.stopTimeout = setTimeout(() => {
      this.stop(true);
      onFinish?.();
    }, totalMs);
  }

  /**
   * Stop the preview gracefully.
   * @param {boolean} naturalFinish - True if naturally finished, false if interrupted
   */
  stop(naturalFinish = false) {
    clearTimeout(this.stopTimeout);
    clearInterval(this.progressInterval);

    if (!this.isPlaying) return;

    this.isPlaying = false;
    this.onStateChange?.(false);
    this.onProgress?.({ progress: naturalFinish ? 1 : 0, remainingSeconds: 0, elapsedSeconds: 0 });

    if (this.audioCtx) {
      try {
        // Disconnect and clean up active nodes
        this.activeNodes.forEach((node) => {
          try {
            if (node.stop && typeof node.stop === "function") {
              node.stop();
            }
          } catch (e) {}
          try {
            node.disconnect();
          } catch (e) {}
        });
        this.activeNodes = [];
      } catch (e) {
        console.warn("Audio node cleanup error", e);
      }
    }
  }

  destroy() {
    this.stop(false);
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch (e) {}
      this.audioCtx = null;
    }
  }
}

// Global Singleton for easy use across components
let globalPreviewEngine = null;
export function getRoomSoundPreviewEngine() {
  if (typeof window === "undefined") return null;
  if (!globalPreviewEngine) {
    globalPreviewEngine = new RoomSoundPreviewEngine();
  }
  return globalPreviewEngine;
}
