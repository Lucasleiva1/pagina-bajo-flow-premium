import type { MouseEvent } from "react";
import type { Language, NavItem, SiteCopy } from "@/data/site";

type HeaderProps = {
  activeScene: string;
  copy: SiteCopy["header"];
  items: NavItem[];
  language: Language;
  languages: Array<{ code: Language; label: string }>;
  onLanguageChange: (language: Language) => void;
  onNavigate: (id: string) => void;
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
  onNavigate,
  isHidden,
}: HeaderProps) {
  // Ya no hay scroll de documento: el menu cambia de seccion con el difuminado.
  const handleNavClick = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) {
      return;
    }

    event.preventDefault();
    onNavigate(href.replace("#", ""));
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
