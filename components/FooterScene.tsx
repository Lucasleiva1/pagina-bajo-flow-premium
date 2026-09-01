"use client";

import { useCallback, useRef } from "react";
import { SceneShell } from "@/components/SceneShell";
import { FooterAtmosphere } from "@/components/three/FooterAtmosphere";
import { contactDetails, type SiteCopy } from "@/data/site";

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

  return (
    <SceneShell className="footer-scene" id="footer">
      {/* Decorativo puro: ni el lector de pantalla ni el puntero lo tocan. */}
      <div aria-hidden="true" className="footer-atmos">
        <FooterAtmosphere intensityRef={intensityRef} isActive={isActive} />
      </div>
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
