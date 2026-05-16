"use client";

import Image from "next/image";
import { Html } from "@react-three/drei";
import type { SiteCopy } from "@/data/site";
import { useBioRoomStore } from "@/lib/useBioRoomStore";

type BioRoomHtmlPanelsProps = {
  copy: SiteCopy["bio"];
};

function linkTarget(href: string) {
  return href.startsWith("#") || href.startsWith("mailto:") ? undefined : "_blank";
}

export function BioRoomHtmlPanels({ copy }: BioRoomHtmlPanelsProps) {
  const activeRoomView = useBioRoomStore((state) => state.activeRoomView);
  const setActiveRoomView = useBioRoomStore((state) => state.setActiveRoomView);
  const openGalleryItem = useBioRoomStore((state) => state.openGalleryItem);

  return (
    <>
      <Html
        className={`bio-room-html bio-room-front-wall${activeRoomView === "home" || activeRoomView === "contact" ? " is-active" : ""}`}
        distanceFactor={1.18}
        position={[-1.34, 1.63, -3.47]}
        transform
      >
        <div className="bio-room-panel bio-room-panel-front">
          <p className="bio-room-kicker">{copy.kicker}</p>
          <h2>BAJO FLOW</h2>
          <p className="bio-room-subtitle">{copy.identitySubtitle}</p>
          <div className="bio-room-contact-links">
            {copy.contactLinks.map((link) => (
              <a href={link.href} key={link.label} rel="noreferrer" target={linkTarget(link.href)}>
                <span>{link.label}</span>
                <small>{link.handle}</small>
              </a>
            ))}
          </div>
          <div className="bio-room-tools" aria-label="Bajo Flow tools">
            {copy.tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </div>
      </Html>

      <Html
        className={`bio-room-html bio-room-side-wall bio-room-character-right-wall${activeRoomView === "bio" ? " is-active" : ""}`}
        distanceFactor={1.08}
        position={[-3.58, 1.56, -1.36]}
        rotation={[0, Math.PI / 2, 0]}
        transform
      >
        <div className="bio-room-panel bio-room-panel-bio">
          <p className="bio-room-kicker">characterRightWall</p>
          <h3>{copy.title}</h3>
          <div className="bio-room-bio-grid">
            {copy.bioBlocks.map((block) => (
              <article key={block.title}>
                <span />
                <h4>{block.title}</h4>
                <p>{block.text}</p>
              </article>
            ))}
          </div>
        </div>
      </Html>

      <Html
        className={`bio-room-html bio-room-side-wall bio-room-character-left-wall${activeRoomView === "gallery" ? " is-active" : ""}`}
        distanceFactor={1.08}
        position={[3.58, 1.56, -1.36]}
        rotation={[0, -Math.PI / 2, 0]}
        transform
      >
        <div className="bio-room-panel bio-room-panel-gallery">
          <p className="bio-room-kicker">characterLeftWall</p>
          <h3>Visual gallery</h3>
          <div className="bio-room-gallery-grid">
            {copy.galleryItems.map((item) => (
              <button key={item.title} onClick={() => openGalleryItem(item)} type="button">
                <span className="bio-room-gallery-thumb">
                  <Image alt={item.title} fill loading="lazy" sizes="220px" src={item.image} />
                </span>
                <strong>{item.title}</strong>
                <small>{item.category}</small>
              </button>
            ))}
          </div>
        </div>
      </Html>

      <Html className="bio-room-html bio-room-person-label" distanceFactor={1.08} position={[0, 0.18, -0.12]} transform>
        <button className="bio-room-center-chip" onClick={() => setActiveRoomView("home")} type="button">
          Lucas Leiva
        </button>
      </Html>
    </>
  );
}
