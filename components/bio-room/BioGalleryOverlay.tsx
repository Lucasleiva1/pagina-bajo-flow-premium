"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useBioRoomStore } from "@/lib/useBioRoomStore";

export function BioGalleryOverlay() {
  const selectedGalleryItem = useBioRoomStore((state) => state.selectedGalleryItem);
  const isOverlayOpen = useBioRoomStore((state) => state.isOverlayOpen);
  const closeGalleryOverlay = useBioRoomStore((state) => state.closeGalleryOverlay);

  return (
    <AnimatePresence>
      {isOverlayOpen && selectedGalleryItem ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="bio-room-overlay"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={selectedGalleryItem.title}
        >
          <button className="bio-room-overlay-backdrop" onClick={closeGalleryOverlay} type="button" aria-label="Cerrar galería" />
          <motion.article
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bio-room-overlay-card"
            exit={{ opacity: 0, scale: 0.98, y: 18 }}
            initial={{ opacity: 0, scale: 0.98, y: 18 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <button className="bio-room-overlay-close" onClick={closeGalleryOverlay} type="button">
              Cerrar
            </button>
            <div className="bio-room-overlay-image">
              <Image alt={selectedGalleryItem.title} fill priority sizes="min(86vw, 920px)" src={selectedGalleryItem.image} />
            </div>
            <div className="bio-room-overlay-copy">
              <p>{selectedGalleryItem.category}</p>
              <h3>{selectedGalleryItem.title}</h3>
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
