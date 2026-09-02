"use client";

import { useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { SceneShell } from "@/components/SceneShell";
import { FooterAtmosphere } from "@/components/three/FooterAtmosphere";
import { contactDetails, type SiteCopy } from "@/data/site";
import { PANELES_DE_AJUSTE_VISIBLES } from "@/lib/panelesDeAjuste";
import { RenderPie } from "@/lib/useFooterRenderStore";

/**
 * PANEL DE TRABAJO: SOLO EN LOCAL, Y NI SIQUIERA VIAJA A PRODUCCION.
 *
 * La comparacion se resuelve al compilar (NODE_ENV queda escrito como texto
 * fijo), asi que en la version publicada esta rama queda muerta y el
 * empaquetador puede tirar el panel ENTERO, junto con la libreria Leva. No
 * es solo que no se dibuje: no se descarga.
 *
 * Antes se importaba siempre y se escondia al dibujar. No se veia, pero el
 * codigo y los textos de los controles igual le llegaban al visitante.
 */
const PanelDeRender =
  process.env.NODE_ENV === "development" && PANELES_DE_AJUSTE_VISIBLES
    ? dynamic(() => import("@/components/three/FooterRenderPanel").then((m) => m.FooterRenderPanel), {
        ssr: false,
      })
    : null;

type FooterSceneProps = {
  copy: SiteCopy["footer"];
  socialLinks: SiteCopy["contact"]["socialLinks"];
  onNavigate: (id: string) => void;
  isActive: boolean;
};

/**
 * EL ULTIMO PLANO.
 *
 * Contacto hace la invitacion; esto es el plano que cierra la pieza. El
 * diseno entero vive en HTML y CSS: si el WebGL no arrancara, el pie se
 * seguiria viendo igual de bien. La atmosfera (haz, polvo, cinta) solo
 * agrega profundidad detras del texto.
 */
export function FooterScene({ copy, socialLinks, onNavigate, isActive }: FooterSceneProps) {
  const year = new Date().getFullYear();

  // El boton le sube la luz al haz sin provocar un re-render: la escena 3D
  // lee este valor cuadro a cuadro y se acerca de a poco.
  const intensityRef = useRef(1);

  const handleCtaEnter = useCallback(() => {
    intensityRef.current = 1.07;
  }, []);

  const handleCtaLeave = useCallback(() => {
    intensityRef.current = 1;
  }, []);

  // La imagen se puede manejar desde codigo aunque el panel este oculto:
  // bajoFlowRender.set("resolucionInterna", 2) y compania. Solo en local.
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    (window as unknown as { bajoFlowRender: typeof RenderPie }).bajoFlowRender = RenderPie;
  }, []);

  return (
    <SceneShell className="footer-scene" id="footer">
      {/* Decorativo puro: ni el lector de pantalla ni el puntero lo tocan. */}
      <div aria-hidden="true" className="footer-atmos">
        <FooterAtmosphere intensityRef={intensityRef} isActive={isActive} />
      </div>

      {/* Nada de la escena depende del panel: si se saca, todo sigue andando
          con los valores guardados en data/footerRenderPreset.ts. */}
      {PanelDeRender && isActive ? <PanelDeRender /> : null}
      {/* El fundido desde negro hacia la ultima escena. */}
      <div aria-hidden="true" className="footer-veil" />

      <div className="footer-final" data-scene-copy>
        <div className="footer-final-head">
          <p className="footer-slate-label">{copy.finalFrame}</p>
          <span aria-hidden="true" className="footer-slate-tick" />

          <h2 className="footer-final-title">{copy.title}</h2>

          <a
            className="footer-final-cta"
            href="#contact"
            onBlur={handleCtaLeave}
            onClick={(event) => {
              event.preventDefault();
              onNavigate("contact");
            }}
            onFocus={handleCtaEnter}
            onPointerEnter={handleCtaEnter}
            onPointerLeave={handleCtaLeave}
          >
            <span>{copy.cta}</span>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        {/* El titulo final. Sigue siendo texto: se lee, se selecciona y se traduce. */}
        <p className="footer-wordmark">{copy.kicker}</p>

        <div className="footer-slate">
          <nav aria-label={copy.socialLabel} className="footer-slate-links">
            {socialLinks.map((link) => (
              <a href={link.href} key={link.href} rel="noreferrer" target="_blank">
                {link.label}
              </a>
            ))}
            <a href={`mailto:${contactDetails.email}`}>{copy.emailLabel}</a>
          </nav>

          <div className="footer-slate-group">
            <span className="footer-slate-place">{copy.location}</span>
            <span className="footer-slate-specs">{copy.specs}</span>
          </div>

          <div className="footer-slate-group">
            <span className="footer-slate-cut">{copy.cut}</span>
            <span className="footer-slate-timecode">{copy.timecode}</span>
          </div>

          <p className="footer-slate-copyright">
            © {year} {copy.kicker}
          </p>
        </div>
      </div>
    </SceneShell>
  );
}
