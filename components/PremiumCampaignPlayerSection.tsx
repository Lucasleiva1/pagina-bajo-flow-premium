"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { createPortal, flushSync } from "react-dom";
import { SceneShell } from "@/components/SceneShell";
import type { SiteCopy } from "@/data/site";

type Campaign = SiteCopy["services"]["services"][number];
type DragState = {
  currentX: number;
  hasDragged: boolean;
  pointerId: number;
  startX: number;
  startY: number;
  targetIndex: number;
};

const campaignVideoNames = [
  "campaign-publi-1",
  "campaign-publi-2",
  "campaign-publi-3",
  "campaign-publi-4",
  "campaign-publi-5",
  "campaign-publi-6",
  "campaign-publi-7",
] as const;

const videoWidths = [480, 768, 1280, 1920] as const;

function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function getCircularOffset(index: number, active: number, total: number) {
  let offset = index - active;

  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;

  return offset;
}

function getVideoName(campaign: Campaign, index: number) {
  return campaign.videoName || campaignVideoNames[index] || campaignVideoNames[0];
}

const dragThreshold = 38;
const clickTolerance = 7;

function CampaignVideoSources({ name, fullResolution = false }: { name: string; fullResolution?: boolean }) {
  const widths = fullResolution ? ([1920] as const) : videoWidths;

  return (
    <>
      {widths.map((width) => (
        <source
          key={`webm-${width}`}
          media={fullResolution || width === 1920 ? undefined : `(max-width: ${width === 480 ? 600 : width === 768 ? 900 : 1400}px)`}
          src={`/videos/${name}-${width}.webm`}
          type="video/webm"
        />
      ))}
      {widths.map((width) => (
        <source
          key={`mp4-${width}`}
          media={fullResolution || width === 1920 ? undefined : `(max-width: ${width === 480 ? 600 : width === 768 ? 900 : 1400}px)`}
          src={`/videos/${name}-${width}.mp4`}
          type="video/mp4"
        />
      ))}
    </>
  );
}

function getCardStyle(offset: number, dragOffset: number) {
  const liveOffset = offset + dragOffset;
  const absOffset = Math.abs(liveOffset);
  const direction = Math.sign(liveOffset);
  const isHidden = absOffset > 2.8;
  const translateX = liveOffset * 3.35;
  const translateY = absOffset * 0.34;
  const translateZ = absOffset < 0.08 ? 76 : -absOffset * 82;
  const scale = Math.max(0.68, 1 - absOffset * 0.12);

  return {
    filter: `brightness(${Math.max(0.58, 1 - absOffset * 0.1)})`,
    opacity: isHidden ? 0 : Math.max(0.24, 1 - absOffset * 0.18),
    pointerEvents: isHidden ? ("none" as const) : ("auto" as const),
    transform: `translate3d(${translateX}rem, ${translateY}rem, ${translateZ}px) rotateY(${direction * -9}deg) scale(${scale})`,
    zIndex: Math.round(40 - absOffset * 4),
  };
}

