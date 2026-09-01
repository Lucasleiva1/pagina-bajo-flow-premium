"use client";

import { create } from "zustand";
import { footerRenderPreset, type FooterRenderPreset } from "@/data/footerRenderPreset";

/* ===================================================================
   CENTRO DE CONTROL DEL RENDER DEL PIE DE PAGINA

   Esta es la UNICA fuente de verdad. El panel de Leva no toca la escena
   directamente: mueve estos valores. La escena tampoco guarda estado
   propio: lee de aca. Y desde codigo (o desde otra IA) se maneja con las
   mismas funciones que usa el panel.

   Regla que ordena todo lo demas: con "efectosActivos" en falso, la
   escena se dibuja EXACTAMENTE como antes de instalar el postprocesado.
   No es un modo reducido: es el mismo camino de dibujo de siempre, sin
   composer y sin pasadas extra.
   =================================================================== */

/** Valores reales de la escena cuando cada multiplicador vale 1. */
export const VALORES_BASE: Record<
  | "beamOpacity"
  | "glowOpacity"
  | "dustRiseSpeed"
  | "dustSize"
  | "dustOpacity"
  | "filmOpacity"
  | "filmOpacityCompact"
  | "dustCount"
  | "dustCountCompact",
  number
> = {
  /** Opacidad del cono de luz. */
  beamOpacity: 0.38,
  /** Opacidad del circulo de la lente. */
  glowOpacity: 0.62,
  /** Unidades por segundo que sube el polvo. */
  dustRiseSpeed: 0.075,
  /** Tamano de cada mota. */
  dustSize: 0.1,
  /** Opacidad del polvo. */
  dustOpacity: 0.9,
  /** Opacidad de la cinta en escritorio y en celular. */
  filmOpacity: 0.52,
  filmOpacityCompact: 0.4,
  /** Cantidad de motas en escritorio y en celular. */
  dustCount: 420,
  dustCountCompact: 90,
};

export type ModoRender = "trabajo" | "final" | "personalizado";

export type FooterRenderConfig = {
  /* --- Postprocesado ------------------------------------------- */
  /** Interruptor maestro. En falso no se monta ni el composer. */
  efectosActivos: boolean;
  /** Politica por dispositivo: en celular el postprocesado suele no valer la pena. */
  efectosEnCelular: boolean;
  /** Suavizado de bordes (SMAA). */
  suavizado: boolean;
  /** Tope de resolucion interna. Mas alto = mas nitido y mas GPU. */
  resolucionInterna: number;

  /* --- Resplandor ----------------------------------------------- */
  resplandor: boolean;
  resplandorIntensidad: number;
  resplandorUmbral: number;
  resplandorRadio: number;

  /* --- Luz del proyector ---------------------------------------- */
  /**
   * Brillo del HAZ, la luz que sale disparada hacia afuera. 1 = como estaba.
   * Va separado de la lente a proposito: son dos cosas distintas y subir una
   * no tiene por que encender la otra.
   */
  luzHaz: number;
  /** Brillo del circulo de la LENTE, la boca del proyector. */
  luzLente: number;
  /** Multiplicador de apertura del cono. 1 = como estaba. */
  luzApertura: number;
  /** 0 = luz fija, 1 = el parpadeo original. */
  luzParpadeo: number;

  /* --- Polvo ----------------------------------------------------- */
  /** Multiplicador de cantidad de motas. */
  polvoCantidad: number;
  /** 0 = quieto en el aire, 1 = como estaba, 3 = sube tres veces mas rapido. */
  polvoVelocidad: number;
  polvoTamano: number;
  polvoBrillo: number;

  /* --- Cinta ----------------------------------------------------- */
  cintaOpacidad: number;
  /** 0 = quieta, 1 = el balanceo original. */
  cintaBalanceo: number;

  /* --- Movimiento ------------------------------------------------ */
  /** Parallax de la camara con el mouse. */
  parallax: boolean;

  /** Que preset esta puesto. Pasa a "personalizado" al mover cualquier cosa. */
  modo: ModoRender;
};

/**
 * El estado con el que arranca la pagina. Sale de data/footerRenderPreset.ts,
 * que es el archivo que reescribe el boton "Guardar" del panel. Asi lo que se
 * ajusta con los deslizadores queda fijo en el proyecto, y el dia que se saque
 * el panel la pagina sigue viendose igual.
 */
export const CONFIG_ORIGINAL: FooterRenderConfig = {
  ...footerRenderPreset,
  modo: "final",
};

/** Modo trabajo: lo mas liviano posible sin cambiar la escena. */
const PRESET_TRABAJO: Partial<FooterRenderConfig> = {
  efectosActivos: false,
  suavizado: false,
  resplandor: false,
  resolucionInterna: 1,
  parallax: false,
};

/** Modo final: como se tiene que ver la pagina terminada. */
const PRESET_FINAL: Partial<FooterRenderConfig> = {
  efectosActivos: true,
  suavizado: true,
  resolucionInterna: 1.5,
  parallax: true,
};

