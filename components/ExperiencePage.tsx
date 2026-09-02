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
import { SECTION_SWAP_MS, useSectionSlider } from "@/lib/useSectionSlider";
import { useBioRoomStore } from "@/lib/useBioRoomStore";

const sceneIds = ["intro", "work", "bio", "services", "contact", "footer"];

export function ExperiencePage() {
  const { activeId, goToId, isTransitioning, transitionKey } = useSectionSlider(sceneIds);
  // La seccion que se esta PINTANDO va un paso atras de la que se pidio: el
  // cambio recien ocurre cuando el velo ya esta en negro. La barra superior
  // sigue usando activeId, asi el click se siente contestado al instante.
  const [paintedId, setPaintedId] = useState(activeId);
  const [language, setLanguage] = useState<Language>("es");
  const copy = siteCopy[language];
  const isOverlayOpen = useBioRoomStore((state) => state.isOverlayOpen);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // La barra superior cambia de alto segun el equipo (en celular pasa a dos
  // filas, y el ancho del idioma varia). Publicamos su alto real en --header-h
  // para que ninguna seccion tenga que adivinarlo y quede tapada.
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;

    const publish = () => {
      const height = Math.round(header.getBoundingClientRect().height);
      if (height > 0) {
        document.documentElement.style.setProperty("--header-h", `${height}px`);
      }
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(header);
    window.addEventListener("resize", publish);
    window.addEventListener("orientationchange", publish);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", publish);
      window.removeEventListener("orientationchange", publish);
    };
  }, []);

  // El cambio de seccion espera a que el velo tape la pantalla. Sin cruce,
  // sin opacidades intermedias: se apaga una y se prende la otra, a oscuras.
  //
  // Las clases se escriben en el DOM DENTRO del temporizador, antes de avisarle
  // a React. Si esperaramos al re-render, el cambio llegaba con hasta 150 ms de
  // atraso y con el velo de 560 ms se escapaba del negro. Escribiendo directo,
  // el cambio cae donde tiene que caer; el estado de React va detras y solo
  // sirve para lo que no es pintura (arrancar y parar los videos, los textos).
  useEffect(() => {
    if (paintedId === activeId) return;

    const t = setTimeout(() => {
      sceneIds.forEach((id) => {
        document.getElementById(id)?.classList.toggle("is-active", id === activeId);
      });
      setPaintedId(activeId);
    }, SECTION_SWAP_MS);

    return () => clearTimeout(t);
  }, [activeId, paintedId]);

  // Red de seguridad: deja las clases en su lugar en la primera pintada y ante
  // cualquier re-render que las hubiera pisado. Es idempotente.
  useEffect(() => {
    sceneIds.forEach((id) => {
      document.getElementById(id)?.classList.toggle("is-active", id === paintedId);
    });
  }, [paintedId]);

  // Sin scroll no hay ScrollTrigger: la entrada de los textos se dispara cada
  // vez que una seccion se vuelve activa.
  //
  // Aca vive el caracter de la pagina. Como el plano de imagen queda quieto
  // (ver .scene en globals.css), el movimiento lo lleva enteramente la
  // tipografia: cada renglon del bloque entra por separado, corrido en el
  // tiempo, subiendo poco y frenando largo. Es el gesto de las casas de alta
  // gama: la foto se sostiene, el texto se posa encima.
  useEffect(() => {
    const section = document.getElementById(paintedId);
    if (!section) return;

    const bloques = Array.from(section.querySelectorAll<HTMLElement>("[data-scene-copy]"));
    // Escalonamos los hijos del bloque (volanta, titulo, bajada, botones) en
    // vez del bloque entero. Si algun bloque viniera vacio, cae al bloque.
    const renglones = bloques.flatMap((b) =>
      b.children.length ? (Array.from(b.children) as HTMLElement[]) : [b],
    );
    const tarjetas = Array.from(section.querySelectorAll<HTMLElement>("[data-depth-card]"));
    const targets = [...renglones, ...tarjetas];
    if (!targets.length) return;

    const titulos = bloques.flatMap((b) =>
      Array.from(b.querySelectorAll<HTMLElement>(":scope > h1, :scope > h2")),
    );

    const tl = gsap.timeline();

    // Los titulos ademas se descubren de abajo hacia arriba, como si salieran
    // de detras de una linea. Es lo que separa una entrada cara de un fundido.
    if (titulos.length) {
      tl.fromTo(
        titulos,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% -14% 0%)",
          duration: 0.78,
          ease: "power4.out",
          stagger: 0.07,
          delay: 0.12,
          overwrite: "auto",
        },
        0,
      );
    }

    tl.fromTo(
      targets,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.72,
        ease: "power4.out",
        stagger: 0.06,
        delay: 0.12,
        overwrite: "auto",
      },
      0,
    );

    // Al cortarla la adelantamos al final en vez de matarla: si se mata a mitad
    // de camino los textos quedan invisibles para siempre.
    return () => {
      tl.progress(1);
      gsap.set(titulos, { clearProps: "clipPath" });
    };
  }, [paintedId]);

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
      <main className={`snap-stage section-stack${isTransitioning ? " is-crossfading" : ""}`}>
        {/* El velo del cruce. Solo existe mientras dura la transicion, asi no
            cuesta nada cuando la pagina esta quieta. La llave lo remonta en
            cada cambio para que la animacion arranque de cero. */}
        {isTransitioning ? (
          <div key={transitionKey} className="section-crossfade-veil" aria-hidden="true" />
        ) : null}
        <HeroScene copy={copy.hero} isActive={paintedId === "intro"} />
        <WorkScene copy={copy.work} isActive={paintedId === "work"} />
        <BioScene copy={copy.bio} isActive={paintedId === "bio"} />
        <PremiumCampaignPlayerSection copy={copy.services} isActive={paintedId === "services"} />
        <ContactScene copy={copy.contact} />
        <FooterScene
          copy={copy.footer}
          isActive={paintedId === "footer"}
          onNavigate={goToId}
          socialLinks={copy.contact.socialLinks}
        />
      </main>
    </>
  );
}
