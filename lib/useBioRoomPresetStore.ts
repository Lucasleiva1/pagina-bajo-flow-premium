"use client";

import { create } from "zustand";
import {
  bioRoomPreset,
  type BioRoomPreset,
} from "@/data/bioRoomPreset";

type BioRoomPresetState = {
  preset: BioRoomPreset;
  isSaving: boolean;
  lastSavedAt: string | null;
  error: string | null;
  setSection: <TSection extends keyof BioRoomPreset>(
    section: TSection,
    values: BioRoomPreset[TSection],
  ) => void;
  savePreset: () => Promise<boolean>;
};

export const useBioRoomPresetStore = create<BioRoomPresetState>((set, get) => ({
  preset: bioRoomPreset,
  isSaving: false,
  lastSavedAt: null,
  error: null,
  setSection: (section, values) =>
    set((state) => ({
      preset: {
        ...state.preset,
        [section]: values,
      },
    })),
  savePreset: async () => {
    set({ error: null, isSaving: true });

    try {
      const response = await fetch("/api/bio-room/preset", {
        body: JSON.stringify(get().preset),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "No se pudo guardar el preset 3D.");
      }

      set({
        isSaving: false,
        lastSavedAt: new Date().toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "No se pudo guardar.",
        isSaving: false,
      });
      return false;
    }
  },
}));
