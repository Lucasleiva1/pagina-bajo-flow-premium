"use client";

import { type MouseEvent, type PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SceneShell } from "@/components/SceneShell";
import type { SiteCopy } from "@/data/site";

type Campaign = SiteCopy["services"]["services"][number];

type DragState = {
  id: number;
  startX: number;
  startY: number;
};

const campaignVideoNames = [
  "campaign-youtube-video-largo",
  "campaign-reels-shorts",
  "campaign-postproduccion",
  "campaign-ads-contenido-comercial",
  "campaign-motion-visual-design",
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

function getCoverFlowStyle(offset: number, isDragging: boolean) {
  const absOffset = Math.abs(offset);
  const direction = Math.sign(offset);
  const isHidden = absOffset > 2;
  const x = offset === 0 ? 0 : direction * (6.4 + (absOffset - 1) * 2.15);
  const y = absOffset * 0.45;
  const z = offset === 0 ? 6 : 5 - absOffset;
  const rotate = offset === 0 ? 0 : direction * -24;
  const scale = Math.max(0.74, 1 - absOffset * 0.105);

  return {
    opacity: isHidden ? 0 : Math.max(0.38, 1 - absOffset * 0.22),
    pointerEvents: isHidden ? ("none" as const) : ("auto" as const),
    transform: `translate3d(${x}rem, ${y}rem, ${offset === 0 ? 4 : -absOffset * 52}px) rotateY(${rotate}deg) scale(${isDragging ? 1.025 : scale})`,
    zIndex: z,
  };
}

function getVideoName(campaign: Campaign, index: number) {
  return campaign.videoName || campaignVideoNames[index] || campaignVideoNames[0];
}

export function PremiumCampaignPlayerSection({ copy }: { copy: SiteCopy["services"] }) {
  const campaigns = copy.services;
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedIndex, setLoadedIndex] = useState<number | null>(null);
  const [isDropHot, setIsDropHot] = useState(false);
  const [dragVector, setDragVector] = useState({ x: 0, y: 0 });
  const activeIndexRef = useRef(activeIndex);
  const dragState = useRef<DragState | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const suppressClick = useRef(false);
  const reduceMotion = useReducedMotion();
  const activeCampaign = campaigns[activeIndex] ?? campaigns[0];
  const loadedCampaign = loadedIndex === null ? null : campaigns[loadedIndex];
  const loadedVideoName =
    loadedIndex === null || !loadedCampaign ? null : getVideoName(loadedCampaign, loadedIndex);
  activeIndexRef.current = activeIndex;

  const progressLabel = useMemo(() => {
    const active = formatIndex(activeIndex);
    const total = String(campaigns.length).padStart(2, "0");
    return `${active} / ${total}`;
  }, [activeIndex, campaigns.length]);

  function move(direction: number) {
    setActiveIndex((current) => (current + direction + campaigns.length) % campaigns.length);
    setDragVector({ x: 0, y: 0 });
    setIsDropHot(false);
  }

  function loadCampaign(index: number) {
    setLoadedIndex(index);
    window.requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => undefined);
    });
  }

  function isInsidePlayer(clientX: number, clientY: number) {
    const rect = playerRef.current?.getBoundingClientRect();
    if (!rect) return false;

    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  }

  function updateDragPosition(clientX: number, clientY: number) {
    const current = dragState.current;
    if (!current) return;

    setDragVector({
      x: clientX - current.startX,
      y: clientY - current.startY,
    });
    setIsDropHot(isInsidePlayer(clientX, clientY));
  }

  function finishDrag(clientX: number, clientY: number) {
    const current = dragState.current;
    if (!current) return;

    dragState.current = null;
    suppressClick.current = Math.abs(clientX - current.startX) > 8 || Math.abs(clientY - current.startY) > 8;

    if (isInsidePlayer(clientX, clientY)) {
      loadCampaign(activeIndexRef.current);
    }

    setDragVector({ x: 0, y: 0 });
    setIsDropHot(false);
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

    function handleWindowPointerMove(event: globalThis.PointerEvent) {
      const current = dragState.current;
      if (!current || (current.id !== -1 && current.id !== event.pointerId)) return;
      updateDragPosition(event.clientX, event.clientY);
    }

    function handleWindowPointerUp(event: globalThis.PointerEvent) {
      const current = dragState.current;
      if (!current || (current.id !== -1 && current.id !== event.pointerId)) return;
      finishDrag(event.clientX, event.clientY);
    }

    function handleWindowMouseMove(event: globalThis.MouseEvent) {
      if (!dragState.current) return;
      updateDragPosition(event.clientX, event.clientY);
    }

    function handleWindowMouseUp(event: globalThis.MouseEvent) {
      if (!dragState.current) return;
      finishDrag(event.clientX, event.clientY);
    }

    function handleWindowKeyDown(event: globalThis.KeyboardEvent) {
      if (event.defaultPrevented || isTypingTarget(document.activeElement) || !isSectionInView()) return;

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
        loadCampaign(activeIndexRef.current);
      }
    }

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
    window.addEventListener("keydown", handleWindowKeyDown);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  });

  function handleActivePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    dragState.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
    suppressClick.current = false;
    event.preventDefault();

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* Pointer capture is a progressive enhancement for drag reliability. */
    }
  }

  function handleActivePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const current = dragState.current;
    if (!current || current.id !== event.pointerId) return;

    updateDragPosition(event.clientX, event.clientY);
  }

  function handleActivePointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    const current = dragState.current;
    if (!current || current.id !== event.pointerId) return;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* Ignore browsers that release capture automatically. */
    }

    finishDrag(event.clientX, event.clientY);
  }

  function handleActivePointerCancel(event: ReactPointerEvent<HTMLButtonElement>) {
    dragState.current = null;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* Ignore browsers that release capture automatically. */
    }

    setDragVector({ x: 0, y: 0 });
    setIsDropHot(false);
  }

  function handleActiveMouseDown(event: MouseEvent<HTMLButtonElement>) {
    if (dragState.current || event.button !== 0) return;

    dragState.current = {
      id: -1,
      startX: event.clientX,
      startY: event.clientY,
    };
    suppressClick.current = false;
  }

  return (
    <SceneShell className="premium-campaign-scene services-scene" id="services">
      <div className="premium-campaign-bg" aria-hidden="true" />
      <div className="premium-campaign-shell" data-scene-copy>
        <aside className="premium-campaign-rail" aria-label={copy.cardLabel}>
          <div className="premium-campaign-rail-copy">
            <p className="kicker">{copy.kicker}</p>
            <h2>{copy.title}</h2>
            <p>{copy.lead}</p>
          </div>

          <div
            className="premium-cover-flow"
            onWheel={(event) => {
              event.preventDefault();
              move(event.deltaY > 0 ? 1 : -1);
            }}
            tabIndex={0}
          >
            <div className="premium-cover-flow-stack">
              {campaigns.map((campaign, index) => {
                const offset = getCircularOffset(index, activeIndex, campaigns.length);
                const isActive = index === activeIndex;
                const isDragging = isActive && (dragVector.x !== 0 || dragVector.y !== 0);
                const cardStyle = getCoverFlowStyle(offset, isDragging);
                const dragStyle =
                  isDragging && !reduceMotion
                    ? ` translate3d(${dragVector.x}px, ${dragVector.y}px, 96px) rotateZ(${Math.max(-7, Math.min(7, dragVector.x / 34))}deg)`
                    : "";

                return (
                  <motion.button
                    aria-label={`${copy.cardLabel}: ${campaign.title}`}
                    aria-pressed={isActive}
                    className={`premium-campaign-cartridge${isActive ? " active" : ""}${isDragging ? " dragging" : ""}`}
                    key={campaign.title}
                    onClick={() => {
                      if (suppressClick.current) {
                        suppressClick.current = false;
                        return;
                      }
                      if (isActive) {
                        loadCampaign(index);
                        return;
                      }
                      setActiveIndex(index);
                    }}
                    onPointerCancel={isActive ? handleActivePointerCancel : undefined}
                    onPointerDown={isActive ? handleActivePointerDown : undefined}
                    onPointerMove={isActive ? handleActivePointerMove : undefined}
                    onPointerUp={isActive ? handleActivePointerUp : undefined}
                    onMouseDown={isActive ? handleActiveMouseDown : undefined}
                    style={{
                      ...cardStyle,
                      transform: `${cardStyle.transform}${dragStyle}`,
                    }}
                    type="button"
                  >
                    <img alt="" aria-hidden="true" src={campaign.cardImage} />
                    <span className="premium-campaign-cartridge-shine" aria-hidden="true" />
                    <span className="premium-campaign-cartridge-index">{formatIndex(index)}</span>
                    <span className="premium-campaign-cartridge-copy">
                      <small>{campaign.eyebrow}</small>
                      <strong>{campaign.title}</strong>
                      <em>{campaign.meta}</em>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="premium-campaign-dial" aria-label={copy.progress}>
            <button aria-label={copy.previous} onClick={() => move(-1)} type="button">
              <span aria-hidden="true">‹</span>
            </button>
            <button aria-label={copy.loadSelected} onClick={() => loadCampaign(activeIndexRef.current)} type="button">
              <span aria-hidden="true">▶</span>
            </button>
            <button aria-label={copy.next} onClick={() => move(1)} type="button">
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </aside>

        <section className="premium-campaign-player-panel" aria-live="polite">
          <div className="premium-campaign-player-top">
            <div>
              <span>{copy.activeLabel}</span>
              <strong>{activeCampaign.title}</strong>
            </div>
            <p>{progressLabel}</p>
          </div>

          <div
            className={`premium-campaign-player${isDropHot ? " drop-hot" : ""}${loadedCampaign ? " is-loaded" : ""}`}
            ref={playerRef}
          >
            {loadedCampaign && loadedVideoName ? (
              <video
                autoPlay
                className="premium-campaign-video"
                controls={false}
                key={loadedVideoName}
                loop
                muted
                playsInline
                poster={`/videos/${loadedVideoName}-poster.jpg`}
                preload="metadata"
                ref={videoRef}
              >
                {videoWidths.map((width) => (
                  <source
                    key={`webm-${width}`}
                    media={width === 1920 ? undefined : `(max-width: ${width === 480 ? 600 : width === 768 ? 900 : 1400}px)`}
                    src={`/videos/${loadedVideoName}-${width}.webm`}
                    type="video/webm"
                  />
                ))}
                {videoWidths.map((width) => (
                  <source
                    key={`mp4-${width}`}
                    media={width === 1920 ? undefined : `(max-width: ${width === 480 ? 600 : width === 768 ? 900 : 1400}px)`}
                    src={`/videos/${loadedVideoName}-${width}.mp4`}
                    type="video/mp4"
                  />
                ))}
              </video>
            ) : (
              <div className="premium-campaign-poster-shell">
                <img alt="" aria-hidden="true" src={activeCampaign.screenImage} />
              </div>
            )}

            <div className="premium-campaign-drop-zone" aria-hidden="true">
              <span />
              <strong>{loadedCampaign ? copy.dropLoaded : copy.dropIdle}</strong>
              <small>{copy.dropHint}</small>
            </div>
            <div className="premium-campaign-tool-rail" aria-hidden="true">
              <span>Cut</span>
              <span>Color</span>
              <span>Audio</span>
              <span>Text</span>
              <span>FX</span>
            </div>
          </div>

          <div className="premium-campaign-transport">
            <button aria-label={copy.previous} onClick={() => move(-1)} type="button">
              <span aria-hidden="true">|&lt;</span>
            </button>
            <button aria-label={copy.loadSelected} onClick={() => loadCampaign(activeIndexRef.current)} type="button">
              <span aria-hidden="true">▶</span>
            </button>
            <div className="premium-campaign-progress-track" aria-hidden="true">
              <i style={{ width: `${((activeIndex + 1) / campaigns.length) * 100}%` }} />
            </div>
            <button aria-label={copy.next} onClick={() => move(1)} type="button">
              <span aria-hidden="true">&gt;|</span>
            </button>
          </div>

          <div className="premium-campaign-detail">
            <span>{activeCampaign.eyebrow}</span>
            <h3>{activeCampaign.headline}</h3>
            <p>{activeCampaign.description}</p>
          </div>
        </section>
      </div>
    </SceneShell>
  );
}
