"use client";

import { type PointerEvent as ReactPointerEvent, useEffect, useRef } from "react";
import { BioRoomCanvas } from "@/components/bio-room/BioRoomCanvas";
import { BioRoomControls } from "@/components/bio-room/BioRoomControls";
import { BioGalleryOverlay } from "@/components/bio-room/BioGalleryOverlay";
import type { SiteCopy } from "@/data/site";
import { useBioRoomStore } from "@/lib/useBioRoomStore";
import { playWhoosh, playModalOpen, playClickTick } from "@/lib/soundEffects";

type BioRoomExperienceProps = {
  copy: SiteCopy["bio"];
  isActive: boolean;
};

type MobileWallPan = {
  axis: "pending" | "horizontal" | "vertical";
  pointerId: number;
  startPan: number;
  startX: number;
  startY: number;
};

export function BioRoomExperience({ copy, isActive }: BioRoomExperienceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const activeRoomView = useBioRoomStore((state) => state.activeRoomView);
  const isOverlayOpen = useBioRoomStore((state) => state.isOverlayOpen);
  const adjustSideWallZoom = useBioRoomStore((state) => state.adjustSideWallZoom);
  const resetSideWallZoom = useBioRoomStore((state) => state.resetSideWallZoom);
  const setMobileWallPan = useBioRoomStore((state) => state.setMobileWallPan);
  const setActiveRoomView = useBioRoomStore((state) => state.setActiveRoomView);
  const isSideRoomView = activeRoomView === "bio" || activeRoomView === "gallery";
  const isRoomViewOpen = activeRoomView !== "home";
  const mobileWallPanRef = useRef<MobileWallPan | null>(null);

  const isFirstRenderView = useRef(true);
  const isFirstRenderOverlay = useRef(true);

  // Trigger camera whoosh sound on view change
  useEffect(() => {
    if (isFirstRenderView.current) {
      isFirstRenderView.current = false;
      return;
    }
    playWhoosh();
  }, [activeRoomView]);

  // Trigger modal sound on overlay open/close
  useEffect(() => {
    if (isFirstRenderOverlay.current) {
      isFirstRenderOverlay.current = false;
      return;
    }
    if (isOverlayOpen) {
      playModalOpen();
    } else {
      playClickTick();
    }
  }, [isOverlayOpen]);


  // El bloqueo de scroll y el zoom con rueda se quitaron: la pagina ya no
  // scrollea y la rueda cambia de seccion en todo el sitio.


  function handleReturnHome() {
    resetSideWallZoom();
    setActiveRoomView("home");
  }

  function handleMobilePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (window.innerWidth > 860 || isOverlayOpen || !event.isPrimary) return;
    if (mobileWallPanRef.current) return;
    if (event.target instanceof Element && event.target.closest("button, a, [role='dialog']")) return;

    mobileWallPanRef.current = {
      axis: "pending",
      pointerId: event.pointerId,
      startPan: useBioRoomStore.getState().mobileWallPan,
      startX: event.clientX,
      startY: event.clientY,
    };
  }

  function handleMobilePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const gesture = mobileWallPanRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId || window.innerWidth > 860) return;

    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;

    if (gesture.axis === "pending" && Math.hypot(deltaX, deltaY) >= 8) {
      gesture.axis = Math.abs(deltaX) > Math.abs(deltaY) * 1.15 ? "horizontal" : "vertical";

      if (gesture.axis === "horizontal") {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }

    if (gesture.axis !== "horizontal") return;

    event.preventDefault();
    const panTravel = Math.max(window.innerWidth * 0.62, 180);
    setMobileWallPan(gesture.startPan - deltaX / panTravel);
  }

  function finishMobileWallPan(event: ReactPointerEvent<HTMLDivElement>) {
    const gesture = mobileWallPanRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    mobileWallPanRef.current = null;
  }

  return (
    <div
      className="bio-room"
      onPointerCancel={finishMobileWallPan}
      onPointerDown={handleMobilePointerDown}
      onPointerMove={handleMobilePointerMove}
      onPointerUp={finishMobileWallPan}
      ref={sectionRef}
    >
      <BioRoomCanvas copy={copy} isActive={isActive} />
      {isRoomViewOpen ? (
        <button
          aria-label="Volver al centro de la Bio Room"
          className={`bio-room-return${activeRoomView === "contact" ? " bio-room-return-contact" : ""}`}
          onClick={handleReturnHome}
          type="button"
        >
          <span aria-hidden="true">←</span>
          <span>Volver</span>
        </button>
      ) : null}
      <BioRoomControls controls={copy.roomControls} />
      <BioGalleryOverlay />
    </div>
  );
}
