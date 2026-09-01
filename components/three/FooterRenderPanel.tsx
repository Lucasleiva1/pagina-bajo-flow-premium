"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { LevaPanel, useControls, useCreateStore, folder, button } from "leva";
import { MathUtils } from "three";
import { RenderPie, useFooterRenderStore, type FooterRenderConfig } from "@/lib/useFooterRenderStore";

/* ===================================================================
   PANEL DE CONTROL DEL PIE DE PAGINA

   Leva es SOLO la interfaz. No guarda nada: cada control escribe en
   useFooterRenderStore, que es la unica fuente de verdad. Y al reves, si
   el estado cambia desde afuera (un preset, la consola, otra IA), este
   panel empuja el valor nuevo a Leva y los deslizadores se mueven solos.

   Las carpetas se declaran UNA sola vez, en GRUPOS. De ahi salen tanto el
   esquema que ve Leva como las rutas que hacen falta para sincronizar. Si
   manana se agrega un control, se agrega en un unico lugar.

   El panel usa su propio almacen (useCreateStore) para no pelear con el
   panel de la sala Bio, que usa el global de Leva.
   =================================================================== */

/**
 * Cuando mostrarlo.
 *   NEXT_PUBLIC_PANEL_RENDER=false  -> nunca, ni en desarrollo
 *   NEXT_PUBLIC_PANEL_RENDER=true   -> siempre, tambien en la pagina publicada
 *   sin definir                      -> solo mientras se trabaja en local
 */
const forzado = process.env.NEXT_PUBLIC_PANEL_RENDER;
export const PANEL_RENDER_HABILITADO =
  forzado === "true" ? true : forzado === "false" ? false : process.env.NODE_ENV === "development";

type ClaveBool = {
  [K in keyof FooterRenderConfig]: FooterRenderConfig[K] extends boolean ? K : never;
}[keyof FooterRenderConfig];

type ClaveNum = {
  [K in keyof FooterRenderConfig]: FooterRenderConfig[K] extends number ? K : never;
}[keyof FooterRenderConfig];

type Control =
  | { clave: ClaveBool; tipo: "interruptor"; label: string; hint: string }
  | { clave: ClaveNum; tipo: "rango"; label: string; hint: string; min: number; max: number; step: number };

type Grupo = { titulo: string; abierto: boolean; controles: Control[] };

/** Leva no exporta su tipo Schema, asi que se toma del propio folder(). */
type EsquemaLeva = Parameters<typeof folder>[0];

