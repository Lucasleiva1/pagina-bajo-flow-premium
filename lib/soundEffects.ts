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
const noiseBuffers = new Map<number, AudioBuffer>();
function getNoiseBuffer(ctx: BaseAudioContext): AudioBuffer {
  const cached = noiseBuffers.get(ctx.sampleRate);
  if (cached) return cached;

  const duration = 1.0;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  noiseBuffers.set(ctx.sampleRate, buffer);
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

/* ===================================================================
   SONIDO DEL CAMBIO DE SECCION
   ===================================================================
   Criterio: en una casa de alta gama el sonido NO se anuncia. Tiene que
   sentirse antes que oirse. Nada de "swoosh" de plantilla, nada brillante,
   nada que suene a ciencia ficcion. Grave, calido, corto, y por debajo de
   la imagen.

   Esta armado en cinco capas, cronometradas contra el cruce visual de
   560 ms (el negro va de los 157 a los 381 ms, ver globals.css):

     0 ms    AIRE      ruido filtrado que barre hacia abajo. La caida.
     150 ms  SUB       un seno muy grave. Es el peso del negro.
     150 ms  CUERPO    ruido grave y corto que le da textura al sub.
     280 ms  TONO      una quinta con su octava, entrando despacio. El
                       revelado: sostiene mientras aparece la seccion nueva.
     330 ms  BRILLO    un hilo de aire agudo, casi inaudible. El asentarse.

   La direccion importa: bajando, el aire barre de agudo a grave y el tono
   apoya en La; subiendo, al reves y en Sol. Es una diferencia que no se
   nota conscientemente, pero se siente.
   =================================================================== */

/** Volumen general del sonido de cambio de seccion. Subir o bajar SOLO esto.
    Con 1.5 el pico real queda cerca de -18 dBFS: se oye con claridad sobre
    una pagina en silencio, y sigue quedando por debajo de la imagen. Es
    aproximadamente el doble que el whoosh de la sala Bio, que es lo que
    corresponde: cambiar de seccion es el gesto mas importante del sitio. */
const VOLUMEN_TRANSICION = 1.5;

/** Dos cambios muy seguidos apilarian los sonidos y sonaria a barro. */
const SEPARACION_MINIMA_MS = 240;
let ultimaTransicionMs = 0;

/**
 * Reproduce el sonido en el contexto vivo del navegador.
 */
export function playSectionTransition(direction: 1 | -1 = 1) {
  if (typeof window === "undefined") return;
  if (!useBioRoomStore.getState().isSoundEnabled) return;

  const ahora = performance.now();
  if (ahora - ultimaTransicionMs < SEPARACION_MINIMA_MS) return;
  ultimaTransicionMs = ahora;

  const ctx = getAudioContext();
  if (!ctx) return;

  buildSectionTransition(ctx, ctx.destination, ctx.currentTime, direction);
}

/**
 * Arma el grafo del sonido a partir del instante `t` y lo conecta a `destino`.
 *
 * Esta separado de la reproduccion a proposito: recibiendo cualquier contexto
 * (el vivo del navegador o uno offline) el MISMO sonido se puede renderizar a
 * un archivo para escucharlo o medirlo, sin copiar los numeros a otro lado y
 * arriesgarse a que las dos versiones se separen con el tiempo.
 */
export function buildSectionTransition(
  ctx: BaseAudioContext,
  destino: AudioNode,
  t: number,
  direction: 1 | -1 = 1,
) {
  const baja = direction > 0;

  // --- Bus maestro. Un pasa-bajos suave arriba de todo para que nada
  //     quede aspero: es lo que separa un sonido caro de uno estridente.
  const maestro = ctx.createGain();
  maestro.gain.value = VOLUMEN_TRANSICION;

  const calidez = ctx.createBiquadFilter();
  calidez.type = "lowpass";
  calidez.frequency.value = 7600;
  calidez.Q.value = 0.4;

  maestro.connect(calidez);
  calidez.connect(destino);

  // --- 1. AIRE: la caida ------------------------------------------------
  const aire = ctx.createBufferSource();
  aire.buffer = getNoiseBuffer(ctx);

  const aireFiltro = ctx.createBiquadFilter();
  aireFiltro.type = "bandpass";
  aireFiltro.Q.value = 1.5; // cerrado lo justo: aire, no silbido ni siseo
  aireFiltro.frequency.setValueAtTime(baja ? 900 : 300, t);
  aireFiltro.frequency.exponentialRampToValueAtTime(baja ? 210 : 820, t + 0.42);

  const aireGan = ctx.createGain();
  aireGan.gain.setValueAtTime(0.0001, t);
  aireGan.gain.exponentialRampToValueAtTime(0.05, t + 0.17);
  aireGan.gain.exponentialRampToValueAtTime(0.0001, t + 0.62);

  const airePan = ctx.createStereoPanner();
  airePan.pan.setValueAtTime(baja ? -0.34 : 0.34, t);
  airePan.pan.linearRampToValueAtTime(baja ? 0.3 : -0.3, t + 0.55);

  aire.connect(aireFiltro);
  aireFiltro.connect(aireGan);
  aireGan.connect(airePan);
  airePan.connect(maestro);
  aire.start(t);
  aire.stop(t + 0.7);

  // --- 2. SUB: el peso del negro ---------------------------------------
  const sub = ctx.createOscillator();
  sub.type = "sine";
  sub.frequency.setValueAtTime(58, t + 0.15);
  sub.frequency.exponentialRampToValueAtTime(34, t + 0.62);

  const subGan = ctx.createGain();
  subGan.gain.setValueAtTime(0.0001, t + 0.15);
  // Ataque de 50 ms, no de golpe: un impacto seco sonaria a videojuego.
  subGan.gain.linearRampToValueAtTime(0.082, t + 0.2);
  subGan.gain.exponentialRampToValueAtTime(0.0001, t + 0.78);

  sub.connect(subGan);
  subGan.connect(maestro);
  sub.start(t + 0.15);
  sub.stop(t + 0.8);

  // --- 3. CUERPO: textura para que el sub no quede pelado ---------------
  const cuerpo = ctx.createBufferSource();
  cuerpo.buffer = getNoiseBuffer(ctx);

  const cuerpoFiltro = ctx.createBiquadFilter();
  cuerpoFiltro.type = "lowpass";
  cuerpoFiltro.frequency.setValueAtTime(420, t + 0.15);
  cuerpoFiltro.frequency.exponentialRampToValueAtTime(110, t + 0.45);

  const cuerpoGan = ctx.createGain();
  cuerpoGan.gain.setValueAtTime(0.0001, t + 0.15);
  cuerpoGan.gain.linearRampToValueAtTime(0.028, t + 0.19);
  cuerpoGan.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

  cuerpo.connect(cuerpoFiltro);
  cuerpoFiltro.connect(cuerpoGan);
  cuerpoGan.connect(maestro);
  cuerpo.start(t + 0.15);
  cuerpo.stop(t + 0.55);

  // --- 4. TONO: el revelado --------------------------------------------
  // Una quinta justa con su octava. Es el intervalo mas consonante que hay
  // despues del unisono: no suena "a acorde", suena a una sola nota con
  // cuerpo. Entra tarde y se queda sonando mientras aparece la seccion.
  const fundamental = baja ? 110 : 98; // La2 bajando, Sol2 subiendo
  const parciales: Array<[number, number]> = [
    [fundamental, 1],
    [fundamental * 1.5, 0.62],
    [fundamental * 2, 0.3],
  ];

  const tonoFiltro = ctx.createBiquadFilter();
  tonoFiltro.type = "lowpass";
  tonoFiltro.frequency.setValueAtTime(620, t + 0.28);
  tonoFiltro.frequency.linearRampToValueAtTime(2300, t + 0.72);
  tonoFiltro.Q.value = 0.6;

  const tonoGan = ctx.createGain();
  tonoGan.gain.setValueAtTime(0.0001, t + 0.28);
  tonoGan.gain.linearRampToValueAtTime(0.04, t + 0.5);
  tonoGan.gain.exponentialRampToValueAtTime(0.0001, t + 1.25);

  tonoFiltro.connect(tonoGan);
  tonoGan.connect(maestro);

  parciales.forEach(([hz, peso], i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(hz, t + 0.28);

    const gan = ctx.createGain();
    gan.gain.value = peso;

    // Abrimos apenas el estereo: la fundamental al centro y los parciales
    // a los costados. Da amplitud sin que se note el truco.
    const pan = ctx.createStereoPanner();
    pan.pan.value = i === 0 ? 0 : i === 1 ? -0.24 : 0.24;

    osc.connect(gan);
    gan.connect(pan);
    pan.connect(tonoFiltro);
    osc.start(t + 0.28);
    osc.stop(t + 1.3);
  });

  // --- 5. BRILLO: el asentarse -----------------------------------------
  const brillo = ctx.createBufferSource();
  brillo.buffer = getNoiseBuffer(ctx);

  const brilloFiltro = ctx.createBiquadFilter();
  brilloFiltro.type = "highpass";
  brilloFiltro.frequency.value = 5200;

  // Con techo: sin esto el ruido llega hasta los 16 kHz y suena a siseo de
  // cinta. Recortado arriba se convierte en aire, que es lo que buscamos.
  const brilloTecho = ctx.createBiquadFilter();
  brilloTecho.type = "lowpass";
  brilloTecho.frequency.value = 9200;

  const brilloGan = ctx.createGain();
  brilloGan.gain.setValueAtTime(0.0001, t + 0.33);
  brilloGan.gain.linearRampToValueAtTime(0.0055, t + 0.43);
  brilloGan.gain.exponentialRampToValueAtTime(0.0001, t + 0.82);

  brillo.connect(brilloFiltro);
  brilloFiltro.connect(brilloTecho);
  brilloTecho.connect(brilloGan);
  brilloGan.connect(maestro);
  brillo.start(t + 0.33);
  brillo.stop(t + 1);
}

// Solo en desarrollo: deja el sonido a mano en la consola del navegador para
// poder renderizarlo a un archivo y escucharlo o medirlo desde afuera. En la
// version publicada esto no existe.
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).__bajoFlowSound = {
    buildSectionTransition,
    playSectionTransition,
  };
}
