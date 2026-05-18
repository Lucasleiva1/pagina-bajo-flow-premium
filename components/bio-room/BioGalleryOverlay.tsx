"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBioRoomStore } from "@/lib/useBioRoomStore";

function getPosterUrl(videoId: string, poster?: string) {
  return poster ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function BioGalleryOverlay() {
  const selectedGalleryItem = useBioRoomStore((state) => state.selectedGalleryItem);
  const isOverlayOpen = useBioRoomStore((state) => state.isOverlayOpen);
  const closeGalleryOverlay = useBioRoomStore((state) => state.closeGalleryOverlay);
  const [isPlayerActive, setIsPlayerActive] = useState(false);

  useEffect(() => {
    setIsPlayerActive(false);
  }, [selectedGalleryItem?.title]);

  return (
    <AnimatePresence>
      {isOverlayOpen && selectedGalleryItem ? (
        <motion.div
          animate={{ opacity: 1 }}
          aria-label={selectedGalleryItem.title}
          aria-modal="true"
          className="bio-room-overlay"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          role="dialog"
        >
          <button className="bio-room-overlay-backdrop" onClick={closeGalleryOverlay} type="button" aria-label="Cerrar habilidades" />
          <motion.article
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`bio-room-overlay-card ${selectedGalleryItem.videoId ? "bio-room-overlay-card-video" : ""}`}
            exit={{ opacity: 0, scale: 0.98, y: 18 }}
            initial={{ opacity: 0, scale: 0.98, y: 18 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <button className="bio-room-overlay-close" onClick={closeGalleryOverlay} type="button">
              Cerrar
            </button>
            {selectedGalleryItem.videoId && isPlayerActive ? (
              <div className="bio-room-overlay-video">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  src={`https://www.youtube.com/embed/${selectedGalleryItem.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={selectedGalleryItem.videoTitle}
                />
              </div>
            ) : selectedGalleryItem.videoId ? (
              <button
                className="bio-room-overlay-video bio-room-overlay-video-poster"
                onClick={() => setIsPlayerActive(true)}
                type="button"
              >
                <img alt="" src={getPosterUrl(selectedGalleryItem.videoId, selectedGalleryItem.poster)} />
                <span>Reproducir video</span>
              </button>
            ) : (
              <div className="bio-room-overlay-no-video" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            )}
            <div className="bio-room-overlay-copy">
              <p>{selectedGalleryItem.videoId ? "Video técnico" : "Habilidad técnica"}</p>
              <h3>{selectedGalleryItem.title}</h3>
              <span>{selectedGalleryItem.description}</span>
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
