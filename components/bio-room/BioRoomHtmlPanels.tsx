"use client";

import Image from "next/image";
import { Html } from "@react-three/drei";
import { useControls, folder } from "leva";
import type { SiteCopy } from "@/data/site";
import { useBioRoomStore } from "@/lib/useBioRoomStore";

type BioRoomHtmlPanelsProps = {
  copy: SiteCopy["bio"];
};

function linkTarget(href: string) {
  return href.startsWith("#") || href.startsWith("mailto:")
    ? undefined
    : "_blank";
}

export function BioRoomHtmlPanels({ copy }: BioRoomHtmlPanelsProps) {
  const activeRoomView = useBioRoomStore((state) => state.activeRoomView);
  const setActiveRoomView = useBioRoomStore((state) => state.setActiveRoomView);
  const openGalleryItem = useBioRoomStore((state) => state.openGalleryItem);

  // Leva controls for panels
  const backWall = useControls("📺 BACK-WALL PANEL", {
    posX: { value: 0, min: -4, max: 4, step: 0.02, label: "X" },
    posY: { value: 1.6, min: 0, max: 3.5, step: 0.02, label: "Y" },
    posZ: { value: -3.48, min: -4, max: 0, step: 0.02, label: "Z" },
    scale: { value: 1.92, min: 0.5, max: 4, step: 0.02, label: "distanceFactor" },
  });

  const bioPanel = useControls("📄 BIO PANEL (Left Wall)", {
    posX: { value: -3.92, min: -5, max: 0, step: 0.02, label: "X" },
    posY: { value: 1.6, min: 0, max: 3.5, step: 0.02, label: "Y" },
    posZ: { value: 0.4, min: -4, max: 4, step: 0.02, label: "Z" },
    scale: { value: 1.18, min: 0.5, max: 3, step: 0.02, label: "distanceFactor" },
  });

  const galleryPanel = useControls("🖼️ GALLERY PANEL (Right Wall)", {
    posX: { value: 3.92, min: 0, max: 5, step: 0.02, label: "X" },
    posY: { value: 1.6, min: 0, max: 3.5, step: 0.02, label: "Y" },
    posZ: { value: 0.4, min: -4, max: 4, step: 0.02, label: "Z" },
    scale: { value: 1.18, min: 0.5, max: 3, step: 0.02, label: "distanceFactor" },
  });

  const labelChip = useControls("🏷️ LUCAS LABEL", {
    posX: { value: 0, min: -4, max: 4, step: 0.02, label: "X" },
    posY: { value: 0.18, min: -1, max: 2, step: 0.02, label: "Y" },
    posZ: { value: 1.3, min: -2, max: 4, step: 0.02, label: "Z" },
    scale: { value: 1.08, min: 0.5, max: 2, step: 0.02, label: "distanceFactor" },
  });

  return (
    <>
      {/* ──────── BACK WALL — full wall panel, content around character ──────── */}
      <Html
        className={`bio-room-html bio-room-front-wall${
          activeRoomView === "home" || activeRoomView === "contact"
            ? " is-active"
            : ""
        }`}
        distanceFactor={backWall.scale}
        occlude="blending"
        position={[backWall.posX, backWall.posY, backWall.posZ]}
        transform
      >
        <div className="bio-room-wall-full">
          {/* ── TOP STRIP — Title + Subtitle ── */}
          <header className="bio-room-wall-top">
            <div className="bio-room-wall-top-inner">
              <p className="bio-room-kicker">{copy.kicker}</p>
              <h2>BAJO FLOW</h2>
              <p className="bio-room-subtitle">{copy.identitySubtitle}</p>
            </div>
          </header>

          {/* ── MIDDLE — Left info | CENTER GAP (person) | Right info ── */}
          <div className="bio-room-wall-middle">
            {/* Left column — description + statement */}
            <div className="bio-room-wall-col bio-room-wall-col-left">
              <div className="bio-room-wall-statement">
                <p className="bio-room-wall-big-text">
                  {copy.paragraphs[0]}
                </p>
                <p className="bio-room-wall-body">
                  {copy.paragraphs[1]}
                </p>
              </div>
            </div>

            {/* Center gap — character shows through here */}
            <div className="bio-room-wall-center-gap" aria-hidden="true" />

            {/* Right column — contact links */}
            <div className="bio-room-wall-col bio-room-wall-col-right">
              <div className="bio-room-wall-contact-grid">
                {copy.contactLinks.map((link) => (
                  <a
                    href={link.href}
                    key={link.label}
                    rel="noreferrer"
                    target={linkTarget(link.href)}
                  >
                    <span>{link.label}</span>
                    <small>{link.handle}</small>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── BOTTOM STRIP — Tools / Skills ── */}
          <footer className="bio-room-wall-bottom">
            <div className="bio-room-wall-skills">
              <span className="bio-room-wall-skills-label">Skills &amp; Expertise</span>
              <div className="bio-room-wall-tools">
                {copy.tools.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
            </div>
          </footer>

          {/* Inner border frame */}
          <div className="bio-room-wall-frame" aria-hidden="true" />
        </div>
      </Html>

      {/* ──────── LEFT WALL — bio (character's right side) ──────── */}
      <Html
        className={`bio-room-html bio-room-side-wall bio-room-character-right-wall${
          activeRoomView === "bio" ? " is-active" : ""
        }`}
        distanceFactor={bioPanel.scale}
        occlude="blending"
        position={[bioPanel.posX, bioPanel.posY, bioPanel.posZ]}
        rotation={[0, Math.PI / 2, 0]}
        transform
      >
        <div className="bio-room-panel bio-room-panel-bio">
          <p className="bio-room-kicker">Biografía</p>
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

      {/* ──────── RIGHT WALL — gallery (character's left side) ──────── */}
      <Html
        className={`bio-room-html bio-room-side-wall bio-room-character-left-wall${
          activeRoomView === "gallery" ? " is-active" : ""
        }`}
        distanceFactor={galleryPanel.scale}
        occlude="blending"
        position={[galleryPanel.posX, galleryPanel.posY, galleryPanel.posZ]}
        rotation={[0, -Math.PI / 2, 0]}
        transform
      >
        <div className="bio-room-panel bio-room-panel-gallery">
          <p className="bio-room-kicker">Galería visual</p>
          <h3>Trabajos</h3>
          <div className="bio-room-gallery-grid">
            {copy.galleryItems.map((item) => (
              <button
                key={item.title}
                onClick={() => openGalleryItem(item)}
                type="button"
              >
                <span className="bio-room-gallery-thumb">
                  <Image
                    alt={item.title}
                    fill
                    loading="lazy"
                    sizes="220px"
                    src={item.image}
                  />
                </span>
                <strong>{item.title}</strong>
                <small>{item.category}</small>
              </button>
            ))}
          </div>
        </div>
      </Html>

      {/* ──────── Character label chip ──────── */}
      <Html
        className="bio-room-html bio-room-person-label"
        distanceFactor={labelChip.scale}
        position={[labelChip.posX, labelChip.posY, labelChip.posZ]}
        transform
      >
        <button
          className="bio-room-center-chip"
          onClick={() => setActiveRoomView("home")}
          type="button"
        >
          Lucas Leiva
        </button>
      </Html>
    </>
  );
}
