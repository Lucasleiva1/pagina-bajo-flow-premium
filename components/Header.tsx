import type { Language, NavItem, SiteCopy } from "@/data/site";

type HeaderProps = {
  activeScene: string;
  copy: SiteCopy["header"];
  items: NavItem[];
  language: Language;
  languages: Array<{ code: Language; label: string }>;
  onLanguageChange: (language: Language) => void;
};

export function Header({
  activeScene,
  copy,
  items,
  language,
  languages,
  onLanguageChange,
}: HeaderProps) {
  return (
    <header className="site-header">
      <a className="brand magnetic-target" href="#intro" aria-label={copy.brandAria}>
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
            >
              {item.label}
            </a>
          ))}
        </nav>
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
      </div>
    </header>
  );
}
