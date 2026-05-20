export type Language = "es" | "en" | "pt";

export const languageOptions: Array<{ code: Language; label: string }> = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
];

const baseSocialLinks = [
  {
    label: "YouTube",
    handle: "@bajoflow",
    href: "https://www.youtube.com/@bajoflow",
    icon: "play",
  },
  {
    label: "Instagram",
    handle: "@lucasleivafabian",
    href: "https://www.instagram.com/lucasleivafabian",
    icon: "frame",
  },
  {
    label: "Facebook",
    handle: "/bajoflow",
    href: "https://www.facebook.com/bajoflow",
    icon: "dot",
  },
  {
    label: "TikTok",
    handle: "@lucasleiva444",
    href: "https://www.tiktok.com/@lucasleiva444",
    icon: "bolt",
  },
];

export const siteCopy = {
  es: {
    header: {
      brandAria: "Bajo Flow inicio",
      navAria: "Navegación principal",
      languageAria: "Cambiar idioma",
      languageLabel: "Idioma",
    },
    navItems: [
      { label: "Inicio", href: "#intro" },
      { label: "Trabajos", href: "#work" },
      { label: "Bio", href: "#bio" },
      { label: "Servicios", href: "#services" },
      { label: "Contacto", href: "#contact" },
    ],
    hero: {
      sideRail: "scroll para explorar",
      kicker: "Lucas Leiva / Editor audiovisual",
      title: "Contenido de alto impacto visual",
      lead:
        "Edición dinámica, color cinematográfico, audio cuidado y piezas con presencia para YouTube, redes, marcas e institucionales.",
      primaryAction: "Ver trabajos",
      secondaryAction: "Contactar",
    },
    work: {
      kicker: "Trabajos seleccionados",
      title: "Historias editadas a la perfección",
      previous: "Trabajo anterior",
      next: "Trabajo siguiente",
      progress: "Progreso de trabajos",
      projectAria: "Proyecto",
      toolsAria: "Herramientas",
      viewCase: "Ver en YouTube",
      viewProject: "Ver",
      projects: [
        {
          title: "YouTube Launch",
          category: "Contenido principal",
          runtime: "Formato vertical / horizontal",
          description:
            "Proyecto base para un video principal: narrativa, ritmo, retención, color y entrega lista para publicar.",
          tools: ["DaV", "Color", "Fair", "Cut", "AI"],
          video: "/assets/video_center.mp4",
          href: "https://www.youtube.com/@bajoflow",
        },
        {
          title: "Social Impact",
          category: "Redes sociales",
          runtime: "Shorts / Reels / TikTok",
          description:
            "Piezas cortas para captar atención rápido: cortes precisos, subtítulos, energía y foco en retención.",
          tools: ["Cut", "Sub", "Sound", "Color"],
          video: "/assets/video_left.mp4",
          href: "https://www.youtube.com/@bajoflow",
        },
        {
          title: "Brand Film",
          category: "Marca / institucional",
          runtime: "Campaña / Institucional",
          description:
            "Videos para marca o institución con tono profesional, atmósfera cuidada, audio limpio y entrega final sólida.",
          tools: ["DaV", "Fair", "Grade", "Mix"],
          video: "/assets/video_right.mp4",
          href: "https://www.youtube.com/@bajoflow",
        },
      ],
    },
    bio: {
      kicker: "Bio",
      title: "La edicion como lenguaje visual.",
      identitySubtitle: "Editor audiovisual enfocado en ritmo, color, sonido e impacto.",
      editorialNav: ["Bio", "Postproduccion", "Color", "Sonido"],
      backgroundWords: ["Ritmo", "Color", "Sonido"],
      editorialIntro: {
        prefix: "Soy",
        name: "Lucas Leiva",
        suffix:
          "editor audiovisual enfocado en transformar piezas visuales en experiencias con ritmo, intencion y acabado profesional.",
      },
      editorialColumns: [
        "Trabajo la edicion como una construccion narrativa: cada corte, cada pausa y cada decision visual tienen que empujar la emocion de la pieza.",
        "Mi enfoque combina montaje, color, sonido y criterio estetico para lograr piezas solidas, fluidas y cinematograficas.",
      ],
      editorialQuote: "No edito solo para ordenar imagenes: edito para construir impacto.",
      contributionLabel: "Lo que aporto",
      paragraphs: [
        "Trabajo la edicion como una construccion narrativa: cada corte, cada pausa y cada decision visual tienen que empujar la emocion de la pieza.",
        "Mi enfoque combina montaje, color, sonido y criterio estetico para lograr piezas solidas, fluidas y cinematograficas.",
      ],
      frontParagraphs: [
        "Trabajo cada proyecto desde el ritmo, la atmósfera y la emoción para que cada corte tenga una razón.",
        "Bajo Flow nace para crear contenido con identidad: videos para YouTube, redes sociales, marcas e institucionales.",
      ],
      tags: ["Edición dinámica", "Color grading", "Postproducción de audio", "Versatilidad"],
      roomControls: [
        { label: "Inicio", view: "home" },
        { label: "Bio", view: "bio" },
        { label: "Habilidades", view: "gallery" },
        { label: "Contacto", view: "contact" },
      ],
      contactLinks: [
        { label: "Instagram", handle: "@lucasleivafabian", href: "https://www.instagram.com/lucasleivafabian" },
        { label: "TikTok", handle: "@lucasleiva444", href: "https://www.tiktok.com/@lucasleiva444" },
        { label: "YouTube", handle: "@bajoflow", href: "https://www.youtube.com/@bajoflow" },
        { label: "Facebook", handle: "/bajoflow", href: "https://www.facebook.com/bajoflow" },
        { label: "Mail", handle: "Contacto", href: "mailto:contacto@bajoflow.com" },
        { label: "Portfolio", handle: "Ver piezas", href: "#work" },
      ],
      tools: [
        "DaVinci Resolve",
        "Fusion",
        "Blender",
        "Photoshop",
        "IA visual",
        "Color correction",
        "Sound design",
        "Motion graphics",
        "Storytelling",
        "Reels/Shorts/Ads",
      ],
      bioBlocks: [
        {
          title: "Narrativa",
          text: "Ritmo, tension y direccion visual.",
        },
        {
          title: "Color",
          text: "Atmosfera, contraste e identidad.",
        },
        {
          title: "Sonido",
          text: "Limpieza, mezcla y presencia.",
        },
        {
          title: "Versatilidad",
          text: "Reels, videoclips y contenido de marca.",
        },
      ],
      skillItems: [
        {
          title: "Corrección y Tratamiento de Color",
          description: "Aplico técnicas profesionales de colorización en DaVinci Resolve.",
          accent: "blue",
          poster: "/images/skills/color.jpg",
          videoId: "POrDJhEuTSM",
          videoTitle: "Cinematográfico Secreto: Crea un Color Gradiente Épico en DaVinci Resolve",
        },
        {
          title: "Edición y Diseño de Sonido",
          description: "Trabajo el sonido con precisión para que cada proyecto tenga identidad propia.",
          accent: "cyan",
          poster: "/images/skills/sound.jpg",
          videoId: "JlxFvORQOa0",
          videoTitle: "El Secreto para Mezclas Impecables en DaVinci Resolve (Fairlight)",
        },
        {
          title: "Motion Graphics en Fusion",
          description: "Creo animaciones dinámicas, limpias y modernas usando Fusion.",
          accent: "violet",
          poster: "/images/skills/fusion.jpg",
          videoId: "fhYi33V2uf8",
          videoTitle: "Animación Avanzada con Fusion",
        },
      ],
    },
    services: {
      kicker: "Servicios audiovisuales",
      title: "Produccion visual para piezas que venden, conectan y se recuerdan.",
      lead:
        "Un panel de servicios pensado como sala de control: estrategia, ritmo, color, sonido y entrega final para cada formato.",
      screenLabel: "Pantalla activa",
      cardLabel: "Seleccionar servicio",
      cta: "Ver enfoque",
      sideRailLeft: "servicios audiovisuales",
      sideRailRight: "creamos historias que conectan",
      status: "Disponible para proyectos",
      services: [
        {
          title: "YouTube & Video Largo",
          eyebrow: "Contenido principal",
          headline: "Narrativa con ritmo de retencion.",
          description:
            "Edicion profesional para videos largos: estructura, cortes, B-roll, audio, titulos y color para sostener la atencion.",
          meta: "Formato horizontal / 4K / narrativa",
          cardImage: "/images/services/cards/service-01.png",
          screenImage: "/images/services/screens/service-01.png",
        },
        {
          title: "Reels & Shorts",
          eyebrow: "Formato vertical",
          headline: "Impacto en segundos.",
          description:
            "Piezas verticales para Instagram, TikTok y YouTube Shorts con ritmo, subtitulos, energia visual y cierre memorable.",
          meta: "9:16 / social / retencion",
          cardImage: "/images/services/cards/service-02.png",
          screenImage: "/images/services/screens/service-02.png",
        },
        {
          title: "Postproduccion",
          eyebrow: "Color y sonido",
          headline: "Acabado tecnico con identidad.",
          description:
            "Correccion de color, mezcla de audio, limpieza, atmosferas y pulido final para que cada pieza se sienta terminada.",
          meta: "DaVinci / Fairlight / color",
          cardImage: "/images/services/cards/service-03.png",
          screenImage: "/images/services/screens/service-03.png",
        },
        {
          title: "Ads & Contenido Comercial",
          eyebrow: "Marca y conversion",
          headline: "Presencia que impacta.",
          description:
            "Videos para marcas, lanzamientos, productos y campanas con foco en claridad, deseo visual y mensaje directo.",
          meta: "Ads / producto / campana",
          cardImage: "/images/services/cards/service-04.png",
          screenImage: "/images/services/screens/service-04.png",
        },
        {
          title: "Motion & Visual Design",
          eyebrow: "Motion graphics",
          headline: "Interfaces, titulos y movimiento.",
          description:
            "Animaciones, overlays, graficas, composicion y recursos visuales para elevar la identidad audiovisual de cada proyecto.",
          meta: "Fusion / grafica / visual design",
          cardImage: "/images/services/cards/service-05.png",
          screenImage: "/images/services/screens/service-05.png",
        },
      ],
    },
    contact: {
      kicker: "Contacto",
      title: "Hagamos que tu pieza se sienta de cine.",
      text:
        "Si querés que tu contenido tenga ritmo, imagen, sonido y presencia, escribime por la red que uses.",
      socialLinks: baseSocialLinks,
    },
    footer: {
      kicker: "Bajo Flow",
      title: "Edición, color, audio y dirección visual para piezas que se sienten grandes.",
      location: "Lucas Leiva - Buenos Aires",
    },
  },
  en: {
    header: {
      brandAria: "Bajo Flow home",
      navAria: "Main navigation",
      languageAria: "Change language",
      languageLabel: "Language",
    },
    navItems: [
      { label: "Intro", href: "#intro" },
      { label: "Work", href: "#work" },
      { label: "Bio", href: "#bio" },
      { label: "Services", href: "#services" },
      { label: "Contact", href: "#contact" },
    ],
    hero: {
      sideRail: "scroll to explore",
      kicker: "Lucas Leiva / Audiovisual editor",
      title: "High-impact visual content",
      lead:
        "Dynamic editing, cinematic color, polished audio, and pieces with presence for YouTube, social media, brands, and institutions.",
      primaryAction: "View work",
      secondaryAction: "Contact",
    },
    work: {
      kicker: "Selected work",
      title: "Stories, Cut to Perfection",
      previous: "Previous work",
      next: "Next work",
      progress: "Work progress",
      projectAria: "Project",
      toolsAria: "Tools",
      viewCase: "Watch on YouTube",
      viewProject: "View",
      projects: [
        {
          title: "YouTube Launch",
          category: "Main content",
          runtime: "Vertical / horizontal format",
          description:
            "Base project for a main video: narrative, rhythm, retention, color, and final delivery ready to publish.",
          tools: ["DaV", "Color", "Fair", "Cut", "AI"],
          video: "/assets/video_center.mp4",
          href: "https://www.youtube.com/@bajoflow",
        },
        {
          title: "Social Impact",
          category: "Social media",
          runtime: "Shorts / Reels / TikTok",
          description:
            "Short pieces built to catch attention fast: precise cuts, subtitles, energy, and retention-focused pacing.",
          tools: ["Cut", "Sub", "Sound", "Color"],
          video: "/assets/video_left.mp4",
          href: "https://www.youtube.com/@bajoflow",
        },
        {
          title: "Brand Film",
          category: "Brand / institutional",
          runtime: "Campaign / Institutional",
          description:
            "Videos for brands or institutions with a professional tone, crafted atmosphere, clean audio, and solid final delivery.",
          tools: ["DaV", "Fair", "Grade", "Mix"],
          video: "/assets/video_right.mp4",
          href: "https://www.youtube.com/@bajoflow",
        },
      ],
    },
    bio: {
      kicker: "Bio",
      title: "Editing as a visual language.",
      identitySubtitle: "Audiovisual editor focused on rhythm, color, sound, and impact.",
      editorialNav: ["Bio", "Post-production", "Color", "Sound"],
      backgroundWords: ["Rhythm", "Color", "Sound"],
      editorialIntro: {
        prefix: "I am",
        name: "Lucas Leiva",
        suffix:
          "an audiovisual editor focused on transforming visual pieces into experiences with rhythm, intention, and a professional finish.",
      },
      editorialColumns: [
        "I treat editing as narrative construction: every cut, pause, and visual decision has to push the emotion of the piece.",
        "My approach combines montage, color, sound, and aesthetic judgment to create solid, fluid, cinematic work.",
      ],
      editorialQuote: "I do not edit just to arrange images: I edit to build impact.",
      contributionLabel: "What I bring",
      paragraphs: [
        "I treat editing as narrative construction: every cut, pause, and visual decision has to push the emotion of the piece.",
        "My approach combines montage, color, sound, and aesthetic judgment to create solid, fluid, cinematic work.",
      ],
      frontParagraphs: [
        "I approach every project through rhythm, atmosphere, and emotion so every cut has a reason.",
        "Bajo Flow was created to build content with identity: videos for YouTube, social media, brands, and institutions.",
      ],
      tags: ["Video editing", "Color grading", "Post audio", "Social media", "Institutional"],
      roomControls: [
        { label: "Home", view: "home" },
        { label: "Bio", view: "bio" },
        { label: "Skills", view: "gallery" },
        { label: "Contact", view: "contact" },
      ],
      contactLinks: [
        { label: "Instagram", handle: "@lucasleivafabian", href: "https://www.instagram.com/lucasleivafabian" },
        { label: "TikTok", handle: "@lucasleiva444", href: "https://www.tiktok.com/@lucasleiva444" },
        { label: "YouTube", handle: "@bajoflow", href: "https://www.youtube.com/@bajoflow" },
        { label: "Facebook", handle: "/bajoflow", href: "https://www.facebook.com/bajoflow" },
        { label: "Mail", handle: "Contact", href: "mailto:contacto@bajoflow.com" },
        { label: "Portfolio", handle: "View work", href: "#work" },
      ],
      tools: [
        "DaVinci Resolve",
        "Fusion",
        "Blender",
        "Photoshop",
        "Visual AI",
        "Color correction",
        "Sound design",
        "Motion graphics",
        "Storytelling",
        "Reels/Shorts/Ads",
      ],
      bioBlocks: [
        {
          title: "Narrative",
          text: "Rhythm, tension, and visual direction.",
        },
        {
          title: "Color",
          text: "Atmosphere, contrast, and identity.",
        },
        {
          title: "Sound",
          text: "Cleanliness, mix, and presence.",
        },
        {
          title: "Versatility",
          text: "Reels, music videos, and branded content.",
        },
      ],
      skillItems: [
        {
          title: "Color Correction and Treatment",
          description: "I apply professional color techniques in DaVinci Resolve.",
          accent: "blue",
          poster: "/images/skills/color.jpg",
          videoId: "POrDJhEuTSM",
          videoTitle: "Cinematográfico Secreto: Crea un Color Gradiente Épico en DaVinci Resolve",
        },
        {
          title: "Sound Editing and Design",
          description: "I shape sound with precision so every project has its own identity.",
          accent: "cyan",
          poster: "/images/skills/sound.jpg",
          videoId: "JlxFvORQOa0",
          videoTitle: "El Secreto para Mezclas Impecables en DaVinci Resolve (Fairlight)",
        },
        {
          title: "Motion Graphics in Fusion",
          description: "I create dynamic, clean, modern animations using Fusion.",
          accent: "violet",
          poster: "/images/skills/fusion.jpg",
          videoId: "fhYi33V2uf8",
          videoTitle: "Animación Avanzada con Fusion",
        },
      ],
    },
    services: {
      kicker: "Audiovisual services",
      title: "Visual production for pieces that sell, connect, and stay memorable.",
      lead:
        "A services panel designed like a control room: strategy, pacing, color, sound, and final delivery for each format.",
      screenLabel: "Active screen",
      cardLabel: "Select service",
      cta: "View approach",
      sideRailLeft: "audiovisual services",
      sideRailRight: "we create stories that connect",
      status: "Available for projects",
      services: [
        {
          title: "YouTube & Long-Form Video",
          eyebrow: "Main content",
          headline: "Storytelling built for retention.",
          description:
            "Professional editing for long-form videos: structure, cuts, B-roll, audio, titles, and color to hold attention.",
          meta: "Horizontal / 4K / narrative",
          cardImage: "/images/services/cards/service-01.png",
          screenImage: "/images/services/screens/service-01.png",
        },
        {
          title: "Reels & Shorts",
          eyebrow: "Vertical format",
          headline: "Impact in seconds.",
          description:
            "Vertical pieces for Instagram, TikTok, and YouTube Shorts with rhythm, subtitles, visual energy, and memorable endings.",
          meta: "9:16 / social / retention",
          cardImage: "/images/services/cards/service-02.png",
          screenImage: "/images/services/screens/service-02.png",
        },
        {
          title: "Postproduction",
          eyebrow: "Color and sound",
          headline: "Technical finish with identity.",
          description:
            "Color correction, audio mix, cleanup, atmosphere, and final polish so every piece feels complete.",
          meta: "DaVinci / Fairlight / color",
          cardImage: "/images/services/cards/service-03.png",
          screenImage: "/images/services/screens/service-03.png",
        },
        {
          title: "Ads & Commercial Content",
          eyebrow: "Brand and conversion",
          headline: "Presence that lands.",
          description:
            "Videos for brands, launches, products, and campaigns focused on clarity, visual desire, and direct messaging.",
          meta: "Ads / product / campaign",
          cardImage: "/images/services/cards/service-04.png",
          screenImage: "/images/services/screens/service-04.png",
        },
        {
          title: "Motion & Visual Design",
          eyebrow: "Motion graphics",
          headline: "Interfaces, titles, and movement.",
          description:
            "Animations, overlays, graphics, compositing, and visual assets that elevate each project's audiovisual identity.",
          meta: "Fusion / graphics / visual design",
          cardImage: "/images/services/cards/service-05.png",
          screenImage: "/images/services/screens/service-05.png",
        },
      ],
    },
    contact: {
      kicker: "Contact",
      title: "Let us make your piece feel cinematic.",
      text:
        "If you want your content to have rhythm, image, sound, and presence, write to me on the network you use.",
      socialLinks: baseSocialLinks,
    },
    footer: {
      kicker: "Bajo Flow",
      title: "Editing, color, audio, and visual direction for pieces that feel big.",
      location: "Lucas Leiva - Buenos Aires",
    },
  },
  pt: {
    header: {
      brandAria: "Bajo Flow início",
      navAria: "Navegação principal",
      languageAria: "Alterar idioma",
      languageLabel: "Idioma",
    },
    navItems: [
      { label: "Início", href: "#intro" },
      { label: "Trabalhos", href: "#work" },
      { label: "Bio", href: "#bio" },
      { label: "Servicos", href: "#services" },
      { label: "Contato", href: "#contact" },
    ],
    hero: {
      sideRail: "role para explorar",
      kicker: "Lucas Leiva / Editor audiovisual",
      title: "Conteúdo visual de alto impacto",
      lead:
        "Edição dinâmica, cor cinematográfica, áudio cuidado e peças com presença para YouTube, redes, marcas e institucionais.",
      primaryAction: "Ver trabalhos",
      secondaryAction: "Contato",
    },
    work: {
      kicker: "Trabalhos selecionados",
      title: "Histórias editadas com precisão",
      previous: "Trabalho anterior",
      next: "Próximo trabalho",
      progress: "Progresso dos trabalhos",
      projectAria: "Projeto",
      toolsAria: "Ferramentas",
      viewCase: "Ver no YouTube",
      viewProject: "Ver",
      projects: [
        {
          title: "YouTube Launch",
          category: "Conteúdo principal",
          runtime: "Formato vertical / horizontal",
          description:
            "Projeto base para um vídeo principal: narrativa, ritmo, retenção, cor e entrega pronta para publicar.",
          tools: ["DaV", "Color", "Fair", "Cut", "AI"],
          video: "/assets/video_center.mp4",
          href: "https://www.youtube.com/@bajoflow",
        },
        {
          title: "Social Impact",
          category: "Redes sociais",
          runtime: "Shorts / Reels / TikTok",
          description:
            "Peças curtas para captar atenção rápido: cortes precisos, legendas, energia e foco em retenção.",
          tools: ["Cut", "Sub", "Sound", "Color"],
          video: "/assets/video_left.mp4",
          href: "https://www.youtube.com/@bajoflow",
        },
        {
          title: "Brand Film",
          category: "Marca / institucional",
          runtime: "Campanha / Institucional",
          description:
            "Vídeos para marca ou instituição com tom profissional, atmosfera cuidada, áudio limpo e entrega final sólida.",
          tools: ["DaV", "Fair", "Grade", "Mix"],
          video: "/assets/video_right.mp4",
          href: "https://www.youtube.com/@bajoflow",
        },
      ],
    },
    bio: {
      kicker: "Bio",
      title: "A edicao como linguagem visual.",
      identitySubtitle: "Editor audiovisual focado em ritmo, cor, som e impacto.",
      editorialNav: ["Bio", "Pos-producao", "Cor", "Som"],
      backgroundWords: ["Ritmo", "Cor", "Som"],
      editorialIntro: {
        prefix: "Sou",
        name: "Lucas Leiva",
        suffix:
          "editor audiovisual focado em transformar pecas visuais em experiencias com ritmo, intencao e acabamento profissional.",
      },
      editorialColumns: [
        "Trabalho a edicao como uma construcao narrativa: cada corte, pausa e decisao visual precisa empurrar a emocao da peca.",
        "Meu enfoque combina montagem, cor, som e criterio estetico para criar pecas solidas, fluidas e cinematograficas.",
      ],
      editorialQuote: "Nao edito so para ordenar imagens: edito para construir impacto.",
      contributionLabel: "O que aporto",
      paragraphs: [
        "Trabalho a edicao como uma construcao narrativa: cada corte, pausa e decisao visual precisa empurrar a emocao da peca.",
        "Meu enfoque combina montagem, cor, som e criterio estetico para criar pecas solidas, fluidas e cinematograficas.",
      ],
      frontParagraphs: [
        "Trabalho cada projeto a partir do ritmo, da atmosfera e da emoção para que cada corte tenha uma razão.",
        "Bajo Flow nasce para criar conteúdo com identidade: vídeos para YouTube, redes sociais, marcas e institucionais.",
      ],
      tags: ["Edição de vídeo", "Cor", "Pós-áudio", "Redes sociais", "Institucionais"],
      roomControls: [
        { label: "Início", view: "home" },
        { label: "Bio", view: "bio" },
        { label: "Habilidades", view: "gallery" },
        { label: "Contato", view: "contact" },
      ],
      contactLinks: [
        { label: "Instagram", handle: "@lucasleivafabian", href: "https://www.instagram.com/lucasleivafabian" },
        { label: "TikTok", handle: "@lucasleiva444", href: "https://www.tiktok.com/@lucasleiva444" },
        { label: "YouTube", handle: "@bajoflow", href: "https://www.youtube.com/@bajoflow" },
        { label: "Facebook", handle: "/bajoflow", href: "https://www.facebook.com/bajoflow" },
        { label: "Mail", handle: "Contato", href: "mailto:contacto@bajoflow.com" },
        { label: "Portfolio", handle: "Ver peças", href: "#work" },
      ],
      tools: [
        "DaVinci Resolve",
        "Fusion",
        "Blender",
        "Photoshop",
        "IA visual",
        "Color correction",
        "Sound design",
        "Motion graphics",
        "Storytelling",
        "Reels/Shorts/Ads",
      ],
      bioBlocks: [
        {
          title: "Narrativa",
          text: "Ritmo, tensao e direcao visual.",
        },
        {
          title: "Cor",
          text: "Atmosfera, contraste e identidade.",
        },
        {
          title: "Som",
          text: "Limpeza, mixagem e presenca.",
        },
        {
          title: "Versatilidade",
          text: "Reels, videoclipes e conteudo de marca.",
        },
      ],
      skillItems: [
        {
          title: "Correção e Tratamento de Cor",
          description: "Aplico técnicas profissionais de colorização no DaVinci Resolve.",
          accent: "blue",
          poster: "/images/skills/color.jpg",
          videoId: "POrDJhEuTSM",
          videoTitle: "Cinematográfico Secreto: Crea un Color Gradiente Épico en DaVinci Resolve",
        },
        {
          title: "Edição e Design de Som",
          description: "Trabalho o som com precisão para que cada projeto tenha identidade própria.",
          accent: "cyan",
          poster: "/images/skills/sound.jpg",
          videoId: "JlxFvORQOa0",
          videoTitle: "El Secreto para Mezclas Impecables en DaVinci Resolve (Fairlight)",
        },
        {
          title: "Motion Graphics em Fusion",
          description: "Crio animações dinâmicas, limpas e modernas usando Fusion.",
          accent: "violet",
          poster: "/images/skills/fusion.jpg",
          videoId: "fhYi33V2uf8",
          videoTitle: "Animación Avanzada con Fusion",
        },
      ],
    },
    services: {
      kicker: "Servicos audiovisuais",
      title: "Producao visual para pecas que vendem, conectam e ficam na memoria.",
      lead:
        "Um painel de servicos pensado como sala de controle: estrategia, ritmo, cor, som e entrega final para cada formato.",
      screenLabel: "Tela ativa",
      cardLabel: "Selecionar servico",
      cta: "Ver abordagem",
      sideRailLeft: "servicos audiovisuais",
      sideRailRight: "criamos historias que conectam",
      status: "Disponivel para projetos",
      services: [
        {
          title: "YouTube & Video Longo",
          eyebrow: "Conteudo principal",
          headline: "Narrativa com ritmo de retencao.",
          description:
            "Edicao profissional para videos longos: estrutura, cortes, B-roll, audio, titulos e cor para manter a atencao.",
          meta: "Horizontal / 4K / narrativa",
          cardImage: "/images/services/cards/service-01.png",
          screenImage: "/images/services/screens/service-01.png",
        },
        {
          title: "Reels & Shorts",
          eyebrow: "Formato vertical",
          headline: "Impacto em segundos.",
          description:
            "Pecas verticais para Instagram, TikTok e YouTube Shorts com ritmo, legendas, energia visual e final memoravel.",
          meta: "9:16 / social / retencao",
          cardImage: "/images/services/cards/service-02.png",
          screenImage: "/images/services/screens/service-02.png",
        },
        {
          title: "Pos-producao",
          eyebrow: "Cor e som",
          headline: "Acabamento tecnico com identidade.",
          description:
            "Correcao de cor, mixagem de audio, limpeza, atmosfera e polimento final para cada peca parecer completa.",
          meta: "DaVinci / Fairlight / cor",
          cardImage: "/images/services/cards/service-03.png",
          screenImage: "/images/services/screens/service-03.png",
        },
        {
          title: "Ads & Conteudo Comercial",
          eyebrow: "Marca e conversao",
          headline: "Presenca que impacta.",
          description:
            "Videos para marcas, lancamentos, produtos e campanhas com foco em clareza, desejo visual e mensagem direta.",
          meta: "Ads / produto / campanha",
          cardImage: "/images/services/cards/service-04.png",
          screenImage: "/images/services/screens/service-04.png",
        },
        {
          title: "Motion & Visual Design",
          eyebrow: "Motion graphics",
          headline: "Interfaces, titulos e movimento.",
          description:
            "Animacoes, overlays, graficos, composicao e recursos visuais para elevar a identidade audiovisual de cada projeto.",
          meta: "Fusion / grafica / visual design",
          cardImage: "/images/services/cards/service-05.png",
          screenImage: "/images/services/screens/service-05.png",
        },
      ],
    },
    contact: {
      kicker: "Contato",
      title: "Vamos fazer sua peça parecer cinema.",
      text:
        "Se você quer que seu conteúdo tenha ritmo, imagem, som e presença, escreva pela rede que você usa.",
      socialLinks: baseSocialLinks,
    },
    footer: {
      kicker: "Bajo Flow",
      title: "Edição, cor, áudio e direção visual para peças que parecem grandes.",
      location: "Lucas Leiva - Buenos Aires",
    },
  },
} satisfies Record<Language, {
  header: {
    brandAria: string;
    navAria: string;
    languageAria: string;
    languageLabel: string;
  };
  navItems: Array<{ label: string; href: string }>;
  hero: {
    sideRail: string;
    kicker: string;
    title: string;
    lead: string;
    primaryAction: string;
    secondaryAction: string;
  };
  work: {
    kicker: string;
    title: string;
    previous: string;
    next: string;
    progress: string;
    projectAria: string;
    toolsAria: string;
    viewCase: string;
    viewProject: string;
    projects: Array<{
      title: string;
      category: string;
      runtime: string;
      description: string;
      tools: string[];
      video: string;
      href: string;
    }>;
  };
  bio: {
    kicker: string;
    title: string;
    identitySubtitle: string;
    editorialNav: string[];
    backgroundWords: string[];
    editorialIntro: {
      prefix: string;
      name: string;
      suffix: string;
    };
    editorialColumns: string[];
    editorialQuote: string;
    contributionLabel: string;
    paragraphs: string[];
    frontParagraphs: string[];
    tags: string[];
    roomControls: Array<{ label: string; view: "home" | "bio" | "gallery" | "contact" }>;
    contactLinks: Array<{ label: string; handle: string; href: string }>;
    tools: string[];
    bioBlocks: Array<{ title: string; text: string }>;
    skillItems: Array<{
      title: string;
      description: string;
      accent: "pink" | "blue" | "violet" | "cyan" | "amber" | "green";
      poster?: string;
      videoId?: string;
      videoTitle?: string;
    }>;
  };
  services: {
    kicker: string;
    title: string;
    lead: string;
    screenLabel: string;
    cardLabel: string;
    cta: string;
    sideRailLeft: string;
    sideRailRight: string;
    status: string;
    services: Array<{
      title: string;
      eyebrow: string;
      headline: string;
      description: string;
      meta: string;
      cardImage: string;
      screenImage: string;
    }>;
  };
  contact: {
    kicker: string;
    title: string;
    text: string;
    socialLinks: typeof baseSocialLinks;
  };
  footer: {
    kicker: string;
    title: string;
    location: string;
  };
}>;

export type SiteCopy = (typeof siteCopy)[Language];
export type NavItem = SiteCopy["navItems"][number];
export type Project = SiteCopy["work"]["projects"][number];
export type SocialLink = SiteCopy["contact"]["socialLinks"][number];
