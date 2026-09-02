"use client";

import { create } from "zustand";
import { bioRenderPreset, type BioRenderPreset } from "@/data/bioRenderPreset";

/* ===================================================================
   CENTRO DE CONTROL GRAFICO DE LA SALA BIO

   Igual que el del pie: unica fuente de verdad, la escena lee de aca y
   el panel escribe aca. No se mezcla con bioRoomPreset, que es el que
   maneja posiciones y el panel de movimiento de la sala.
   =================================================================== */

export type BioRenderConfig = BioRenderPreset;

export const BIO_CONFIG_ORIGINAL: BioRenderConfig = { ...bioRenderPreset };

type BioRenderStore = BioRenderConfig & {
  guardando: boolean;
  guardadoEn: string | null;
  errorGuardado: string | null;
  set<K extends keyof BioRenderConfig>(clave: K, valor: BioRenderConfig[K]): void;
  aplicar(parcial: Partial<BioRenderConfig>): void;
  restaurarOriginal(): void;
  guardar(): Promise<void>;
};

export const useBioRenderStore = create<BioRenderStore>((set) => ({
  ...BIO_CONFIG_ORIGINAL,
  guardando: false,
  guardadoEn: null,
  errorGuardado: null,

  set: (clave, valor) =>
    set((estado) => (estado[clave] === valor ? estado : ({ [clave]: valor } as Partial<BioRenderStore>))),

  aplicar: (parcial) => set(() => ({ ...parcial })),

  restaurarOriginal: () => set(() => ({ ...BIO_CONFIG_ORIGINAL })),

  guardar: async () => {
    set({ guardando: true, errorGuardado: null });
    try {
      const a = useBioRenderStore.getState();
      const valores: BioRenderPreset = {
        resolucionInterna: a.resolucionInterna,
        luzGeneral: a.luzGeneral,
        luzAmbiente: a.luzAmbiente,
        luzPrincipal: a.luzPrincipal,
        luzContorno: a.luzContorno,
        luzFria: a.luzFria,
        luzRelleno: a.luzRelleno,
        lucesDeSala: a.lucesDeSala,
        alcanceNiebla: a.alcanceNiebla,
      };

      const respuesta = await fetch("/api/bio-render", {
        body: JSON.stringify(valores),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!respuesta.ok) {
        const detalle = await respuesta.json().catch(() => null);
        throw new Error(detalle?.error ?? "No se pudo guardar.");
      }

      set({
        guardando: false,
        guardadoEn: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      });
    } catch (error) {
      set({ guardando: false, errorGuardado: error instanceof Error ? error.message : "No se pudo guardar." });
    }
  },
}));

/** Manejo desde codigo o desde la consola. Se publica en window.bajoFlowBio. */
export const RenderBio = {
  estado: () => useBioRenderStore.getState(),
  original: () => useBioRenderStore.getState().restaurarOriginal(),
  set: <K extends keyof BioRenderConfig>(clave: K, valor: BioRenderConfig[K]) =>
    useBioRenderStore.getState().set(clave, valor),
  aplicar: (parcial: Partial<BioRenderConfig>) => useBioRenderStore.getState().aplicar(parcial),
  guardar: () => useBioRenderStore.getState().guardar(),
};
