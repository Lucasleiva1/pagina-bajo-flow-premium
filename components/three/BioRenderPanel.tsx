"use client";

import { useCallback } from "react";
import { PanelFlotante, type GrupoPanel } from "@/components/three/PanelFlotante";
import { RenderBio, useBioRenderStore, type BioRenderConfig } from "@/lib/useBioRenderStore";

/* ===================================================================
   PANEL GRAFICO DE LA SALA BIO

   Aparte y sin relacion con el panel de movimiento que ya tiene la sala:
   ese sigue manejando posiciones y no se toca. Este es solo imagen —
   nitidez de bordes y cuanta luz da cada foco.
   =================================================================== */

const GRUPOS: GrupoPanel[] = [
  {
    titulo: "SUAVIZADO DE BORDES",
    abierto: true,
    controles: [
      {
        clave: "resolucionInterna",
        id: "calidadBordes",
        tipo: "lista",
        label: "Calidad",
        hint: "Dibuja la sala más grande y la reduce. Es lo que saca el escalonado de los bordes, los marcos y las letras.",
        opciones: {
          "Sin suavizado (1x)": 1,
          "Medio (1,5x)": 1.5,
          "Alto (2x) — recomendado": 2,
          "Máximo (3x) — pesado": 3,
        },
      },
      {
        clave: "resolucionInterna",
        tipo: "rango",
        label: "Ajuste fino",
        hint: "El mismo valor, para moverlo de a poco. Más alto se ve más nítido y consume más placa de video.",
        min: 0.75,
        max: 3,
        step: 0.05,
      },
    ],
  },
  {
    titulo: "LUZ",
    abierto: true,
    controles: [
      {
        clave: "luzGeneral",
        tipo: "rango",
        label: "Luz general",
        hint: "Sube o baja TODAS las luces de la sala a la vez, manteniendo la proporción entre ellas.",
        min: 0,
        max: 3,
        step: 0.01,
      },
      {
        clave: "luzAmbiente",
        tipo: "rango",
        label: "Ambiente",
        hint: "La luz base que llega parejo a todos lados. Bajarla oscurece las sombras.",
        min: 0,
        max: 3,
        step: 0.01,
      },
      {
        clave: "luzPrincipal",
        tipo: "rango",
        label: "Principal (cenital)",
        hint: "El foco cálido de arriba, el que más define la figura.",
        min: 0,
        max: 3,
        step: 0.01,
      },
      {
        clave: "luzContorno",
        tipo: "rango",
        label: "Contorno",
        hint: "La luz de atrás que recorta la silueta y la despega del fondo.",
        min: 0,
        max: 3,
        step: 0.01,
      },
      {
        clave: "luzFria",
        tipo: "rango",
        label: "Acento frío",
        hint: "El azul que entra desde la derecha.",
        min: 0,
        max: 3,
        step: 0.01,
      },
      {
        clave: "luzRelleno",
        tipo: "rango",
        label: "Relleno frontal",
        hint: "Aclara la cara y el frente. Bajarlo da más contraste.",
        min: 0,
        max: 3,
        step: 0.01,
      },
    ],
  },
  {
    titulo: "AMBIENTE DE SALA",
    abierto: false,
    controles: [
      {
        clave: "lucesDeSala",
        tipo: "rango",
        label: "Luces de pared y piso",
        hint: "Los baños de luz sobre las paredes y el rebote del piso. Es lo que da la atmósfera de sala de cine.",
        min: 0,
        max: 3,
        step: 0.01,
      },
      {
        clave: "alcanceNiebla",
        tipo: "rango",
        label: "Alcance de la niebla",
        hint: "1 es la niebla original. Más alto la aleja y despeja el fondo; más bajo cierra la sala.",
        min: 0.3,
        max: 3,
        step: 0.01,
      },
    ],
  },
];

export function BioRenderPanel() {
  const escribir = useBioRenderStore((estado) => estado.set);
  const guardar = useBioRenderStore((estado) => estado.guardar);
  const guardando = useBioRenderStore((estado) => estado.guardando);
  const guardadoEn = useBioRenderStore((estado) => estado.guardadoEn);
  const errorGuardado = useBioRenderStore((estado) => estado.errorGuardado);

  const leerEstado = useCallback(() => useBioRenderStore.getState() as Record<string, unknown>, []);

  const escribirValor = useCallback(
    (clave: string, valor: number | boolean) =>
      escribir(clave as keyof BioRenderConfig, valor as BioRenderConfig[keyof BioRenderConfig]),
    [escribir],
  );

  const suscribir = useCallback(
    (oyente: (estado: Record<string, unknown>, anterior: Record<string, unknown>) => void) =>
      useBioRenderStore.subscribe(oyente),
    [],
  );

  return (
    <PanelFlotante
      escribir={escribirValor}
      grupos={GRUPOS}
      guardado={{ guardar, guardando, guardadoEn, error: errorGuardado }}
      leerEstado={leerEstado}
      presets={{ "Restaurar original": () => RenderBio.original() }}
      suscribir={suscribir}
      titulo="Imagen de la sala"
    />
  );
}
