import type { NavItem } from "@/data/site";

type HeaderProps = {
  activeScene: string;
  items: NavItem[];
};

export function Header({ activeScene, items }: HeaderProps) {
  return (
    <header className="site-header">
      <a className="brand magnetic-target" href="#intro" aria-label="Bajo Flow inicio">
        <span className="brand-mark" aria-hidden="true" />
        <strong>BAJO FLOW</strong>
      </a>
      <nav className="nav-links" aria-label="Navegacion principal">
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
    </header>
  );
}
