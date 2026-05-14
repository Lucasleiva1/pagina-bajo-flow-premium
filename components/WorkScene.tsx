"use client";

import { useRef, useState } from "react";
import { SceneShell } from "@/components/SceneShell";
import { WorkGallery3D } from "@/components/three/WorkGallery3D";
import { ChevronIcon } from "@/components/ui/Icons";
import { projects } from "@/data/site";

export function WorkScene() {
  const [active, setActive] = useState(0);
  const dragStart = useRef<number | null>(null);
  const activeProject = projects[active];

  function move(direction: number) {
    setActive((current) => (current + direction + projects.length) % projects.length);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (dragStart.current === null) return;
    const delta = event.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(delta) < 38) return;
    move(delta < 0 ? 1 : -1);
  }

  return (
    <SceneShell className="work-scene" id="work">
      <div className="work-bg" aria-hidden="true" />
      <div className="scene-heading work-heading" data-scene-copy>
        <p className="kicker">Selected work</p>
        <h2>Stories, Cut to Perfection</h2>
        <p>
          Una galeria preparada para reemplazar cada placeholder por proyectos reales, con
          profundidad WebGL, camara y luz cinematografica.
        </p>
      </div>

      <div
        className="work-stage"
        onPointerDown={(event) => {
          dragStart.current = event.clientX;
        }}
        onPointerLeave={() => {
          dragStart.current = null;
        }}
        onPointerUp={handlePointerUp}
      >
        <WorkGallery3D active={active} projects={projects} setActive={setActive} />
        <button
          aria-label="Trabajo anterior"
          className="gallery-arrow left"
          onClick={() => move(-1)}
          type="button"
        >
          <ChevronIcon />
        </button>
        <button
          aria-label="Trabajo siguiente"
          className="gallery-arrow right"
          onClick={() => move(1)}
          type="button"
        >
          <ChevronIcon />
        </button>
      </div>

      <aside className="work-panel" data-depth-card>
        <span>{String(active + 1).padStart(2, "0")}</span>
        <h3>{activeProject.title}</h3>
        <p className="project-category">{activeProject.category}</p>
        <p>{activeProject.description}</p>
        <div className="tool-list">
          {activeProject.tools.map((tool) => (
            <small key={tool}>{tool}</small>
          ))}
        </div>
      </aside>

      <div className="gallery-progress" aria-label="Progreso de trabajos">
        <span>{String(active + 1).padStart(2, "0")}</span>
        <div>
          {projects.map((project, index) => (
            <button
              aria-label={`Ver ${project.title}`}
              className={index === active ? "active" : ""}
              key={project.title}
              onClick={() => setActive(index)}
              type="button"
            />
          ))}
        </div>
        <span>{String(projects.length).padStart(2, "0")}</span>
      </div>
    </SceneShell>
  );
}
