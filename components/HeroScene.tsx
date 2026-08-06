"use client";

import { useEffect, useRef, useState } from "react";
import { SceneShell } from "@/components/SceneShell";
import { ArrowIcon } from "@/components/ui/Icons";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ResponsiveVideo } from "@/components/ui/ResponsiveVideo";
import type { SiteCopy } from "@/data/site";

type HeroSceneProps = {
  copy: SiteCopy["hero"];
};

const HERO_VIDEOS = [
  { id: "hero-portada-1", label: "01", title: "Showreel 01" },
  { id: "hero-portada-2", label: "02", title: "Showreel 02" },
  { id: "hero-portada-3", label: "03", title: "Showreel 03" },
  { id: "hero-portada-4", label: "04", title: "Showreel 04" },
  { id: "hero-portada-5", label: "05", title: "Showreel 05" },
];

export function HeroScene({ copy }: HeroSceneProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  // Performance Optimization: Pause video playback when hero is scrolled out of viewport
  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const vid = e.currentTarget;
    if (vid.duration && vid.duration > 0) {
      const pct = (vid.currentTime / vid.duration) * 100;
      setProgress(pct);
    }
  };

  const handleEnded = () => {
    setProgress(0);
    setActiveIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
  };

  const handleSelect = (index: number) => {
    setProgress(0);
    setActiveIndex(index);
  };

  const currentVideo = HERO_VIDEOS[activeIndex];

  return (
    <div ref={heroRef} className="hero-wrapper" style={{ position: "relative", width: "100%", height: "100%" }}>
      <SceneShell className="hero-scene" id="intro">
        <ResponsiveVideo
          key={currentVideo.id}
          className="hero-video"
          isPlaying={isInView}
          loop={false}
          name={currentVideo.id}
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          preload="auto"
        />
        <div className="hero-video-vignette" aria-hidden="true" />

        <div className="side-rail" aria-hidden="true">
          <span>{copy.sideRail}</span>
          <i />
        </div>

        <div className="hero-layout">
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
        </div>

        {/* Netflix-style Progress Bar Lines Switcher */}
        <nav className="hero-netflix-switcher" aria-label="Selección de Portada Netflix">
          <div className="netflix-bars-container">
            {HERO_VIDEOS.map((vid, idx) => {
              let fillWidth = "0%";
              if (idx < activeIndex) fillWidth = "100%";
              else if (idx === activeIndex) fillWidth = `${Math.min(100, Math.max(0, progress))}%`;

              return (
                <button
                  key={vid.id}
                  className={`netflix-bar-segment ${idx === activeIndex ? "active" : ""}`}
                  onClick={() => handleSelect(idx)}
                  title={`Ver ${vid.title}`}
                  aria-label={`Portada ${vid.label}: ${vid.title}`}
                  type="button"
                >
                  <span className="netflix-bar-track">
                    <span
                      className="netflix-bar-fill"
                      style={{ width: fillWidth }}
                    />
                  </span>
                  <span className="netflix-bar-num">{vid.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </SceneShell>
    </div>
  );
}


