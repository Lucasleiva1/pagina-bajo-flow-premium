"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { SceneShell } from "@/components/SceneShell";
import { contactDetails, type NavItem, type SiteCopy } from "@/data/site";

type FooterSceneProps = {
  copy: SiteCopy["footer"];
  navItems: NavItem[];
  socialLinks: SiteCopy["contact"]["socialLinks"];
  onNavigate: (id: string) => void;
};

/**
 * Enlace con el mismo resplandor que las tarjetas de Contacto: una luz que
 * sigue al puntero. Cada enlace publica en --x / --y donde esta el mouse
 * dentro suyo, y el CSS pinta el degradado ahi.
 */
function GlowLink({
  children,
  className = "",
  href,
  onClick,
  external = false,
}: {
  children: ReactNode;
  className?: string;
  href: string;
  onClick?: (event: PointerEvent<HTMLAnchorElement> | React.MouseEvent<HTMLAnchorElement>) => void;
  external?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMove(event: PointerEvent<HTMLAnchorElement>) {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--x", `${event.clientX - rect.left}px`);
    element.style.setProperty("--y", `${event.clientY - rect.top}px`);
  }

  return (
    <a
      className={`footer-glow-link ${className}`}
      href={href}
      onClick={onClick}
      onPointerMove={handleMove}
      ref={ref}
      {...(external ? { rel: "noreferrer", target: "_blank" } : {})}
    >
      {children}
    </a>
  );
}

export function FooterScene({ copy, navItems, socialLinks, onNavigate }: FooterSceneProps) {
  const year = new Date().getFullYear();

  return (
    <SceneShell className="footer-scene" id="footer">
      {/* El foco cenital y la tarima. Todo dibujado con CSS para que la luz
          pueda titilar y para que se adapte a cualquier pantalla. */}
      <div className="footer-stage" aria-hidden="true">
        <div className="footer-beam" />
        <div className="footer-glow" />
        <div className="footer-podium">
          <span className="footer-podium-top" />
          <span className="footer-podium-edge" />
        </div>
      </div>

      <div className="footer-inner" data-scene-copy>
        <div className="footer-top">
          <div className="footer-brand">
            <p className="kicker">{copy.kicker}</p>
            <h2>{copy.title}</h2>
          </div>

          <div className="footer-contact">
            <p className="kicker">{copy.contactKicker}</p>
            <GlowLink className="footer-contact-line" href={`mailto:${contactDetails.email}`}>
              {contactDetails.email}
            </GlowLink>
            <GlowLink className="footer-contact-line" href={`tel:${contactDetails.phoneHref}`}>
              {contactDetails.phone}
            </GlowLink>
            <span className="footer-contact-line footer-contact-static">{copy.location}</span>
            <GlowLink
              className="footer-cta"
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("contact");
              }}
            >
              {copy.cta}
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </GlowLink>
          </div>
        </div>

        <div className="footer-rows">
          <nav className="footer-nav" aria-label={copy.navLabel}>
            {navItems.map((item) => (
              <GlowLink
                href={item.href}
                key={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(item.href.replace("#", ""));
                }}
              >
                {item.label}
              </GlowLink>
            ))}
          </nav>

          <nav className="footer-social" aria-label={copy.socialLabel}>
            {socialLinks.map((link) => (
              <GlowLink external href={link.href} key={link.href}>
                {link.label}
              </GlowLink>
            ))}
          </nav>
        </div>

        <div className="footer-legal">
          <span>
            © {year} {copy.kicker.toUpperCase()} — {contactDetails.owner}
          </span>
          <span>{copy.tagline}</span>
        </div>
      </div>
    </SceneShell>
  );
}