/** Todo el panel, ordenado por categorias. Cada cosa en su lugar. */
const GRUPOS: Grupo[] = [
  {
    titulo: "POSTPROCESADO",
    abierto: false,
    controles: [
      {
        clave: "efectosActivos",
        tipo: "interruptor",
        label: "Efectos activos",
        hint: "Interruptor maestro del postprocesado. OJO: hoy aclara el haz casi al doble, es un problema sin resolver. Para nitidez usá Resolución interna.",
      },
      {
        clave: "efectosEnCelular",
        tipo: "interruptor",
        label: "También en celular",
        hint: "Apagado, el celular se ahorra el postprocesado y va más liviano.",
      },
      {
        clave: "suavizado",
        tipo: "interruptor",
        label: "Suavizado de bordes",
        hint: "Quita el escalonado de las diagonales y de los contornos curvos.",
      },
      {
        clave: "resolucionInterna",
        tipo: "rango",
        label: "Resolución interna",
        hint: "El antialias de verdad: dibuja más grande y reduce, y eso saca el escalonado de todo. 2 es el equilibrio.",
        min: 0.75,
        max: 3,
        step: 0.05,
      },
    ],
  },
  {
    titulo: "RESPLANDOR",
    abierto: false,
    controles: [
      {
        clave: "resplandor",
        tipo: "interruptor",
        label: "Resplandor",
        hint: "Crea un halo suave alrededor de las zonas muy luminosas: la lente y el haz.",
      },
      {
        clave: "resplandorIntensidad",
        tipo: "rango",
        label: "Intensidad",
        hint: "Cuánta luz derrama. Por encima de 0,6 empieza a verse como mancha.",
        min: 0,
        max: 1.5,
        step: 0.01,
      },
      {
        clave: "resplandorUmbral",
        tipo: "rango",
        label: "Umbral",
        hint: "Qué tan brillante tiene que ser algo para resplandecer. Alto = solo lo más luminoso.",
        min: 0,
        max: 1,
        step: 0.01,
      },
      {
        clave: "resplandorRadio",
        tipo: "rango",
        label: "Radio",
        hint: "Hasta dónde se extiende el halo.",
        min: 0.1,
        max: 1,
        step: 0.01,
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
];

/** Ruta de Leva de cada control: "CARPETA.clave". Sale de GRUPOS, no a mano. */
const RUTAS = GRUPOS.reduce<Partial<Record<keyof FooterRenderConfig, string>>>((mapa, grupo) => {
  for (const control of grupo.controles) mapa[control.clave] = `${grupo.titulo}.${control.clave}`;
  return mapa;
}, {});

export function FooterRenderPanel() {
  const store = useCreateStore();
  const escribir = useFooterRenderStore((estado) => estado.set);

  // El esquema se arma una sola vez, con los valores del momento de montar.
  // De ahi en mas el estado va y viene por los dos caminos de abajo.
  const esquema = useMemo(() => {
    const inicial = useFooterRenderStore.getState();
    const salida: EsquemaLeva = {};

    for (const grupo of GRUPOS) {
      const campos: EsquemaLeva = {};

      for (const control of grupo.controles) {
        // Camino de ida: el panel escribe en el centro de control. Si el valor
        // ya era ese (porque el cambio vino de afuera), el centro de control
        // corta solo y no se arma un ida y vuelta infinito.
        const comun = {
          label: control.label,
          hint: control.hint,
          onChange: (valor: number | boolean) =>
            escribir(control.clave, valor as FooterRenderConfig[typeof control.clave]),
        };

        campos[control.clave] =
          control.tipo === "interruptor"
            ? { ...comun, value: inicial[control.clave] }
            : { ...comun, value: inicial[control.clave], min: control.min, max: control.max, step: control.step };
      }

      salida[grupo.titulo] = folder(campos, { collapsed: !grupo.abierto });
    }

    salida.PRESETS = folder(
      {
        "Modo trabajo": button(() => RenderPie.trabajo()),
        "Modo final": button(() => RenderPie.final()),
        "Restaurar original": button(() => RenderPie.original()),
      },
      { collapsed: true },
    );

    return salida;
  }, [escribir]);

  useControls(esquema, { store });

  // Camino de vuelta: lo que cambia por fuera del panel se empuja a Leva.
  // Sin esto, apagar los efectos desde la consola movia la escena pero dejaba
  // el interruptor del panel mostrando lo contrario.
  useEffect(() => {
    return useFooterRenderStore.subscribe((estado, anterior) => {
      const cambios: Record<string, unknown> = {};
      for (const [clave, ruta] of Object.entries(RUTAS)) {
        const k = clave as keyof FooterRenderConfig;
        if (estado[k] !== anterior[k]) cambios[ruta as string] = estado[k];
      }
      if (Object.keys(cambios).length > 0) store.set(cambios, false);
    });
  }, [store]);

  // La consola del navegador y cualquier codigo del proyecto manejan lo mismo.
  useEffect(() => {
    (window as unknown as { bajoFlowRender: typeof RenderPie }).bajoFlowRender = RenderPie;
  }, []);

  // --- Arrastre dentro del pie -------------------------------------
  // Mismo patron que el panel de la Sala Bio: cabecera propia, Leva en modo
  // "fill" adentro, y el movimiento limitado al recuadro de la seccion para
  // que el panel no se pueda perder fuera de pantalla.
  const panelRef = useRef<HTMLDivElement>(null);
  const cuerpoRef = useRef<HTMLDivElement>(null);
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [plegado, setPlegado] = useState(false);

  const guardar = useFooterRenderStore((estado) => estado.guardar);
  const guardando = useFooterRenderStore((estado) => estado.guardando);
  const guardadoEn = useFooterRenderStore((estado) => estado.guardadoEn);
  const errorGuardado = useFooterRenderStore((estado) => estado.errorGuardado);

  const empezarArrastre = (evento: ReactPointerEvent<HTMLDivElement>) => {
    if (evento.button !== 0 || (evento.target instanceof HTMLElement && evento.target.closest("button"))) return;

    const panel = panelRef.current;
    const contenedor = panel?.parentElement;
    if (!panel || !contenedor) return;

    evento.preventDefault();

    const desdeX = evento.clientX;
    const desdeY = evento.clientY;
    const origen = { ...posicion };
    const cajaPanel = panel.getBoundingClientRect();
    const cajaPadre = contenedor.getBoundingClientRect();
    const baseIzq = cajaPanel.left - origen.x;
    const baseArriba = cajaPanel.top - origen.y;
    const minX = cajaPadre.left - baseIzq;
    const maxX = cajaPadre.right - baseIzq - cajaPanel.width;
    const minY = cajaPadre.top - baseArriba;
    const maxY = cajaPadre.bottom - baseArriba - cajaPanel.height;

    const mover = (e: PointerEvent) => {
      setPosicion({
        x: MathUtils.clamp(origen.x + e.clientX - desdeX, minX, maxX),
        y: MathUtils.clamp(origen.y + e.clientY - desdeY, minY, maxY),
      });
    };
    const soltar = () => {
      document.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerup", soltar);
      document.removeEventListener("pointercancel", soltar);
    };

    document.addEventListener("pointermove", mover);
    document.addEventListener("pointerup", soltar);
    document.addEventListener("pointercancel", soltar);
  };

  // LA RUEDA DEL MOUSE.
  // La pagina escucha "wheel" en window para pasar de seccion. Sin esto, girar
  // la rueda encima del panel saltaba a otra seccion en vez de recorrer los
  // controles. Se corta la propagacion antes de que llegue a window.
  useEffect(() => {
    const cuerpo = cuerpoRef.current;
    if (!cuerpo) return;
    const frenar = (evento: WheelEvent) => evento.stopPropagation();
    cuerpo.addEventListener("wheel", frenar, { passive: false });
    return () => cuerpo.removeEventListener("wheel", frenar);
  }, []);

  return (
    <div
      className={`footer-render-panel${plegado ? " is-plegado" : ""}`}
      ref={panelRef}
      style={{ transform: `translate3d(${posicion.x}px, ${posicion.y}px, 0)` }}
    >
      <div className="footer-render-panel-barra" onPointerDown={empezarArrastre}>
        <span className="footer-render-panel-titulo">Render del pie</span>
        <button
          className="footer-render-panel-guardar"
          disabled={guardando}
          onClick={guardar}
          title="Deja estos valores fijos en el proyecto"
          type="button"
        >
          {guardando ? "Guardando…" : "Guardar"}
        </button>
        <button
          aria-label={plegado ? "Abrir el panel" : "Plegar el panel"}
          className="footer-render-panel-plegar"
          onClick={() => setPlegado((v) => !v)}
          title={plegado ? "Abrir" : "Plegar"}
          type="button"
        >
          {plegado ? "+" : "–"}
        </button>
      </div>

      {errorGuardado ? (
        <p className="footer-render-panel-aviso is-error">{errorGuardado}</p>
      ) : guardadoEn ? (
        <p className="footer-render-panel-aviso">Guardado a las {guardadoEn}</p>
      ) : null}

      <div className="footer-render-panel-cuerpo" ref={cuerpoRef}>
        <LevaPanel
          fill
          neverHide
          store={store}
          // Fondos transparentes: el panel tiene presencia pero deja ver la
          // escena que hay detras, que es justo lo que uno esta ajustando.
          theme={{
            colors: {
              elevation1: "transparent",
              elevation2: "rgba(10, 15, 25, 0.42)",
              elevation3: "rgba(18, 26, 42, 0.66)",
            },
          }}
          titleBar={false}
        />
      </div>
    </div>
  );
}
