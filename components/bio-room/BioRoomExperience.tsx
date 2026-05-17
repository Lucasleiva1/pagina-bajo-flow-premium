"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BioRoomCanvas } from "@/components/bio-room/BioRoomCanvas";
import { BioRoomControls } from "@/components/bio-room/BioRoomControls";
import { BioGalleryOverlay } from "@/components/bio-room/BioGalleryOverlay";
import { BioRoomMobilePanels } from "@/components/bio-room/BioRoomMobilePanels";
import type { SiteCopy } from "@/data/site";
import { type BioRoomView, useBioRoomStore } from "@/lib/useBioRoomStore";

type BioRoomExperienceProps = {
  copy: SiteCopy["bio"];
};

const viewOrder: BioRoomView[] = ["home", "bio", "gallery", "contact"];

export function BioRoomExperience({ copy }: BioRoomExperienceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wheelLock = useRef(false);
  const activeRoomView = useBioRoomStore((state) => state.activeRoomView);
  const adjustSideWallZoom = useBioRoomStore((state) => state.adjustSideWallZoom);
  const resetSideWallZoom = useBioRoomStore((state) => state.resetSideWallZoom);
  const setActiveRoomView = useBioRoomStore((state) => state.setActiveRoomView);
  const isSideRoomView = activeRoomView === "bio" || activeRoomView === "gallery";

  const moveBy = useCallback(
    (direction: number) => {
      const currentIndex = viewOrder.indexOf(activeRoomView);
      const nextIndex = Math.max(0, Math.min(viewOrder.length - 1, currentIndex + direction));
      setActiveRoomView(viewOrder[nextIndex]);
    },
    [activeRoomView, setActiveRoomView],
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      viewOrder.forEach((view, index) => {
        ScrollTrigger.create({
          end: `${(index + 1) * 24}% top`,
          onEnter: () => setActiveRoomView(view),
          onEnterBack: () => setActiveRoomView(view),
          start: `${index * 24}% top`,
          trigger: sectionRef.current,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [setActiveRoomView]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 860px)").matches) return;

    const root = document.documentElement;
    const body = document.body;

    if (!isSideRoomView) {
      root.classList.remove("bio-room-scroll-locked");
      body.classList.remove("bio-room-scroll-locked");
      return;
    }

    sectionRef.current?.scrollIntoView({ block: "start" });
    root.classList.add("bio-room-scroll-locked");
    body.classList.add("bio-room-scroll-locked");

    return () => {
      root.classList.remove("bio-room-scroll-locked");
      body.classList.remove("bio-room-scroll-locked");
    };
  }, [isSideRoomView]);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    function handleWheel(event: WheelEvent) {
      if (window.matchMedia("(max-width: 860px)").matches) return;

      if (isSideRoomView) {
        event.preventDefault();
        event.stopPropagation();
        adjustSideWallZoom(event.deltaY > 0 ? 0.045 : -0.045);
        return;
      }

      if (Math.abs(event.deltaY) < 28 || wheelLock.current) return;

      const currentIndex = viewOrder.indexOf(activeRoomView);
      const nextIndex = Math.max(0, Math.min(viewOrder.length - 1, currentIndex + (event.deltaY > 0 ? 1 : -1)));
      if (nextIndex !== currentIndex) {
        event.preventDefault();
        event.stopPropagation();
      }

      wheelLock.current = true;
      moveBy(event.deltaY > 0 ? 1 : -1);
      window.setTimeout(() => {
        wheelLock.current = false;
      }, 560);
    }

    element.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, [activeRoomView, adjustSideWallZoom, isSideRoomView, moveBy]);


  function handleReturnHome() {
    resetSideWallZoom();
    setActiveRoomView("home");
  }

  return (
    <div className="bio-room" ref={sectionRef}>
      <BioRoomCanvas copy={copy} />
      {isSideRoomView ? (
        <button
          aria-label="Volver al centro de la Bio Room"
          className="bio-room-return"
          onClick={handleReturnHome}
          type="button"
        >
          <span aria-hidden="true">←</span>
          <span>Volver</span>
        </button>
      ) : null}
      <BioRoomControls controls={copy.roomControls} />
      <BioRoomMobilePanels copy={copy} />
      <BioGalleryOverlay />
    </div>
  );
}
