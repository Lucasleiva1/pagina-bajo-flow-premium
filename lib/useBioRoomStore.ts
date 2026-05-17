"use client";

import { create } from "zustand";
import type { SiteCopy } from "@/data/site";

export type BioRoomView = "home" | "bio" | "gallery" | "contact";
export type BioGalleryItem = SiteCopy["bio"]["galleryItems"][number];

type BioRoomState = {
  activeRoomView: BioRoomView;
  selectedGalleryItem: BioGalleryItem | null;
  isOverlayOpen: boolean;
  sideWallZoom: number;
  adjustSideWallZoom: (delta: number) => void;
  resetSideWallZoom: () => void;
  setActiveRoomView: (view: BioRoomView) => void;
  openGalleryItem: (item: BioGalleryItem) => void;
  closeGalleryOverlay: () => void;
};

const minSideWallZoom = -0.22;
const maxSideWallZoom = 0.1;

function clampSideWallZoom(value: number) {
  return Math.max(minSideWallZoom, Math.min(maxSideWallZoom, value));
}

export const useBioRoomStore = create<BioRoomState>((set) => ({
  activeRoomView: "home",
  selectedGalleryItem: null,
  isOverlayOpen: false,
  sideWallZoom: 0,
  adjustSideWallZoom: (delta) => set((state) => ({ sideWallZoom: clampSideWallZoom(state.sideWallZoom + delta) })),
  resetSideWallZoom: () => set({ sideWallZoom: 0 }),
  setActiveRoomView: (view) => set({ activeRoomView: view }),
  openGalleryItem: (item) => set({ isOverlayOpen: true, selectedGalleryItem: item }),
  closeGalleryOverlay: () => set({ isOverlayOpen: false, selectedGalleryItem: null }),
}));
