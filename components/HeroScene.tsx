"use client";

import { SceneShell } from "@/components/SceneShell";
import { HeroWorld } from "@/components/three/HeroWorld";
import { ArrowIcon } from "@/components/ui/Icons";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function HeroScene() {
  return (
    <SceneShell className="hero-scene" id="intro">
      <video
        autoPlay
        className="hero-video"
        loop
        muted
        playsInline
        preload="auto"
        src="/assets/reel.mp4"
      />
      <div className="hero-video-vignette" aria-hidden="true" />
      <HeroWorld />

      <div className="side-rail" aria-hidden="true">
        <span>scroll to explore</span>
        <i />
      </div>

      <div className="hero-copy" data-scene-copy>
        <p className="kicker">Lucas Leiva / Editor audiovisual</p>
        <h1>Contenido de alto impacto visual</h1>
        <p className="hero-lead">
          Edicion dinamica, color cinematografico, audio cuidado y piezas con presencia para
          YouTube, redes, marcas e institucionales.
        </p>
        <div className="hero-actions">
          <MagneticButton href="#work" icon={<ArrowIcon />}>
            Ver trabajos
          </MagneticButton>
          <MagneticButton href="#contact" variant="ghost">
            Contactar
          </MagneticButton>
        </div>
      </div>

    </SceneShell>
  );
}
