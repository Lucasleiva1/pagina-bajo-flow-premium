"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { languageOptions, siteCopy, type Language } from "@/data/site";
import { BioScene } from "@/components/BioScene";
import { ContactScene } from "@/components/ContactScene";
import { CraftScene } from "@/components/CraftScene";
import { FooterScene } from "@/components/FooterScene";
import { Header } from "@/components/Header";
import { HeroScene } from "@/components/HeroScene";
import { WorkScene } from "@/components/WorkScene";
import { useActiveScene } from "@/lib/useActiveScene";

const sceneIds = ["intro", "work", "craft", "bio", "contact", "footer"];

export function ExperiencePage() {
  const activeScene = useActiveScene(sceneIds);
  const [language, setLanguage] = useState<Language>("es");
  const copy = siteCopy[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-scene-copy]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 48 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 78%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-depth-card]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 42, rotateX: -8 },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              once: true,
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Header
        activeScene={activeScene}
        copy={copy.header}
        items={copy.navItems}
        language={language}
        languages={languageOptions}
        onLanguageChange={setLanguage}
      />
      <main className="snap-stage">
        <HeroScene copy={copy.hero} />
        <WorkScene copy={copy.work} />
        <CraftScene copy={copy.craft} />
        <BioScene copy={copy.bio} />
        <ContactScene copy={copy.contact} />
        <FooterScene copy={copy.footer} />
      </main>
    </>
  );
}
