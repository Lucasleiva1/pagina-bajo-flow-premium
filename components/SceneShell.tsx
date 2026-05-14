import type { ReactNode } from "react";

type SceneShellProps = {
  id: string;
  className?: string;
  children: ReactNode;
};

export function SceneShell({ id, className = "", children }: SceneShellProps) {
  return (
    <section className={`scene ${className}`} data-scene id={id}>
      <div className="scene-border" aria-hidden="true" />
      {children}
    </section>
  );
}
