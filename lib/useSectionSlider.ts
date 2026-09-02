"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Duracion del difuminado entre secciones. Debe coincidir con globals.css. */
export const SECTION_FADE_MS = 560;

/** Cuanto se bloquea la rueda. Menos que el fundido para que no se sienta
    pegajoso: a mitad del cruce ya se puede pedir la siguiente seccion. */
export const SECTION_LOCK_MS = 380;

/** El instante en que se cambia de seccion, ya con el velo en negro. Cae
    dentro del sosten del fotograma clave (28%-68% de 560 ms, o sea entre los
    157 y los 381 ms) de .section-crossfade-veil en globals.css: si se mueve
    uno hay que mover el otro, porque el cambio tiene que pasar tapado. */
export const SECTION_SWAP_MS = 215;

/** Mientras haya un modal abierto la rueda no debe cambiar de seccion. */
function isBlockedByOverlay() {
  return Boolean(
    document.fullscreenElement ||
      document.querySelector(".premium-campaign-fullscreen") ||
      document.querySelector("[role='dialog']"),
  );
}

export function useSectionSlider(ids: string[]) {
  const [activeIndex, setActiveIndex] = useState(0);
  // Sube de a uno en cada cambio de seccion. Sirve de llave para remontar el
  // velo del cruce, que asi vuelve a reproducir su animacion desde cero.
  const [transitionKey, setTransitionKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const activeIndexRef = useRef(0);
  const lockedUntilRef = useRef(0);
  const veilTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(ids.length - 1, index));
      if (next === activeIndexRef.current) return;

      // SIN SONIDO AL CAMBIAR DE SECCION.
      // Jael lo saco el 2/9/2026: ninguna de las versiones que probamos dio
      // con el tono elegante que buscaba. La navegacion va muda hasta que
      // aparezca un sonido que valga la pena.
      //
      // Para volver a ponerlo cuando lo haya: importar playSectionTransition
      // desde ./soundEffects y llamarlo aca, ANTES de mover el indice, para
      // que arranque junto con el velo y no despegado de la imagen:
      //   playSectionTransition(next > activeIndexRef.current ? 1 : -1);
      // El sonido en si sigue vivo en lib/soundEffects.ts y se puede escuchar
      // y comparar en la pagina /sonidos.

      activeIndexRef.current = next;
      lockedUntilRef.current = performance.now() + SECTION_LOCK_MS;
      setActiveIndex(next);
      setTransitionKey((value) => value + 1);
      setIsTransitioning(true);

      if (veilTimerRef.current) clearTimeout(veilTimerRef.current);
      veilTimerRef.current = setTimeout(() => setIsTransitioning(false), SECTION_FADE_MS);

      window.history.replaceState(null, "", `#${ids[next]}`);
    },
    [ids],
  );

  useEffect(() => () => {
    if (veilTimerRef.current) clearTimeout(veilTimerRef.current);
  }, []);

  const goToId = useCallback(
    (id: string) => {
      const index = ids.indexOf(id.replace("#", ""));
      if (index >= 0) goTo(index);
    },
    [goTo, ids],
  );

  // Arrancar en la seccion que pida la URL (#bio, #contacto, etc.)
  useEffect(() => {
    const fromHash = window.location.hash.replace("#", "");
    const index = ids.indexOf(fromHash);
    if (index > 0) {
      activeIndexRef.current = index;
      setActiveIndex(index);
    }
  }, [ids]);

  useEffect(() => {
    const isLocked = () => performance.now() < lockedUntilRef.current;
    const step = (direction: number) => goTo(activeIndexRef.current + direction);

    function handleWheel(event: WheelEvent) {
      if (isBlockedByOverlay()) return;
      // Sin scroll de documento: la rueda solo cambia de seccion.
      event.preventDefault();
      if (isLocked() || Math.abs(event.deltaY) < 12) return;
      step(event.deltaY > 0 ? 1 : -1);
    }

    function handleKey(event: KeyboardEvent) {
      if (isBlockedByOverlay()) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      const keys: Record<string, number> = {
        ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1,
      };
      if (event.key === "Home") { event.preventDefault(); goTo(0); return; }
      if (event.key === "End") { event.preventDefault(); goTo(ids.length - 1); return; }

      const direction = keys[event.key];
      if (!direction) return;
      event.preventDefault();
      if (isLocked()) return;
      step(direction);
    }

    let touchStartY = 0;
    let touchStartX = 0;

    function handleTouchStart(event: TouchEvent) {
      touchStartY = event.touches[0].clientY;
      touchStartX = event.touches[0].clientX;
    }

    function handleTouchEnd(event: TouchEvent) {
      if (isBlockedByOverlay() || isLocked()) return;
      const deltaY = touchStartY - event.changedTouches[0].clientY;
      const deltaX = touchStartX - event.changedTouches[0].clientX;
      // Solo gestos claramente verticales: los horizontales son de los carruseles.
      if (Math.abs(deltaY) < 55 || Math.abs(deltaY) < Math.abs(deltaX) * 1.3) return;
      step(deltaY > 0 ? 1 : -1);
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKey);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goTo, ids]);

  return {
    activeIndex,
    activeId: ids[activeIndex] ?? ids[0],
    goTo,
    goToId,
    isTransitioning,
    transitionKey,
  };
}