export function PremiumCampaignPlayerSection({
  copy,
  isActive = true,
}: {
  copy: SiteCopy["services"];
  isActive?: boolean;
}) {
  const campaigns = copy.services;
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Con las secciones apiladas, la que manda es cual esta activa.
  const isInView = isActive;
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const activeIndexRef = useRef(activeIndex);
  const dragStateRef = useRef<DragState | null>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement | null>(null);
  const fullscreenCloseFrameRef = useRef<number | null>(null);
  const fullscreenTriggerRef = useRef<HTMLButtonElement | null>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement | null>(null);
  const fullscreenViewportHeightRef = useRef(0);
  const resumeTimeRef = useRef(0);
  const sectionViewportOffsetRef = useRef(0);
  const scrollPositionRef = useRef(0);
  const suppressClickRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeCampaign = campaigns[activeIndex] ?? campaigns[0];
  const activeVideoName = getVideoName(activeCampaign, activeIndex);
  const isVerticalVideo = activeCampaign.meta.includes("9:16");
  activeIndexRef.current = activeIndex;

  const progressLabel = useMemo(() => {
    const active = formatIndex(activeIndex);
    const total = String(campaigns.length).padStart(2, "0");
    return `${active} / ${total}`;
  }, [activeIndex, campaigns.length]);

  const move = useCallback(
    (direction: number) => {
      setActiveIndex((current) => (current + direction + campaigns.length) % campaigns.length);
    },
    [campaigns.length],
  );

  useEffect(() => {
    setIsVideoReady(false);
    setPlaybackProgress(0);
    resumeTimeRef.current = 0;
  }, [activeIndex]);


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isInView || isFullscreen) {
      video.pause();
      return;
    }

    if (resumeTimeRef.current > 0 && Number.isFinite(video.duration)) {
      video.currentTime = Math.min(resumeTimeRef.current, Math.max(0, video.duration - 0.1));
      resumeTimeRef.current = 0;
    }

    window.requestAnimationFrame(() => {
      video.play().catch(() => undefined);
    });
  }, [activeVideoName, isFullscreen, isInView]);

  function openFullscreen() {
    if (fullscreenCloseFrameRef.current !== null) {
      window.cancelAnimationFrame(fullscreenCloseFrameRef.current);
      fullscreenCloseFrameRef.current = null;
    }

    const section = document.getElementById("services");
    scrollPositionRef.current = window.scrollY;
    sectionViewportOffsetRef.current = section?.getBoundingClientRect().top ?? 0;
    fullscreenViewportHeightRef.current = window.innerHeight;
    resumeTimeRef.current = videoRef.current?.currentTime ?? 0;
    flushSync(() => setIsFullscreen(true));

    const fullscreenVideo = fullscreenVideoRef.current;
    if (fullscreenVideo) {
      fullscreenVideo.muted = false;
      fullscreenVideo.volume = 1;
      fullscreenVideo.play().catch(() => undefined);
    }

    const fullscreenContainer = fullscreenContainerRef.current;
    if (fullscreenContainer?.requestFullscreen && document.fullscreenElement !== fullscreenContainer) {
      fullscreenContainer.requestFullscreen().catch(() => undefined);
    }
  }

  function finishClosingFullscreen() {
    if (fullscreenCloseFrameRef.current !== null) return;

    const startedAt = window.performance.now();

    function restoreCampaignPosition() {
      const section = document.getElementById("services");
      if (!section) {
        window.scrollTo({ behavior: "auto", top: scrollPositionRef.current });
        return;
      }

      const sectionDocumentTop = window.scrollY + section.getBoundingClientRect().top;
      window.scrollTo({
        behavior: "auto",
        top: sectionDocumentTop - sectionViewportOffsetRef.current,
      });
    }

    function waitForViewportToSettle() {
      const hasOriginalViewportHeight =
        Math.abs(window.innerHeight - fullscreenViewportHeightRef.current) <= 2;
      const hasTimedOut = window.performance.now() - startedAt >= 500;

      if (!hasOriginalViewportHeight && !hasTimedOut) {
        fullscreenCloseFrameRef.current = window.requestAnimationFrame(waitForViewportToSettle);
        return;
      }

      restoreCampaignPosition();
      fullscreenCloseFrameRef.current = window.requestAnimationFrame(() => {
        restoreCampaignPosition();
        fullscreenCloseFrameRef.current = null;
        flushSync(() => setIsFullscreen(false));
      });
    }

    fullscreenCloseFrameRef.current = window.requestAnimationFrame(waitForViewportToSettle);
  }

  function closeFullscreen() {
    resumeTimeRef.current = fullscreenVideoRef.current?.currentTime ?? resumeTimeRef.current;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(finishClosingFullscreen);
      return;
    }

    finishClosingFullscreen();
  }

  function handleVideoTimeUpdate(event: React.SyntheticEvent<HTMLVideoElement>) {
    const video = event.currentTarget;
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;

    setPlaybackProgress((video.currentTime / video.duration) * 100);
  }

  function handleVideoEnded() {
    setPlaybackProgress(0);
    move(1);
  }

  function toggleActiveVideoPlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => undefined);
      return;
    }

    video.pause();
  }

  function handleDeckPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>("[data-campaign-index]") : null;
    const targetIndex = Number(target?.dataset.campaignIndex ?? activeIndexRef.current);

    event.preventDefault();
    dragStateRef.current = {
      currentX: event.clientX,
      hasDragged: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      targetIndex: Number.isFinite(targetIndex) ? targetIndex : activeIndexRef.current,
    };
    setDragOffset(0);

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Some browsers may skip pointer capture for synthetic events.
    }
  }

  function handleDeckPointerMove(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    dragState.currentX = event.clientX;
    if (Math.abs(deltaX) > clickTolerance || Math.abs(deltaY) > clickTolerance) {
      dragState.hasDragged = true;
      event.preventDefault();
    }

    if (!dragState.hasDragged) return;

    const dampedOffset = Math.max(-0.62, Math.min(0.62, deltaX / 170));
    setDragOffset(dampedOffset);
  }

  function finishDeckDrag(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const deltaX = dragState.currentX - dragState.startX;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Capture can already be released on pointer cancellation.
    }

    if (dragState.hasDragged) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
      if (Math.abs(deltaX) > dragThreshold) {
        move(deltaX < 0 ? 1 : -1);
      }
    } else {
      setActiveIndex(dragState.targetIndex);
    }

    dragStateRef.current = null;
    setDragOffset(0);
  }

  function cancelDeckDrag(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Capture can already be released on pointer cancellation.
    }

    dragStateRef.current = null;
    setDragOffset(0);
  }

  useEffect(() => {
    function isTypingTarget(element: Element | null) {
      if (!(element instanceof HTMLElement)) return false;
      return element.isContentEditable || ["INPUT", "SELECT", "TEXTAREA"].includes(element.tagName);
    }

    function isSectionInView() {
      const section = document.getElementById("services");
      const rect = section?.getBoundingClientRect();
      if (!rect) return false;

      return rect.top < window.innerHeight * 0.72 && rect.bottom > window.innerHeight * 0.28;
    }

    function handleWindowKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || isFullscreen || isTypingTarget(document.activeElement) || !isSectionInView()) return;

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openFullscreen();
      }
    }

    window.addEventListener("keydown", handleWindowKeyDown);

    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, [isFullscreen, move]);

  useLayoutEffect(() => {
    if (!isFullscreen) return;

    const body = document.body;
    const root = document.documentElement;
    const previousBodyOverflow = body.style.overflow;

    root.classList.add("campaign-fullscreen-scroll-lock");
    body.style.overflow = "hidden";

    function handleFullscreenKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeFullscreen();
    }

    function handleNativeFullscreenChange() {
      if (document.fullscreenElement) return;

      resumeTimeRef.current = fullscreenVideoRef.current?.currentTime ?? resumeTimeRef.current;
      finishClosingFullscreen();
    }

    window.addEventListener("keydown", handleFullscreenKeyDown);
    document.addEventListener("fullscreenchange", handleNativeFullscreenChange);
    return () => {
      body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", handleFullscreenKeyDown);
      document.removeEventListener("fullscreenchange", handleNativeFullscreenChange);
      fullscreenTriggerRef.current?.focus({ preventScroll: true });
      root.classList.remove("campaign-fullscreen-scroll-lock");
    };
  }, [isFullscreen]);

  const fullscreenPlayer = isFullscreen
    ? createPortal(
        <div
          aria-label={`Video: ${activeCampaign.title}`}
          aria-modal="true"
          className="premium-campaign-fullscreen"
          ref={fullscreenContainerRef}
          role="dialog"
        >
          <div className="premium-campaign-fullscreen-heading">
            <div>
              <span>{activeCampaign.eyebrow}</span>
              <strong>{activeCampaign.title}</strong>
            </div>
            <button
              aria-label="Cerrar video y volver al panel de campañas"
              className="premium-campaign-fullscreen-close"
              onClick={closeFullscreen}
              type="button"
            >
              <span aria-hidden="true"><i /></span>
            </button>
          </div>
          <video
            autoPlay
            className={isVerticalVideo ? "is-vertical" : undefined}
            controls
            key={`fullscreen-${activeVideoName}`}
            onEnded={handleVideoEnded}
            onLoadedMetadata={(event) => {
              if (resumeTimeRef.current > 0) event.currentTarget.currentTime = resumeTimeRef.current;
            }}
            onTimeUpdate={handleVideoTimeUpdate}
            playsInline
            poster={`/videos/${activeVideoName}-poster.jpg`}
            preload="auto"
            ref={fullscreenVideoRef}
          >
            <CampaignVideoSources fullResolution name={activeVideoName} />
          </video>
        </div>,
        document.body,
      )
    : null;

  return (
    <SceneShell className="premium-campaign-scene services-scene" id="services">
      <div className="premium-campaign-bg" aria-hidden="true" />
      <div className="premium-campaign-console" data-scene-copy>
        <div className="premium-campaign-stage" aria-live="polite">
          <div className={`premium-campaign-screen${isVerticalVideo ? " is-vertical" : ""}`} aria-hidden="true">
            <img alt="" className="premium-campaign-screen-backdrop" src={activeCampaign.screenImage} />
            <video
              autoPlay={isInView && !isFullscreen}
              className={`premium-campaign-video${isVideoReady ? " is-ready" : ""}`}
              controls={false}
              key={activeVideoName}
              muted
              onEnded={handleVideoEnded}
              onPause={() => setIsVideoPlaying(false)}
              onPlaying={() => setIsVideoReady(true)}
              onPlay={() => setIsVideoPlaying(true)}
              onTimeUpdate={handleVideoTimeUpdate}
              playsInline
              poster={`/videos/${activeVideoName}-poster.jpg`}
              preload="metadata"
              ref={videoRef}
            >
              <CampaignVideoSources name={activeVideoName} />
            </video>
          </div>

          <div className="premium-campaign-chrome premium-campaign-chrome-top" aria-hidden="true">
            <span>{copy.cardLabel}</span>
            <span>Resolution 4K</span>
            <span>FPS 24</span>
          </div>

          <div className="premium-campaign-copy">
            <p className="kicker">{copy.kicker}</p>
            <h2>{copy.title}</h2>
            <p>{copy.lead}</p>
          </div>

          <div
            className="premium-campaign-deck"
            onPointerCancel={cancelDeckDrag}
            onPointerDown={handleDeckPointerDown}
            onPointerMove={handleDeckPointerMove}
            onPointerUp={finishDeckDrag}
            onWheel={(event) => {
              event.preventDefault();
            }}
          >
            <div className="premium-campaign-deck-stack">
              {campaigns.map((campaign, index) => {
                const offset = getCircularOffset(index, activeIndex, campaigns.length);
                const isActive = index === activeIndex;

                return (
                  <button
                    aria-label={`${copy.cardLabel}: ${campaign.title}`}
                    aria-pressed={isActive}
                    className={`premium-campaign-cartridge${isActive ? " active" : ""}`}
                    data-campaign-index={index}
                    key={campaign.title}
                    onClick={(event) => {
                      if (suppressClickRef.current) {
                        event.preventDefault();
                        suppressClickRef.current = false;
                        return;
                      }

                      setActiveIndex(index);
                    }}
                    style={getCardStyle(offset, dragOffset)}
                    type="button"
                  >
                    <span className="premium-campaign-cartridge-media" aria-hidden="true">
                      <img alt="" decoding="async" loading="lazy" src={campaign.cardImage} />
                    </span>
                    <span className="premium-campaign-cartridge-shine" aria-hidden="true" />
                    <span className="premium-campaign-cartridge-index">{formatIndex(index)}</span>
                    <span className="premium-campaign-cartridge-copy">
                      <small>{campaign.eyebrow}</small>
                      <strong>{campaign.title}</strong>
                      <em>{campaign.meta}</em>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="premium-campaign-active-copy">
            <span>{copy.activeLabel}</span>
            <h3>{activeCampaign.headline}</h3>
            <p>{activeCampaign.description}</p>
          </div>

          <div className="premium-campaign-transport">
            <button aria-label={copy.previous} onClick={() => move(-1)} type="button">
              <span aria-hidden="true">Prev</span>
            </button>
            <button
              aria-label={isVideoPlaying ? "Pausar video" : "Reproducir video"}
              className={isVideoPlaying ? "is-playing" : undefined}
              onClick={toggleActiveVideoPlayback}
              type="button"
            >
              <span aria-hidden="true">{isVideoPlaying ? "Pause" : "Play"}</span>
            </button>
            <div className="premium-campaign-progress-track" aria-hidden="true">
              <i style={{ width: `${playbackProgress}%` }} />
            </div>
            <strong>{progressLabel}</strong>
            <button aria-label={copy.next} onClick={() => move(1)} type="button">
              <span aria-hidden="true">Next</span>
            </button>
            <button
              aria-label="Abrir video en pantalla completa con sonido"
              className="premium-campaign-fullscreen-trigger"
              onClick={openFullscreen}
              ref={fullscreenTriggerRef}
              type="button"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {fullscreenPlayer}
    </SceneShell>
  );
}
