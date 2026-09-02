/**
 * VALORES GUARDADOS DEL RENDER DE LA SALA BIO.
 *
 * Solo lo GRAFICO: nitidez de bordes y cuanta luz da cada foco. Las
 * posiciones de los objetos y de las luces siguen viviendo en
 * bioRoomPreset.ts, que maneja el otro panel y no se toca desde aca.
 *
 * Este archivo lo reescribe el boton "Guardar" del panel de la sala.
 */
export type BioRenderPreset = {
  /** Cuantos pixeles se dibujan por cada pixel de pantalla. El antialias. */
  resolucionInterna: number;
  /** Multiplicadores sobre la intensidad que ya tiene cada luz. 1 = como esta. */
  luzGeneral: number;
  luzAmbiente: number;
  luzPrincipal: number;
  luzContorno: number;
  luzFria: number;
  luzRelleno: number;
  lucesDeSala: number;
  /** 1 = la niebla original. Mas alto la aleja y despeja el fondo. */
  alcanceNiebla: number;
};

export const bioRenderPreset: BioRenderPreset = {
  "resolucionInterna": 2,
  "luzGeneral": 0.92,
  "luzAmbiente": 1.03,
  "luzPrincipal": 1.22,
  "luzContorno": 1.67,
  "luzFria": 1.22,
  "luzRelleno": 1.3,
  "lucesDeSala": 0.47,
  "alcanceNiebla": 1.3
};
