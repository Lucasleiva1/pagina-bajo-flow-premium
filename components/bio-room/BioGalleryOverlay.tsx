"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useBioRoomStore } from "@/lib/useBioRoomStore";
import { ResponsivePicture } from "@/components/ui/ResponsivePicture";

const galleryOverlayWidths = [480, 768, 960] as const;

function getGalleryBasePath(src: string) {
  return src.replace("/assets/bio-room/", "/images/bio-room/").replace(/\.(png|jpe?g)$/i, "");
}

function getGalleryFallbackPath(src: string) {
  return `${getGalleryBasePath(src)}-960.webp`;
}

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
              <ResponsivePicture
                alt={selectedGalleryItem.title}
                basePath={getGalleryBasePath(selectedGalleryItem.image)}
                className="responsive-picture"
                fallbackSrc={getGalleryFallbackPath(selectedGalleryItem.image)}
                loading="eager"
                sizes="min(86vw, 920px)"
                widths={galleryOverlayWidths}
              />
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
