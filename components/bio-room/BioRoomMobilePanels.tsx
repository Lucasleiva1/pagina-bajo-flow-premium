"use client";

import Image from "next/image";
import type { SiteCopy } from "@/data/site";
import { useBioRoomStore } from "@/lib/useBioRoomStore";

type BioRoomMobilePanelsProps = {
  copy: SiteCopy["bio"];
};

function getVideoPoster(item: SiteCopy["bio"]["skillItems"][number]) {
  return item.poster ?? (item.videoId ? `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg` : "");
}

export function BioRoomMobilePanels({ copy }: BioRoomMobilePanelsProps) {
  const openGalleryItem = useBioRoomStore((state) => state.openGalleryItem);

  return (
    <div className="bio-room-mobile">
      <section className="bio-room-mobile-hero">
        <div className="bio-room-mobile-bg-words" aria-hidden="true">
          {copy.backgroundWords.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </div>

        <div className="bio-room-mobile-hero-visual" aria-hidden="true">
          <div className="bio-room-mobile-orbit">
            {copy.backgroundWords.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
          <div className="bio-room-mobile-portrait">
            <Image
              alt=""
              fill
              priority
              sizes="(max-width: 860px) 78vw, 320px"
              src="/assets/bio-room/lucas-sentado.png"
            />
          </div>
        </div>

        <div className="bio-room-mobile-hero-copy">
          <p className="bio-room-mobile-nav">{copy.editorialNav.join(" / ")}</p>
          <h2>{copy.title}</h2>
          <p className="bio-room-mobile-intro">
            {copy.editorialIntro.prefix}{" "}
            <strong>{copy.editorialIntro.name}</strong>, {copy.editorialIntro.suffix}
          </p>
          <div className="bio-room-mobile-quick-specs" aria-label={copy.contributionLabel}>
            {copy.backgroundWords.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bio-room-mobile-strip" aria-label={copy.contributionLabel}>
        <p className="bio-room-mobile-nav">{copy.contributionLabel}</p>
        <div className="bio-room-mobile-card-row">
          {copy.bioBlocks.map((block) => (
            <article key={block.title}>
              <span aria-hidden="true" />
              <h4>{block.title}</h4>
              <p>{block.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bio-room-mobile-panel bio-room-mobile-editorial">
        <div className="bio-room-mobile-columns">
          {copy.editorialColumns.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <blockquote>{copy.editorialQuote}</blockquote>
      </section>

      <section className="bio-room-mobile-panel bio-room-mobile-skills">
        <h3>Habilidades</h3>
        <div className="bio-room-gallery-grid">
          {copy.skillItems.map((item) => (
            <button key={item.title} onClick={() => openGalleryItem(item)} type="button">
              <span className={`bio-room-gallery-thumb bio-room-skill-thumb ${item.accent}`}>
                {item.videoId ? <img alt="" src={getVideoPoster(item)} /> : null}
                <span className="bio-room-skill-thumb-play">▶</span>
              </span>
              <strong>{item.title}</strong>
              <small>{item.videoId ? "Ver video" : item.description}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="bio-room-mobile-panel bio-room-mobile-contact">
        <h3>Contacto</h3>
        <div className="bio-room-contact-links">
          {copy.contactLinks.map((link) => (
            <a href={link.href} key={link.label} rel="noreferrer" target={link.href.startsWith("#") ? undefined : "_blank"}>
              <span>{link.label}</span>
              <small>{link.handle}</small>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
