"use client";

import { create } from "zustand";
import type { SiteCopy } from "@/data/site";

export type BioRoomView = "home" | "bio" | "gallery" | "contact";
export type BioGalleryItem = SiteCopy["bio"]["galleryItems"][number];

type BioRoomState = {
  activeRoomView: BioRoomView;
  selectedGalleryItem: BioGalleryItem | null;
  isOverlayOpen: boolean;
  setActiveRoomView: (view: BioRoomView) => void;
  openGalleryItem: (item: BioGalleryItem) => void;
  closeGalleryOverlay: () => void;
};

export const useBioRoomStore = create<BioRoomState>((set) => ({
  activeRoomView: "home",
  selectedGalleryItem: null,
  isOverlayOpen: false,
  setActiveRoomView: (view) => set({ activeRoomView: view }),
  openGalleryItem: (item) => set({ isOverlayOpen: true, selectedGalleryItem: item }),
  closeGalleryOverlay: () => set({ isOverlayOpen: false, selectedGalleryItem: null }),
}));
