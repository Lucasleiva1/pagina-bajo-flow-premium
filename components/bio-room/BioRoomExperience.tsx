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
  const setActiveRoomView = useBioRoomStore((state) => state.setActiveRoomView);

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

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (window.matchMedia("(max-width: 860px)").matches) return;
    if (Math.abs(event.deltaY) < 28 || wheelLock.current) return;

    wheelLock.current = true;
    moveBy(event.deltaY > 0 ? 1 : -1);
    window.setTimeout(() => {
      wheelLock.current = false;
    }, 560);
  }

  return (
    <div className="bio-room" onWheel={handleWheel} ref={sectionRef}>
      <BioRoomCanvas copy={copy} />
      <BioRoomControls controls={copy.roomControls} />
      <BioRoomMobilePanels copy={copy} />
      <BioGalleryOverlay />
    </div>
  );
}
