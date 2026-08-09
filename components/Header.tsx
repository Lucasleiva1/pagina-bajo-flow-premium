import type { MouseEvent } from "react";
import type { Language, NavItem, SiteCopy } from "@/data/site";

type HeaderProps = {
  activeScene: string;
  copy: SiteCopy["header"];
  items: NavItem[];
  language: Language;
  languages: Array<{ code: Language; label: string }>;
  onLanguageChange: (language: Language) => void;
  isHidden?: boolean;
};

// Cambiar a true cuando se decida volver a mostrar el selector.
const SHOW_LANGUAGE_SWITCHER = false;

export function Header({
  activeScene,
  copy,
  items,
  language,
  languages,
  onLanguageChange,
  isHidden,
}: HeaderProps) {
  const handleNavClick = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) {
      return;
    }

    const target = document.querySelector<HTMLElement>(href);

    if (!target) {
      return;
    }

    event.preventDefault();

    const headerHeight = document.querySelector<HTMLElement>(".site-header")?.getBoundingClientRect().height ?? 0;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - 12);

    window.history.replaceState(null, "", href);
    window.scrollTo({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      top,
    });
  };

  return (
    <header className={`site-header ${isHidden ? "header-hidden" : ""}`}>
      <a className="brand magnetic-target" href="#intro" aria-label={copy.brandAria} onClick={handleNavClick("#intro")}>
        <span className="brand-mark" aria-hidden="true" />
        <strong>BAJO FLOW</strong>
      </a>
      <div className="header-actions">
        <nav className="nav-links" aria-label={copy.navAria}>
          {items.map((item) => (
            <a
              className={activeScene === item.href.replace("#", "") ? "active" : ""}
              href={item.href}
              key={item.href}
              onClick={handleNavClick(item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        {SHOW_LANGUAGE_SWITCHER ? (
          <div className="language-switcher" aria-label={copy.languageAria} role="group">
            <span className="sr-only">{copy.languageLabel}</span>
            {languages.map((option) => (
              <button
                aria-pressed={language === option.code}
                className={language === option.code ? "active" : ""}
                key={option.code}
                onClick={() => onLanguageChange(option.code)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}
