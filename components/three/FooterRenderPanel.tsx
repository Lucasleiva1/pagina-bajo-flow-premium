"use client";

import { useCallback } from "react";
import { PanelFlotante, type GrupoPanel } from "@/components/three/PanelFlotante";
import { RenderPie, useFooterRenderStore, type FooterRenderConfig } from "@/lib/useFooterRenderStore";

/* ===================================================================
   PANEL GRAFICO DEL PIE DE PAGINA

   Solo declara QUE controles hay y como se llaman. Toda la mecanica
   (arrastre, plegado, rueda, guardado, sincronizacion con el centro de
   control) vive en PanelFlotante, compartida con el panel de la sala.
   =================================================================== */

const GRUPOS: GrupoPanel[] = [
  {
    titulo: "SUAVIZADO DE BORDES",
    abierto: false,
    controles: [
      {
        clave: "resolucionInterna",
        id: "calidadBordes",
        tipo: "lista",
        label: "Calidad",
        hint: "Dibuja la escena más grande y la reduce. Es lo que saca el escalonado de las diagonales, los contornos curvos y las perforaciones de la cinta.",
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
    titulo: "LUZ DEL PROYECTOR",
    abierto: false,
    controles: [
      {
        clave: "luzHaz",
        tipo: "rango",
        label: "Luz del haz",
        hint: "Brillo del rayo que sale hacia afuera. No toca la lente. Arriba de 1,5 casi no cambia: la luz se suma y llega al tope del monitor.",
        min: 0,
        max: 2,
        step: 0.01,
      },
      {
        clave: "luzLente",
        tipo: "rango",
        label: "Luz de la lente",
        hint: "Brillo del círculo de la boca del proyector, independiente del haz. Se nota sobre todo bajándolo.",
        min: 0,
        max: 2,
        step: 0.01,
      },
      {
        clave: "luzApertura",
        tipo: "rango",
        label: "Apertura del haz",
        hint: "Qué tan ancho se abre el cono de luz. El polvo acompaña la apertura.",
        min: 0.3,
        max: 2.5,
        step: 0.01,
      },
      {
        clave: "luzParpadeo",
        tipo: "rango",
        label: "Parpadeo",
        hint: "0 deja la luz fija. 1 es la respiración original de la lámpara.",
        min: 0,
        max: 3,
        step: 0.01,
      },
    ],
  },
  {
    titulo: "POLVO",
    abierto: false,
    controles: [
      {
        clave: "polvoCantidad",
        tipo: "rango",
        label: "Cantidad",
        hint: "Cuántas motas hay en el aire. 1 son 420 en computadora y 90 en celular.",
        min: 0,
        max: 2.5,
        step: 0.05,
      },
      {
        clave: "polvoVelocidad",
        tipo: "rango",
        label: "Velocidad al flotar",
        hint: "0 deja el polvo suspendido y quieto. 1 es como sube ahora. 4 es cuatro veces más rápido.",
        min: 0,
        max: 4,
        step: 0.01,
      },
      {
        clave: "polvoTamano",
        tipo: "rango",
        label: "Tamaño",
        hint: "Tamaño de cada mota en pantalla.",
        min: 0.3,
        max: 3,
        step: 0.01,
      },
      {
        clave: "polvoBrillo",
        tipo: "rango",
        label: "Brillo",
        hint: "Cuánto se encienden las motas al cruzar el haz.",
        min: 0,
        max: 2.5,
        step: 0.01,
      },
    ],
  },
  {
    titulo: "CINTA DE PELÍCULA",
    abierto: false,
    controles: [
      {
        clave: "cintaOpacidad",
        tipo: "rango",
        label: "Presencia",
        hint: "Cuánto se ve la cinta. 0 la esconde del todo en la oscuridad.",
        min: 0,
        max: 2,
        step: 0.01,
      },
      {
        clave: "cintaBalanceo",
        tipo: "rango",
        label: "Balanceo",
        hint: "0 la deja quieta. 1 es la oscilación original.",
        min: 0,
        max: 4,
        step: 0.01,
      },
    ],
  },
  {
    titulo: "MOVIMIENTO",
    abierto: false,
    controles: [
      {
        clave: "parallax",
        tipo: "interruptor",
        label: "Parallax con el mouse",
        hint: "La cámara acompaña muy levemente al puntero. Siempre apagado en celular.",
      },
    ],
  },
  {
    // Todo lo que depende del postprocesado vive aca, separado y avisado.
    // Se deja cableado para el dia que se resuelva el aclarado del haz.
    titulo: "EXPERIMENTAL — NO USAR TODAVÍA",
    abierto: false,
    controles: [
      {
        clave: "efectosActivos",
        tipo: "interruptor",
        label: "Postprocesado",
        hint: "PROBLEMA CONOCIDO: al encenderlo el haz se aclara casi al doble. Sin resolver. Los cuatro controles de abajo dependen de este.",
      },
      {
        clave: "efectosEnCelular",
        tipo: "interruptor",
        label: "También en celular",
        hint: "Solo hace algo si el postprocesado está encendido Y estás en un celular.",
      },
      {
        clave: "suavizado",
        tipo: "interruptor",
        label: "SMAA",
        hint: "Otro suavizado, por postprocesado. Necesita el postprocesado encendido y hereda su problema. El de arriba anda mejor y cuesta menos.",
      },
      {
        clave: "resplandor",
        tipo: "interruptor",
        label: "Resplandor",
        hint: "Halo alrededor de la lente y el haz. Necesita el postprocesado encendido.",
      },
      {
        clave: "resplandorIntensidad",
        tipo: "rango",
        label: "Resplandor: intensidad",
        hint: "Cuánta luz derrama. Solo hace algo con el resplandor encendido.",
        min: 0,
        max: 1.5,
        step: 0.01,
      },
      {
        clave: "resplandorUmbral",
        tipo: "rango",
        label: "Resplandor: umbral",
        hint: "Qué tan brillante tiene que ser algo para resplandecer. Solo hace algo con el resplandor encendido.",
        min: 0,
        max: 1,
        step: 0.01,
      },
      {
        clave: "resplandorRadio",
        tipo: "rango",
        label: "Resplandor: radio",
        hint: "Hasta dónde se extiende el halo. Solo hace algo con el resplandor encendido.",
        min: 0.1,
        max: 1,
        step: 0.01,
      },
    ],
  },
];

export function FooterRenderPanel() {
  const escribir = useFooterRenderStore((estado) => estado.set);
  const guardar = useFooterRenderStore((estado) => estado.guardar);
  const guardando = useFooterRenderStore((estado) => estado.guardando);
  const guardadoEn = useFooterRenderStore((estado) => estado.guardadoEn);
  const errorGuardado = useFooterRenderStore((estado) => estado.errorGuardado);

  const leerEstado = useCallback(() => useFooterRenderStore.getState() as Record<string, unknown>, []);

  const escribirValor = useCallback(
    (clave: string, valor: number | boolean) =>
      escribir(clave as keyof FooterRenderConfig, valor as FooterRenderConfig[keyof FooterRenderConfig]),
    [escribir],
  );

  const suscribir = useCallback(
    (oyente: (estado: Record<string, unknown>, anterior: Record<string, unknown>) => void) =>
      useFooterRenderStore.subscribe(oyente),
    [],
  );

  // La consola del navegador y cualquier codigo del proyecto manejan lo mismo.
  return (
    <PanelFlotante
      escribir={escribirValor}
      grupos={GRUPOS}
      guardado={{ guardar, guardando, guardadoEn, error: errorGuardado }}
      leerEstado={leerEstado}
      presets={{
        "Modo trabajo": () => RenderPie.trabajo(),
        "Modo final": () => RenderPie.final(),
        "Restaurar original": () => RenderPie.original(),
      }}
      suscribir={suscribir}
      titulo="Render del pie"
    />
  );
}
