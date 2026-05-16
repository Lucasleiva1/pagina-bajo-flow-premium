"use client";

import { SceneShell } from "@/components/SceneShell";
import { HeroWorld } from "@/components/three/HeroWorld";
import { ArrowIcon } from "@/components/ui/Icons";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { SiteCopy } from "@/data/site";

type HeroSceneProps = {
  copy: SiteCopy["hero"];
};

export function HeroScene({ copy }: HeroSceneProps) {
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
        <span>{copy.sideRail}</span>
        <i />
      </div>

      <div className="hero-copy" data-scene-copy>
        <p className="kicker">{copy.kicker}</p>
        <h1>{copy.title}</h1>
        <p className="hero-lead">{copy.lead}</p>
        <div className="hero-actions">
          <MagneticButton href="#work" icon={<ArrowIcon />}>
            {copy.primaryAction}
          </MagneticButton>
          <MagneticButton href="#contact" variant="ghost">
            {copy.secondaryAction}
          </MagneticButton>
        </div>
      </div>
    </SceneShell>
  );
}
