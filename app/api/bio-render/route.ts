import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import type { BioRenderPreset } from "@/data/bioRenderPreset";

/**
 * Guarda los valores GRAFICOS de la Sala Bio en data/bioRenderPreset.ts.
 * Solo funciona mientras se trabaja en local, nunca en la pagina publicada.
 * No toca bioRoomPreset.ts, que es el de posiciones.
 */
const rutaPreset = path.join(process.cwd(), "data", "bioRenderPreset.ts");

const CLAVES = [
  "resolucionInterna",
  "luzGeneral",
  "luzAmbiente",
  "luzPrincipal",
  "luzContorno",
  "luzFria",
  "luzRelleno",
  "lucesDeSala",
  "alcanceNiebla",
] as const;

function esPreset(valor: unknown): valor is BioRenderPreset {
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) return false;
  const dato = valor as Record<string, unknown>;
  return CLAVES.every((clave) => typeof dato[clave] === "number" && Number.isFinite(dato[clave]));
}

function serializar(preset: BioRenderPreset) {
  return `/**
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

export const bioRenderPreset: BioRenderPreset = ${JSON.stringify(preset, null, 2)};
`;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "El guardado solo funciona en desarrollo." }, { status: 403 });
  }

  const cuerpo = await request.json().catch(() => null);

  if (!esPreset(cuerpo)) {
    return NextResponse.json({ error: "Valores de render invalidos." }, { status: 400 });
  }

  await writeFile(rutaPreset, serializar(cuerpo), "utf8");
  return NextResponse.json({ ok: true });
}
