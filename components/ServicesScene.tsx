"use client";

import { useState } from "react";
import { SceneShell } from "@/components/SceneShell";
import type { SiteCopy } from "@/data/site";

type ServicesSceneProps = {
  copy: SiteCopy["services"];
};

export function ServicesScene({ copy }: ServicesSceneProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = copy.services[activeIndex] ?? copy.services[0];

  return (
    <SceneShell className="services-scene" id="services">
      <div className="services-bg" aria-hidden="true" />
      <div className="services-side-rail services-side-rail-left" aria-hidden="true">
        <span />
        <p>{copy.sideRailLeft}</p>
        <span />
      </div>
      <div className="services-side-rail services-side-rail-right" aria-hidden="true">
        <span />
        <p>{copy.sideRailRight}</p>
        <span />
      </div>

      <div className="services-console" data-scene-copy>
        <div className="services-screen" aria-live="polite">
          <div className="services-screen-copy">
            <p className="kicker">{copy.kicker}</p>
            <h2>{copy.title}</h2>
            <p>{copy.lead}</p>
            <div className="services-screen-status">
              <span>{String(activeIndex + 1).padStart(2, "0")}</span>
              <strong>{activeService.meta}</strong>
            </div>
          </div>

          <figure className="services-screen-visual">
            <img
              alt={`${copy.screenLabel}: ${activeService.title}`}
              key={activeService.screenImage}
              src={activeService.screenImage}
            />
          </figure>

          <div className="services-screen-detail">
            <span>{activeService.eyebrow}</span>
            <h3>{activeService.headline}</h3>
            <p>{activeService.description}</p>
            <a href="#contact">{copy.cta}</a>
          </div>
        </div>

        <div className="services-card-row" aria-label={copy.cardLabel}>
          {copy.services.map((service, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                aria-label={`${copy.cardLabel}: ${service.title}`}
                aria-pressed={isActive}
                className={`services-card ${isActive ? "active" : ""}`}
                key={service.title}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <img alt="" aria-hidden="true" src={service.cardImage} />
                <span className="services-card-scrim" aria-hidden="true" />
                <span className="services-card-index">{String(index + 1).padStart(2, "0")}</span>
                <strong>{service.title}</strong>
                <small>{service.eyebrow}</small>
              </button>
            );
          })}
        </div>
      </div>

      <p className="services-status" aria-hidden="true">{copy.status}</p>
    </SceneShell>
  );
}
