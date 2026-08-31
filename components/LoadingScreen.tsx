"use client";

import { useEffect, useState } from "react";

/** Tope duro: pase lo que pase, a los 7 s se entra igual. Nunca se cuelga. */
const MAX_WAIT_MS = 7000;
const MIN_SHOW_MS = 900;

export function LoadingScreen() {
  const [progress, setProgress] = useState(8);
  const [isDone, setIsDone] = useState(false);
  const [isGone, setIsGone] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    let finished = false;

    // Barra que avanza sola hacia 90% para que no se sienta trabada.
    const tick = window.setInterval(() => {
      setProgress((value) => (value >= 90 ? value : value + Math.max(1, (92 - value) * 0.06)));
    }, 90);

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearInterval(tick);
      setProgress(100);

      const elapsed = performance.now() - startedAt;
      const wait = Math.max(0, MIN_SHOW_MS - elapsed);

      window.setTimeout(() => {
        setIsDone(true);
        window.setTimeout(() => setIsGone(true), 700);
      }, wait);
    };

    // Esperamos solo lo de la portada: tipografias + primer video.
    const esperas: Array<Promise<unknown>> = [];

    if (document.fonts?.ready) esperas.push(document.fonts.ready);

    esperas.push(
      new Promise<void>((resolve) => {
        const buscar = window.setInterval(() => {
          const video = document.querySelector<HTMLVideoElement>(".hero-video");
          if (!video) return;
          window.clearInterval(buscar);
          if (video.readyState >= 3) { resolve(); return; }
          video.addEventListener("canplay", () => resolve(), { once: true });
          video.addEventListener("error", () => resolve(), { once: true });
        }, 120);
        window.setTimeout(() => { window.clearInterval(buscar); resolve(); }, MAX_WAIT_MS);
      }),
    );

    Promise.all(esperas).then(finish);
    const tope = window.setTimeout(finish, MAX_WAIT_MS);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(tope);
    };
  }, []);

  if (isGone) return null;

  return (
    <div className={`loading-screen${isDone ? " is-done" : ""}`} aria-hidden={isDone} role="status">
      <div className="loading-inner">
        <div className="loading-brand">
          <span className="loading-mark" aria-hidden="true" />
          <strong>BAJO FLOW</strong>
        </div>
        <div className="loading-bar" aria-hidden="true">
          <span style={{ width: `${Math.min(100, progress)}%` }} />
        </div>
        <p className="loading-caption">Preparando la experiencia</p>
      </div>
    </div>
  );
}
