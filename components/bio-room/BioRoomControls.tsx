"use client";

import { motion } from "framer-motion";
import type { SiteCopy } from "@/data/site";
import { type BioRoomView, useBioRoomStore } from "@/lib/useBioRoomStore";
import { playHoverTick, playClickTick } from "@/lib/soundEffects";

type BioRoomControlsProps = {
  controls: SiteCopy["bio"]["roomControls"];
};

export function BioRoomControls({ controls }: BioRoomControlsProps) {
  const activeRoomView = useBioRoomStore((state) => state.activeRoomView);
  const setActiveRoomView = useBioRoomStore((state) => state.setActiveRoomView);
  const homeControl = controls.find((control) => control.view === "home") ?? {
    label: "Inicio",
    view: "home",
  };

  const variants = {
    hidden: {
      opacity: 0,
      y: 40,
      x: "-50%",
      scale: 0.95,
      transition: {
        duration: 0.25,
        ease: "easeIn",
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      x: "-50%",
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  } as const;

  return (
    <motion.nav
      className="bio-room-controls"
      aria-label="Bajo Flow Bio Room"
      initial="hidden"
      animate={activeRoomView !== "home" ? "visible" : "hidden"}
      variants={variants}
      style={{
        pointerEvents: activeRoomView !== "home" ? "auto" : "none",
      }}
    >
      <button
        aria-label={homeControl.label}
        onClick={() => {
          playClickTick();
          setActiveRoomView(homeControl.view as BioRoomView);
        }}
        onMouseEnter={() => playHoverTick()}
        type="button"
      >
        <span>{homeControl.label}</span>
      </button>
    </motion.nav>
  );
}
