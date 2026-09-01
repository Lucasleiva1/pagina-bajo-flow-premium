import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import type { FooterRenderPreset } from "@/data/footerRenderPreset";

/**
 * Guarda los valores del panel del pie en data/footerRenderPreset.ts.
 * Mismo criterio que el guardado de la Sala Bio: solo funciona mientras se
 * trabaja en local, nunca en la pagina publicada.
 */
const rutaPreset = path.join(process.cwd(), "data", "footerRenderPreset.ts");

const BOOLEANOS = ["efectosActivos", "efectosEnCelular", "suavizado", "resplandor", "parallax"] as const;

const NUMEROS = [
  "resolucionInterna",
  "resplandorIntensidad",
  "resplandorUmbral",
  "resplandorRadio",
  "luzHaz",
  "luzLente",
  "luzApertura",
  "luzParpadeo",
  "polvoCantidad",
  "polvoVelocidad",
  "polvoTamano",
  "polvoBrillo",
  "cintaOpacidad",
  "cintaBalanceo",
] as const;

function esPreset(valor: unknown): valor is FooterRenderPreset {
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) return false;
  const dato = valor as Record<string, unknown>;
  return (
    BOOLEANOS.every((clave) => typeof dato[clave] === "boolean") &&
    NUMEROS.every((clave) => typeof dato[clave] === "number" && Number.isFinite(dato[clave]))
  );
}

function serializar(preset: FooterRenderPreset) {
  return `/**
 * VALORES GUARDADOS DEL RENDER DEL PIE.
 *
 * Este archivo lo reescribe el boton "Guardar" del panel de trabajo. Es el
 * puente entre mover deslizadores en el navegador y dejar el resultado fijo
 * en el proyecto: lo que se guarda aca es lo que ve cualquiera que abra la
 * pagina, con panel o sin panel.
 *
 * Cuando el diseno este cerrado se puede sacar el panel entero y estos
 * valores siguen mandando igual.
 */
export type FooterRenderPreset = {
${[...BOOLEANOS].map((clave) => `  ${clave}: boolean;`).join("\n")}
${[...NUMEROS].map((clave) => `  ${clave}: number;`).join("\n")}
};

export const footerRenderPreset: FooterRenderPreset = ${JSON.stringify(preset, null, 2)};
`;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "El guardado del render solo funciona en desarrollo." }, { status: 403 });
  }

  const cuerpo = await request.json().catch(() => null);

  if (!esPreset(cuerpo)) {
    return NextResponse.json({ error: "Valores de render invalidos." }, { status: 400 });
  }

  await writeFile(rutaPreset, serializar(cuerpo), "utf8");
  return NextResponse.json({ ok: true });
}
