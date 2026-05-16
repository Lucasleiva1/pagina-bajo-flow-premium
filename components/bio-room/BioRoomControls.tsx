"use client";

import { motion } from "framer-motion";
import type { SiteCopy } from "@/data/site";
import { type BioRoomView, useBioRoomStore } from "@/lib/useBioRoomStore";

type BioRoomControlsProps = {
  controls: SiteCopy["bio"]["roomControls"];
};

export function BioRoomControls({ controls }: BioRoomControlsProps) {
  const activeRoomView = useBioRoomStore((state) => state.activeRoomView);
  const setActiveRoomView = useBioRoomStore((state) => state.setActiveRoomView);

  return (
    <nav className="bio-room-controls" aria-label="Bajo Flow Bio Room">
      {controls.map((control) => {
        const view = control.view as BioRoomView;
        const isActive = activeRoomView === view;

        return (
          <button
            aria-pressed={isActive}
            className={isActive ? "active" : ""}
            key={control.view}
            onClick={() => setActiveRoomView(view)}
            type="button"
          >
            {isActive ? <motion.span className="bio-room-control-glow" layoutId="bio-room-active-control" /> : null}
            <span>{control.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
