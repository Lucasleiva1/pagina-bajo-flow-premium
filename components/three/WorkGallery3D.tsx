"use client";

import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { createPortal, flushSync } from "react-dom";
import { motion, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/data/site";

type WorkGallery3DProps = {
  active: number;
  dragOffset?: number;
  isSectionActive?: boolean;
  labels: {
    gallery: string;
    project: string;
    tools: string;
    viewCase: string;
  };
  projects: Project[];
  setActive: (index: number) => void;
};

function circularOffset(index: number, active: number, length: number) {
  let offset = index - active;

  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;

  return offset;
}

function slotForOffset(offset: number) {
  if (offset === 0) return "center";
  if (offset === -1) return "left";
  if (offset === 1) return "right";
  return "hidden";
}

function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function posterForVideo(src: string) {
  const name = src.split("/").pop()?.replace(/\.\w+$/, "");

  return name ? `/images/work/${name}-poster.jpg` : undefined;
}

export function WorkGallery3D({
  active,
  dragOffset = 0,
  isSectionActive = true,
  labels,
  projects,
  setActive,
}: WorkGallery3DProps) {
  const total = projects.length;
  const dragXSpring = useSpring(0, { stiffness: 220, damping: 26 });
  const dragTiltSpring = useSpring(0, { stiffness: 220, damping: 26 });
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const fullscreenCloseFrameRef = useRef<number | null>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement | null>(null);
  const fullscreenTriggerRef = useRef<HTMLButtonElement | null>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement | null>(null);
  const fullscreenViewportHeightRef = useRef(0);
  const resumeTimeRef = useRef(0);
  const sectionViewportOffsetRef = useRef(0);
  const scrollPositionRef = useRef(0);
  const fullscreenProject = fullscreenIndex === null ? null : projects[fullscreenIndex];

  useEffect(() => {
    dragXSpring.set(dragOffset);
    dragTiltSpring.set(dragOffset / -28);
  }, [dragOffset, dragXSpring, dragTiltSpring]);

  // Performance: los videos no se descargan hasta la primera vez que la seccion
  // se vuelve activa. Despues quedan montados para siempre (nunca se recargan).
  const isInView = isSectionActive;

  useEffect(() => {
    if (isSectionActive) setHasEnteredView(true);
  }, [isSectionActive]);

  // Performance: solo la tarjeta central reproduce; las laterales quedan en su poster.
  useEffect(() => {
    if (!hasEnteredView) return;

    cardVideoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === active && isInView && fullscreenIndex === null) {
        video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [active, fullscreenIndex, hasEnteredView, isInView]);

  const transform = useTransform(
    [dragXSpring, dragTiltSpring],
    ([x, tilt]) => `translate(calc(-50% + ${x}px), -50%) rotateY(${tilt}deg)`
  );

  function selectProject(index: number) {
    if (index !== active) setActive(index);
  }

  function openFullscreen(index: number) {
    if (fullscreenCloseFrameRef.current !== null) {
      window.cancelAnimationFrame(fullscreenCloseFrameRef.current);
      fullscreenCloseFrameRef.current = null;
    }

    const section = document.getElementById("work");
    const cardVideo = document.querySelector<HTMLVideoElement>(
      `[data-work-index="${index}"] .work-card-media`,
    );

    scrollPositionRef.current = window.scrollY;
    sectionViewportOffsetRef.current = section?.getBoundingClientRect().top ?? 0;
    fullscreenViewportHeightRef.current = window.innerHeight;
    resumeTimeRef.current = cardVideo?.currentTime ?? 0;
    flushSync(() => setFullscreenIndex(index));

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

    function restoreWorkPosition() {
      const section = document.getElementById("work");
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

      restoreWorkPosition();
      fullscreenCloseFrameRef.current = window.requestAnimationFrame(() => {
        restoreWorkPosition();
        fullscreenCloseFrameRef.current = null;
        flushSync(() => setFullscreenIndex(null));
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

  function stopCardPointer(event: PointerEvent<HTMLElement>) {
    event.stopPropagation();
  }

  useLayoutEffect(() => {
    if (fullscreenIndex === null) return;

    const body = document.body;
    const root = document.documentElement;
    const previousBodyOverflow = body.style.overflow;

    root.classList.add("work-fullscreen-scroll-lock");
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
      root.classList.remove("work-fullscreen-scroll-lock");
    };
  }, [fullscreenIndex]);

  const fullscreenPlayer = fullscreenProject
    ? createPortal(
        <div
          aria-label={`Video: ${fullscreenProject.title}`}
          aria-modal="true"
          className="premium-campaign-fullscreen work-fullscreen"
          ref={fullscreenContainerRef}
          role="dialog"
        >
          <div className="premium-campaign-fullscreen-heading">
            <div>
              <span>{fullscreenProject.category}</span>
              <strong>{fullscreenProject.title}</strong>
            </div>
            <button
              aria-label="Cerrar video y volver a Trabajos"
              className="premium-campaign-fullscreen-close"
              onClick={closeFullscreen}
              type="button"
            >
              <span aria-hidden="true">
                <i />
              </span>
            </button>
          </div>
          <video
            autoPlay
            controls
            key={`work-fullscreen-${fullscreenProject.video}`}
            onLoadedMetadata={(event) => {
              if (resumeTimeRef.current > 0) event.currentTarget.currentTime = resumeTimeRef.current;
            }}
            playsInline
            preload="auto"
            ref={fullscreenVideoRef}
            src={fullscreenProject.video}
          >
            <track kind="captions" />
          </video>
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="work-canvas cinematic-gallery" aria-label={labels.gallery} ref={galleryRef}>
      <div className="gallery-atmosphere" aria-hidden="true" />
      <motion.div
        className={`gallery-orbit${dragOffset !== 0 ? " dragging" : ""}`}
        style={{
          transform,
          transition: "none",
        }}
      >
        {projects.map((project, index) => {
          const offset = circularOffset(index, active, total);
          const slot = slotForOffset(offset);
          const isActive = index === active;
          const isVisible = slot !== "hidden";

          return (
            <article
              aria-hidden={!isVisible}
              aria-label={`${labels.project} ${formatIndex(index)}: ${project.title}`}
              className={`work-card ${slot}${isActive ? " active" : ""}`}
              data-work-index={index}
              key={project.title}
              suppressHydrationWarning
            >
              {!isActive && isVisible && (
                <button
                  aria-label={`Select ${project.title}`}
                  className="work-card-interaction"
                  onClick={() => selectProject(index)}
                  type="button"
                  suppressHydrationWarning
                />
              )}
              <div className="work-card-media-wrap" suppressHydrationWarning>
                <video
                  className="work-card-media"
                  loop
                  muted
                  playsInline
                  poster={posterForVideo(project.video)}
                  preload={hasEnteredView && isActive ? "metadata" : "none"}
                  ref={(node) => {
                    cardVideoRefs.current[index] = node;
                  }}
                  src={hasEnteredView && isVisible ? project.video : undefined}
                >
                  <track kind="captions" />
                </video>
                <div className="work-card-shade" aria-hidden="true" />
              </div>

              <div className="work-card-meta top">
                <span>{formatIndex(index)}</span>
                <i aria-hidden="true" />
                <span className="runtime">{project.runtime}</span>
              </div>

              <div className="work-card-copy">
                <p className="project-category">{project.category}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>

              <div className="work-card-footer">
                <div className="work-tools" aria-label={labels.tools}>
                  {project.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
                {isActive ? (
                  <div className="work-card-actions">
                    <a
                      className="work-view-case"
                      href={project.href}
                      onClick={(event) => event.stopPropagation()}
                      onPointerDown={(event) => event.stopPropagation()}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {labels.viewCase}
                      <svg aria-hidden="true" viewBox="0 0 16 16">
                        <path d="M5 3h8v8" />
                        <path d="M13 3 3 13" />
                      </svg>
                    </a>
                    <button
                      aria-label={`Abrir ${project.title} en pantalla completa con sonido`}
                      className="work-fullscreen-trigger"
                      onClick={(event) => {
                        event.stopPropagation();
                        openFullscreen(index);
                      }}
                      onPointerDown={stopCardPointer}
                      ref={fullscreenTriggerRef}
                      type="button"
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />
                      </svg>
                    </button>
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </motion.div>
      {fullscreenPlayer}
    </div>
  );
}
