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
  const isSoundEnabled = useBioRoomStore((state) => state.isSoundEnabled);
  const toggleSoundEnabled = useBioRoomStore((state) => state.toggleSoundEnabled);

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
            onClick={() => {
              playClickTick();
              setActiveRoomView(view);
            }}
            onMouseEnter={() => playHoverTick()}
            type="button"
          >
            {isActive ? <motion.span className="bio-room-control-glow" layoutId="bio-room-active-control" /> : null}
            <span>{control.label}</span>
          </button>
        );
      })}

      <button
        aria-label={isSoundEnabled ? "Silenciar sonido" : "Activar sonido"}
        className="bio-room-sound-toggle"
        onClick={() => {
          playClickTick();
          toggleSoundEnabled();
        }}
        onMouseEnter={() => playHoverTick()}
        type="button"
      >
        <span>
          {isSoundEnabled ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="bio-room-sound-icon"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="bio-room-sound-icon"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </span>
      </button>
    </nav>
  );
}

