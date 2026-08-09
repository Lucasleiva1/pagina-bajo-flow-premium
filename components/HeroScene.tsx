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
  { id: "hero-portada-1", title: "Showreel 01" },
  { id: "hero-portada-2", title: "Showreel 02" },
  { id: "hero-portada-3", title: "Showreel 03" },
  { id: "hero-portada-4", title: "Showreel 04" },
  { id: "hero-portada-5", title: "Showreel 05" },
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
    if (index === activeIndex) return;

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

        <nav className="hero-video-progress" aria-label="Selección de portadas">
          <div className="hero-video-progress-list">
            {HERO_VIDEOS.map((vid, idx) => {
              const fillWidth = idx === activeIndex ? `${Math.min(100, Math.max(0, progress))}%` : "0%";

              return (
                <button
                  key={vid.id}
                  aria-current={idx === activeIndex ? "true" : undefined}
                  aria-label={`Reproducir ${vid.title}`}
                  className={`hero-video-progress-item ${idx === activeIndex ? "is-active" : ""}`}
                  onClick={() => handleSelect(idx)}
                  title={`Ver ${vid.title}`}
                  type="button"
                >
                  <span className="hero-video-progress-track">
                    <span
                      className="hero-video-progress-fill"
                      style={{ width: fillWidth }}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </SceneShell>
    </div>
  );
}

