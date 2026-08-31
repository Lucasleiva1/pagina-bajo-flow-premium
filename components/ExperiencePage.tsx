"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { languageOptions, siteCopy, type Language } from "@/data/site";
import { BioScene } from "@/components/BioScene";
import { ContactScene } from "@/components/ContactScene";
import { FooterScene } from "@/components/FooterScene";
import { Header } from "@/components/Header";
import { HeroScene } from "@/components/HeroScene";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PremiumCampaignPlayerSection } from "@/components/PremiumCampaignPlayerSection";
import { WorkScene } from "@/components/WorkScene";
import { useSectionSlider } from "@/lib/useSectionSlider";
import { useBioRoomStore } from "@/lib/useBioRoomStore";

const sceneIds = ["intro", "work", "bio", "services", "contact", "footer"];

export function ExperiencePage() {
  const { activeId, goToId } = useSectionSlider(sceneIds);
  const [language, setLanguage] = useState<Language>("es");
  const copy = siteCopy[language];
  const isOverlayOpen = useBioRoomStore((state) => state.isOverlayOpen);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Marcamos la seccion activa sobre los <section> que ya existen, sin envolver
  // nada: cambiar la estructura del DOM es justo lo que rompe la sala 3D.
  useEffect(() => {
    sceneIds.forEach((id) => {
      document.getElementById(id)?.classList.toggle("is-active", id === activeId);
    });
  }, [activeId]);

  // Sin scroll no hay ScrollTrigger: la entrada de los textos se dispara la
  // primera vez que cada seccion se vuelve activa.
  useEffect(() => {
    const section = document.getElementById(activeId);
    if (!section) return;

    const targets = section.querySelectorAll<HTMLElement>("[data-scene-copy], [data-depth-card]");
    if (!targets.length) return;

    const animation = gsap.fromTo(
      targets,
      { autoAlpha: 0, y: 42 },
      { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.2, overwrite: "auto" },
    );

    // Al cortarla la adelantamos al final en vez de matarla: si se mata a mitad
    // de camino los textos quedan invisibles para siempre.
    return () => {
      animation.progress(1);
    };
  }, [activeId]);

  return (
    <>
      <LoadingScreen />
      <Header
        activeScene={activeId}
        copy={copy.header}
        items={copy.navItems}
        language={language}
        languages={languageOptions}
        onLanguageChange={setLanguage}
        onNavigate={goToId}
        isHidden={isOverlayOpen}
      />
      <main className="snap-stage section-stack">
        <HeroScene copy={copy.hero} isActive={activeId === "intro"} />
        <WorkScene copy={copy.work} isActive={activeId === "work"} />
        <BioScene copy={copy.bio} isActive={activeId === "bio"} />
        <PremiumCampaignPlayerSection copy={copy.services} isActive={activeId === "services"} />
        <ContactScene copy={copy.contact} />
        <FooterScene copy={copy.footer} />
      </main>
    </>
  );
}
