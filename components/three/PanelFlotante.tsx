"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { LevaPanel, useControls, useCreateStore, folder, button } from "leva";
import { MathUtils } from "three";

/* ===================================================================
   PANEL DE TRABAJO FLOTANTE

   La carcasa compartida de los paneles de ajuste: barra propia con
   arrastre, plegado, fondo translucido, rueda que no se la roba la
   pagina, y Leva adentro en modo "fill".

   Leva es SOLO la interfaz. Cada panel recibe funciones para leer y
   escribir en SU centro de control, que es la unica fuente de verdad.
   Asi el mismo estado se maneja desde el panel o desde codigo, y los
   dos caminos se mantienen sincronizados.

   Lo aprendido a los golpes y que conviene no volver a tocar:
   - El arrastre va SOLO en la barra de arriba. Permitirlo en todo el
     panel hace que mover una perilla arrastre la ventana entera.
   - El limite del arrastre se calcula con max(): si el panel es mas
     alto que su contenedor, el tope de abajo queda por encima del de
     arriba y el panel se va de pantalla sin poder volver.
   - La rueda hay que frenarla antes de que llegue a window, porque la
     pagina la usa para cambiar de seccion.
   - Leva en modo "fill" deja sus envoltorios en alto 0 y el contenido
     se desborda: el alto lo resuelve el CSS forzandolos a automatico.
   =================================================================== */

export type ControlPanel =
  | { clave: string; id?: string; tipo: "interruptor"; label: string; hint: string }
  | { clave: string; id?: string; tipo: "rango"; label: string; hint: string; min: number; max: number; step: number }
  | { clave: string; id?: string; tipo: "lista"; label: string; hint: string; opciones: Record<string, number> };

export type GrupoPanel = { titulo: string; abierto: boolean; controles: ControlPanel[] };

/** Nombre del control dentro de Leva. Hace falta cuando dos controles
    manejan el MISMO valor: Leva no admite nombres repetidos en la carpeta. */
const idDe = (control: ControlPanel) => control.id ?? control.clave;

/** Leva no exporta su tipo de esquema, asi que se toma del propio folder(). */
type EsquemaLeva = Parameters<typeof folder>[0];

type Estado = Record<string, unknown>;

type Props = {
  titulo: string;
  grupos: GrupoPanel[];
  /** Valores del momento de montar el panel. */
  leerEstado: () => Estado;
  /** Camino de ida: el panel escribe en el centro de control. */
  escribir: (clave: string, valor: number | boolean) => void;
  /** Camino de vuelta: avisa cuando el estado cambia por fuera del panel. */
  suscribir: (oyente: (estado: Estado, anterior: Estado) => void) => () => void;
  /** Botones de la carpeta PRESETS. */
  presets?: Record<string, () => void>;
  /** Boton Guardar de la barra. Si no se pasa, no aparece. */
  guardado?: {
    guardar: () => void;
    guardando: boolean;
    guardadoEn: string | null;
    error: string | null;
  };
};

export function PanelFlotante({ titulo, grupos, leerEstado, escribir, suscribir, presets, guardado }: Props) {
  const store = useCreateStore();

  /** Ruta de Leva de cada control: "CARPETA.nombre". Es una lista y no un
      diccionario porque un mismo valor puede tener dos controles. */
  const rutas = useMemo(
    () =>
      grupos.flatMap((grupo) =>
        grupo.controles.map((control) => ({ clave: control.clave, ruta: `${grupo.titulo}.${idDe(control)}` })),
      ),
    [grupos],
  );

  const esquema = useMemo(() => {
    const inicial = leerEstado();
    const salida: EsquemaLeva = {};

    for (const grupo of grupos) {
      const campos: EsquemaLeva = {};

      for (const control of grupo.controles) {
        // Si el valor ya era ese (porque el cambio vino de afuera), el centro
        // de control corta solo y no se arma un ida y vuelta infinito.
        const comun = {
          label: control.label,
          hint: control.hint,
          onChange: (valor: number | boolean) => escribir(control.clave, valor),
        };
        // El estado llega generico; aca ya sabemos que es un numero o un booleano.
        const valor = inicial[control.clave] as number | boolean;

        // La conversion es necesaria porque este panel es generico: Leva
        // quiere saber de antemano si el control es booleano o numerico, y
        // aca eso recien se sabe al mirar el tipo de cada control.
        const campo = (definicion: object) => {
          campos[idDe(control)] = definicion as EsquemaLeva[string];
        };

        if (control.tipo === "interruptor") {
          campo({ ...comun, value: valor });
        } else if (control.tipo === "lista") {
          campo({ ...comun, value: valor, options: control.opciones });
        } else {
          campo({ ...comun, value: valor, min: control.min, max: control.max, step: control.step });
        }
      }

      salida[grupo.titulo] = folder(campos, { collapsed: !grupo.abierto });
    }

    if (presets && Object.keys(presets).length > 0) {
      const botones: EsquemaLeva = {};
      for (const [nombre, accion] of Object.entries(presets)) botones[nombre] = button(accion);
      salida.PRESETS = folder(botones, { collapsed: true });
    }

    return salida;
  }, [escribir, grupos, leerEstado, presets]);

  useControls(esquema, { store });

  // Lo que cambia por fuera del panel se empuja a Leva, para que los
  // deslizadores reflejen el estado real.
  useEffect(
    () =>
      suscribir((estado, anterior) => {
        const cambios: Record<string, unknown> = {};
        for (const { clave, ruta } of rutas) {
          if (estado[clave] !== anterior[clave]) cambios[ruta] = estado[clave];
        }
        if (Object.keys(cambios).length > 0) store.set(cambios, false);
      }),
    [rutas, store, suscribir],
  );

  /* --- Arrastre, plegado y rueda ---------------------------------- */
  const panelRef = useRef<HTMLDivElement>(null);
  const cuerpoRef = useRef<HTMLDivElement>(null);
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [plegado, setPlegado] = useState(false);

  const empezarArrastre = (evento: ReactPointerEvent<HTMLDivElement>) => {
    const sobreBoton = evento.target instanceof HTMLElement && evento.target.closest("button");
    if (evento.button !== 0 || sobreBoton) return;

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
    const minY = cajaPadre.top - baseArriba;
    const maxX = Math.max(minX, cajaPadre.right - baseIzq - cajaPanel.width);
    const maxY = Math.max(minY, cajaPadre.bottom - baseArriba - cajaPanel.height);

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
      <div
        className="footer-render-panel-barra"
        onDoubleClick={() => setPosicion({ x: 0, y: 0 })}
        onPointerDown={empezarArrastre}
        title="Arrastrá desde acá para mover. Doble clic para devolverlo a su lugar."
      >
        <span className="footer-render-panel-titulo">{titulo}</span>
        {guardado ? (
          <button
            className="footer-render-panel-guardar"
            disabled={guardado.guardando}
            onClick={guardado.guardar}
            title="Deja estos valores fijos en el proyecto"
            type="button"
          >
            {guardado.guardando ? "Guardando…" : "Guardar"}
          </button>
        ) : null}
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

      {guardado?.error ? (
        <p className="footer-render-panel-aviso is-error">{guardado.error}</p>
      ) : guardado?.guardadoEn ? (
        <p className="footer-render-panel-aviso">Guardado a las {guardado.guardadoEn}</p>
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
