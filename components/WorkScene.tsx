"use client";

import { type PointerEvent, useRef, useState } from "react";
import { SceneShell } from "@/components/SceneShell";
import { WorkGallery3D } from "@/components/three/WorkGallery3D";
import { ChevronIcon } from "@/components/ui/Icons";
import type { SiteCopy } from "@/data/site";

type WorkSceneProps = {
  copy: SiteCopy["work"];
};

export function WorkScene({ copy }: WorkSceneProps) {
  const [active, setActive] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStart = useRef<number | null>(null);
  const projects = copy.projects;

  function move(direction: number) {
    setActive((current) => (current + direction + projects.length) % projects.length);
  }

  function stopStagePointer(event: PointerEvent<HTMLElement>) {
    event.stopPropagation();
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (dragStart.current === null) return;
    const delta = event.clientX - dragStart.current;
    dragStart.current = null;
    setDragOffset(0);
    if (Math.abs(delta) < 38) return;
    move(delta < 0 ? 1 : -1);
  }

  return (
    <SceneShell className="work-scene" id="work">
      <div className="work-bg" aria-hidden="true" />
      <div className="scene-heading work-heading" data-scene-copy>
        <p className="kicker">{copy.kicker}</p>
        <h2>{copy.title}</h2>
      </div>

      <div
        className="work-stage"
        onPointerDown={(event) => {
          dragStart.current = event.clientX;
          setDragOffset(0);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (dragStart.current === null) return;
          const delta = event.clientX - dragStart.current;
          const clamped = Math.max(-220, Math.min(220, delta));
          setDragOffset(clamped);
        }}
        onPointerUp={(event) => {
          handlePointerUp(event);
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={(event) => {
          dragStart.current = null;
          setDragOffset(0);
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        style={{ touchAction: "pan-y" }}
      >
        <WorkGallery3D
          active={active}
          dragOffset={dragOffset}
          labels={{
            gallery: `${copy.kicker} 3D`,
            project: copy.projectAria,
            tools: copy.toolsAria,
            viewCase: copy.viewCase,
          }}
          projects={projects}
          setActive={setActive}
        />
        <button
          aria-label={copy.previous}
          className="gallery-arrow left"
          onClick={() => move(-1)}
          onPointerDown={stopStagePointer}
          type="button"
        >
          <ChevronIcon />
        </button>
        <button
          aria-label={copy.next}
          className="gallery-arrow right"
          onClick={() => move(1)}
          onPointerDown={stopStagePointer}
          type="button"
        >
          <ChevronIcon />
        </button>
      </div>

      <div className="gallery-progress" aria-label={copy.progress}>
        <span>{String(active + 1).padStart(2, "0")}</span>
        <div>
          {projects.map((project, index) => (
            <button
              aria-label={`${copy.viewProject} ${project.title}`}
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
