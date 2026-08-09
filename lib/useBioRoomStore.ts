"use client";

import { create } from "zustand";
import type { SiteCopy } from "@/data/site";

export type BioRoomView = "home" | "bio" | "gallery" | "contact";
export type BioGalleryItem = SiteCopy["bio"]["skillItems"][number];

type BioRoomState = {
  activeRoomView: BioRoomView;
  selectedGalleryItem: BioGalleryItem | null;
  isOverlayOpen: boolean;
  isBioLevaDisabled: boolean;
  mobileWallPan: number;
  sideWallZoom: number;
  isSoundEnabled: boolean;
  adjustSideWallZoom: (delta: number) => void;
  resetSideWallZoom: () => void;
  setMobileWallPan: (value: number) => void;
  setActiveRoomView: (view: BioRoomView) => void;
  toggleBioLevaDisabled: () => void;
  openGalleryItem: (item: BioGalleryItem) => void;
  closeGalleryOverlay: () => void;
  toggleSoundEnabled: () => void;
};

const minSideWallZoom = -0.22;
const maxSideWallZoom = 0.1;
const minMobileWallPan = -1;
const maxMobileWallPan = 1;

function clampSideWallZoom(value: number) {
  return Math.max(minSideWallZoom, Math.min(maxSideWallZoom, value));
}

function clampMobileWallPan(value: number) {
  return Math.max(minMobileWallPan, Math.min(maxMobileWallPan, value));
}

export const useBioRoomStore = create<BioRoomState>((set) => ({
  activeRoomView: "home",
  selectedGalleryItem: null,
  isOverlayOpen: false,
  isBioLevaDisabled: false,
  mobileWallPan: 0,
  sideWallZoom: 0,
  isSoundEnabled: true,
  adjustSideWallZoom: (delta) => set((state) => ({ sideWallZoom: clampSideWallZoom(state.sideWallZoom + delta) })),
  resetSideWallZoom: () => set({ sideWallZoom: 0 }),
  setMobileWallPan: (value) => set({ mobileWallPan: clampMobileWallPan(value) }),
  setActiveRoomView: (view) => set({ activeRoomView: view, mobileWallPan: 0 }),
  toggleBioLevaDisabled: () => set((state) => ({ isBioLevaDisabled: !state.isBioLevaDisabled })),
  openGalleryItem: (item) => set({ isOverlayOpen: true, selectedGalleryItem: item }),
  closeGalleryOverlay: () => set({ isOverlayOpen: false, selectedGalleryItem: null }),
  toggleSoundEnabled: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
}));