type FooterRenderStore = FooterRenderConfig & {
  /** Estado del boton Guardar. */
  guardando: boolean;
  guardadoEn: string | null;
  errorGuardado: string | null;
  /** Escribe los valores actuales en data/footerRenderPreset.ts. */
  guardar(): Promise<void>;
  /**
   * Sube cada vez que algo cambia el estado DESDE AFUERA del panel (un preset,
   * la consola, otra IA). El panel se reconstruye cuando esto cambia, y asi
   * refleja lo de afuera sin pelearse consigo mismo mientras se arrastra un
   * deslizador.
   */
  revision: number;
  /** Cambia un valor suelto. Pasa el modo a "personalizado". */
  set<K extends keyof FooterRenderConfig>(clave: K, valor: FooterRenderConfig[K]): void;
  /** Cambia varios de una. */
  aplicar(parcial: Partial<FooterRenderConfig>): void;
  /** Presets. */
  modoTrabajo(): void;
  modoFinal(): void;
  /** Vuelve a como estaba antes de instalar el postprocesado. */
  restaurarOriginal(): void;
  /** Apaga TODO el postprocesado de una. */
  apagarEfectos(): void;
};

export const useFooterRenderStore = create<FooterRenderStore>((set) => ({
  ...CONFIG_ORIGINAL,
  revision: 0,
  guardando: false,
  guardadoEn: null,
  errorGuardado: null,

  set: (clave, valor) =>
    set((estado) => {
      if (estado[clave] === valor) return estado;

      const cambio: Record<string, unknown> = { [clave]: valor, modo: "personalizado" };
      // Prender el suavizado o el resplandor enciende solo el interruptor
      // maestro. Sin esto uno movia el control y no pasaba nada, que es la
      // peor sensacion posible en un panel.
      if ((clave === "suavizado" || clave === "resplandor") && valor === true) {
        cambio.efectosActivos = true;
      }
      return cambio as Partial<FooterRenderStore>;
    }),

  aplicar: (parcial) => set((estado) => ({ ...parcial, revision: estado.revision + 1 })),

  modoTrabajo: () => set((estado) => ({ ...PRESET_TRABAJO, modo: "trabajo" as const, revision: estado.revision + 1 })),
  modoFinal: () => set((estado) => ({ ...PRESET_FINAL, modo: "final" as const, revision: estado.revision + 1 })),

  restaurarOriginal: () => set((estado) => ({ ...CONFIG_ORIGINAL, revision: estado.revision + 1 })),

  guardar: async () => {
    set({ guardando: true, errorGuardado: null });
    try {
      const a = useFooterRenderStore.getState();
      // Se arma explicito: solo los valores de la escena. Ni el modo, ni el
      // estado del boton, ni las funciones del centro de control.
      const valores: FooterRenderPreset = {
        efectosActivos: a.efectosActivos,
        efectosEnCelular: a.efectosEnCelular,
        suavizado: a.suavizado,
        resolucionInterna: a.resolucionInterna,
        resplandor: a.resplandor,
        resplandorIntensidad: a.resplandorIntensidad,
        resplandorUmbral: a.resplandorUmbral,
        resplandorRadio: a.resplandorRadio,
        luzHaz: a.luzHaz,
        luzLente: a.luzLente,
        luzApertura: a.luzApertura,
        luzParpadeo: a.luzParpadeo,
        polvoCantidad: a.polvoCantidad,
        polvoVelocidad: a.polvoVelocidad,
        polvoTamano: a.polvoTamano,
        polvoBrillo: a.polvoBrillo,
        cintaOpacidad: a.cintaOpacidad,
        cintaBalanceo: a.cintaBalanceo,
        parallax: a.parallax,
      };

      const respuesta = await fetch("/api/footer-render", {
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
  apagarEfectos: () =>
    set((estado) => ({ efectosActivos: false, modo: "personalizado" as const, revision: estado.revision + 1 })),
}));

/**
 * Decide si el postprocesado corre de verdad. Es lo que mira la escena:
 * el interruptor maestro mas la politica por dispositivo. En celular queda
 * apagado salvo que se pida expresamente.
 */
export function postprocesadoActivo(config: FooterRenderConfig, esCelular: boolean) {
  if (!config.efectosActivos) return false;
  if (esCelular && !config.efectosEnCelular) return false;
  return true;
}

/**
 * API para manejar el render desde codigo o desde la consola del navegador,
 * sin pasar por el panel. Toca exactamente el mismo estado, asi que el panel
 * se actualiza solo. Se publica en window.bajoFlowRender.
 */
export const RenderPie = {
  estado: () => useFooterRenderStore.getState(),
  trabajo: () => useFooterRenderStore.getState().modoTrabajo(),
  final: () => useFooterRenderStore.getState().modoFinal(),
  original: () => useFooterRenderStore.getState().restaurarOriginal(),
  apagar: () => useFooterRenderStore.getState().apagarEfectos(),
  set: <K extends keyof FooterRenderConfig>(clave: K, valor: FooterRenderConfig[K]) =>
    useFooterRenderStore.getState().set(clave, valor),
  aplicar: (parcial: Partial<FooterRenderConfig>) => useFooterRenderStore.getState().aplicar(parcial),
  guardar: () => useFooterRenderStore.getState().guardar(),
};
