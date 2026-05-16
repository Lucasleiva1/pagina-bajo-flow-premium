"use client";

import type { CSSProperties } from "react";
import type { Project } from "@/data/site";

type WorkGallery3DProps = {
  active: number;
  dragOffset?: number;
  labels: {
    gallery: string;
    project: string;
    tools: string;
    viewCase: string;
  };
  projects: Project[];
  setActive: (index: number) => void;
};

function circularOffset(index: number, active: number, length: number) {
  let offset = index - active;

  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;

  return offset;
}

function slotForOffset(offset: number) {
  if (offset === 0) return "center";
  if (offset === -1) return "left";
  if (offset === 1) return "right";
  return "hidden";
}

function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function WorkGallery3D({
  active,
  dragOffset = 0,
  labels,
  projects,
  setActive,
}: WorkGallery3DProps) {
  const total = projects.length;
  const dragStyle = {
    "--drag-x": `${dragOffset}px`,
    "--drag-tilt": `${dragOffset / -28}deg`,
  } as CSSProperties;

  function selectProject(index: number) {
    if (index !== active) setActive(index);
  }

  return (
    <div className="work-canvas cinematic-gallery" aria-label={labels.gallery}>
      <div className="gallery-atmosphere" aria-hidden="true" />
      <div
        className={`gallery-orbit${dragOffset !== 0 ? " dragging" : ""}`}
        style={dragStyle}
      >
        {projects.map((project, index) => {
          const offset = circularOffset(index, active, total);
          const slot = slotForOffset(offset);
          const isActive = index === active;
          const isVisible = slot !== "hidden";

          return (
            <article
              aria-hidden={!isVisible}
              aria-label={`${labels.project} ${formatIndex(index)}: ${project.title}`}
              className={`work-card ${slot}${isActive ? " active" : ""}`}
              key={project.title}
            >
              {!isActive && isVisible && (
                <button
                  aria-label={`Select ${project.title}`}
                  className="work-card-interaction"
                  onClick={() => selectProject(index)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    zIndex: 10,
                    border: "none",
                    background: "transparent",
                  }}
                />
              )}
              <div className="work-card-media-wrap">
                <video
                  autoPlay
                  className="work-card-media"
                  loop
                  muted
                  playsInline
                  preload="auto"
                  src={project.video}
                >
                  <track kind="captions" />
                </video>
                <div className="work-card-shade" aria-hidden="true" />
              </div>

              <div className="work-card-meta top">
                <span>{formatIndex(index)}</span>
                <i aria-hidden="true" />
                <span className="runtime">{project.runtime}</span>
              </div>

              <div className="work-card-copy">
                <p className="project-category">{project.category}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>

              <div className="work-card-footer">
                <div className="work-tools" aria-label={labels.tools}>
                  {project.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
                {isActive ? (
                  <a
                    className="work-view-case"
                    href={project.href}
                    onClick={(event) => event.stopPropagation()}
                    onPointerDown={(event) => event.stopPropagation()}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {labels.viewCase}
                    <svg aria-hidden="true" viewBox="0 0 16 16">
                      <path d="M5 3h8v8" />
                      <path d="M13 3 3 13" />
                    </svg>
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
