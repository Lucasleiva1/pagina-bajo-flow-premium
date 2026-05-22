"use client";

import { useBioRoomStore } from "./useBioRoomStore";

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  return audioCtx;
}

// Helper to create a single-channel noise buffer for the whoosh effect
let noiseBuffer: AudioBuffer | null = null;
function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;

  const duration = 1.0;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  noiseBuffer = buffer;
  return buffer;
}

/**
 * Sweeps a bandpass filter over white noise to simulate a smooth camera whoosh.
 */
export function playWhoosh() {
  if (typeof window === "undefined") return;
  const isEnabled = useBioRoomStore.getState().isSoundEnabled;
  if (!isEnabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const duration = 0.55;
  const source = ctx.createBufferSource();
  source.buffer = getNoiseBuffer(ctx);

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 3.5;

  // Sweep the bandpass filter frequency up and down for a natural swoosh feel
  filter.frequency.setValueAtTime(250, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + duration * 0.35);
  filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + duration);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + duration * 0.3);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  source.start();
  source.stop(ctx.currentTime + duration);
}

/**
 * Synthesizes a very short, crisp tick sound for button and link hover.
 */
export function playHoverTick() {
  if (typeof window === "undefined") return;
  const isEnabled = useBioRoomStore.getState().isSoundEnabled;
  if (!isEnabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const duration = 0.04;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(1400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + duration);

  gainNode.gain.setValueAtTime(0.012, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
}

/**
 * Synthesizes a slightly deeper mechanical-like click for activation.
 */
export function playClickTick() {
  if (typeof window === "undefined") return;
  const isEnabled = useBioRoomStore.getState().isSoundEnabled;
  if (!isEnabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const duration = 0.08;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(700, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);

  gainNode.gain.setValueAtTime(0.035, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
}

/**
 * Plays a futuristic chord that sweeps upward for overlay panels.
 */
export function playModalOpen() {
  if (typeof window === "undefined") return;
  const isEnabled = useBioRoomStore.getState().isSoundEnabled;
  if (!isEnabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const duration = 0.45;
  const now = ctx.currentTime;
  const freqs = [220, 330, 440]; // A3, E4, A4 chord

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.001, now);
  gainNode.gain.linearRampToValueAtTime(0.03, now + duration * 0.2);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  gainNode.connect(ctx.destination);

  freqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 2, now + duration);
    osc.connect(gainNode);
    osc.start(now);
    osc.stop(now + duration);
  });
}
