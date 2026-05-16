"use client";

import Image from "next/image";
import type { SiteCopy } from "@/data/site";
import { useBioRoomStore } from "@/lib/useBioRoomStore";

type BioRoomMobilePanelsProps = {
  copy: SiteCopy["bio"];
};

export function BioRoomMobilePanels({ copy }: BioRoomMobilePanelsProps) {
  const openGalleryItem = useBioRoomStore((state) => state.openGalleryItem);

  return (
    <div className="bio-room-mobile">
      <div className="bio-room-mobile-portrait">
        <Image
          alt="Lucas Leiva"
          fill
          priority
          sizes="(max-width: 860px) 76vw, 320px"
          src="/assets/bio-room/lucas-fullbody-cutout.png"
        />
      </div>

      <section className="bio-room-mobile-panel">
        <p className="bio-room-kicker">{copy.kicker}</p>
        <h2>BAJO FLOW</h2>
        <p>{copy.identitySubtitle}</p>
        <div className="bio-room-tools">
          {copy.tools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
      </section>

      <section className="bio-room-mobile-panel">
        <h3>{copy.title}</h3>
        {copy.bioBlocks.map((block) => (
          <article key={block.title}>
            <h4>{block.title}</h4>
            <p>{block.text}</p>
          </article>
        ))}
      </section>

      <section className="bio-room-mobile-panel">
        <h3>Visual gallery</h3>
        <div className="bio-room-gallery-grid">
          {copy.galleryItems.map((item) => (
            <button key={item.title} onClick={() => openGalleryItem(item)} type="button">
              <span className="bio-room-gallery-thumb">
                <Image alt={item.title} fill loading="lazy" sizes="44vw" src={item.image} />
              </span>
              <strong>{item.title}</strong>
              <small>{item.category}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="bio-room-mobile-panel">
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
