"use client";

import { useEffect, useRef } from "react";
import { SceneShell } from "@/components/SceneShell";
import { HeroWorld } from "@/components/three/HeroWorld";
import { ArrowIcon } from "@/components/ui/Icons";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { stats } from "@/data/site";

export function HeroScene() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
          return;
        }

        video.pause();
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <SceneShell className="hero-scene" id="intro">
      <video
        aria-label="Reel Bajo Flow"
        autoPlay
        className="hero-video"
        loop
        muted
        playsInline
        poster="/assets/hero-poster.png"
        preload="metadata"
        ref={videoRef}
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

      <div className="hero-stats" data-depth-card>
        {stats.map((stat) => (
          <span key={stat}>{stat}</span>
        ))}
      </div>
    </SceneShell>
  );
}
