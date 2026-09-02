"use client";

import { useEffect, useRef, useState } from "react";

type ResponsiveVideoProps = {
  autoPlay?: boolean;
  className?: string;
  controls?: boolean;
  isPlaying?: boolean;
  loop?: boolean;
  muted?: boolean;
  name: string;
  onEnded?: () => void;
  onTimeUpdate?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
  playsInline?: boolean;
  poster?: boolean;
  preload?: "auto" | "metadata" | "none";
  /**
   * Cuando el clip tiene version vertical (sufijo -vert###), el celular usa
   * ese recorte 9:16 centrado en la accion. El video sigue siendo el FONDO a
   * pantalla completa: lo unico que cambia es que el archivo ya viene con la
   * forma del telefono, asi el navegador no tiene que recortarle los costados
   * y se ve lo que importa.
   */
  vertical?: boolean;
};

// El celular baja el recorte vertical; de tablet para arriba, el cuadro completo.
const VERTICAL_SOURCES = [
  { media: "(max-width: 600px) and (max-resolution: 1.5dppx)", variant: "vert720" },
  { media: "(max-width: 600px)", variant: "vert1080" },
] as const;

const WIDE_SOURCES = [
  { media: "(max-width: 900px)", variant: "768" },
  { media: "(max-width: 1400px)", variant: "1280" },
  { media: undefined, variant: "1920" },
] as const;

// Mismo corte que usan las fuentes verticales, para que la foto fija no salte.
const PHONE_QUERY = "(max-width: 600px)";

export function ResponsiveVideo({
  autoPlay = true,
  className,
  controls = false,
  isPlaying = true,
  loop = false,
  muted = true,
  name,
  onEnded,
  onTimeUpdate,
  playsInline = true,
  poster = true,
  preload = "auto",
  vertical = false,
}: ResponsiveVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isPlaying) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isPlaying, name]);

  // La foto fija no se puede elegir por media query desde HTML, asi que la
  // resolvemos al montar. Arranca en la apaisada para que el servidor y el
  // cliente pinten lo mismo en el primer render.
  useEffect(() => {
    if (!vertical) return;
    const mq = window.matchMedia(PHONE_QUERY);
    const sync = () => setIsPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [vertical]);

  const sources = vertical ? [...VERTICAL_SOURCES, ...WIDE_SOURCES] : WIDE_SOURCES;
  const posterSuffix = vertical && isPhone ? "-vert-poster.jpg" : "-poster.jpg";

  return (
    <video
      ref={videoRef}
      autoPlay={autoPlay}
      className={className}
      controls={controls}
      loop={loop}
      muted={muted}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      playsInline={playsInline}
      poster={poster ? `/videos/${name}${posterSuffix}` : undefined}
      preload={preload}
    >
      {sources.map(({ media, variant }) => (
        <source
          key={`webm-${variant}`}
          media={media}
          src={`/videos/${name}-${variant}.webm`}
          type="video/webm"
        />
      ))}
      {sources.map(({ media, variant }) => (
        <source
          key={`mp4-${variant}`}
          media={media}
          src={`/videos/${name}-${variant}.mp4`}
          type="video/mp4"
        />
      ))}
    </video>
  );
}
