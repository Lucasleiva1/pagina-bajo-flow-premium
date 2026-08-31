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
    handle: "/lucasleivafabian",
    href: "https://www.facebook.com/lucasleivafabian",
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
      { label: "Campañas", href: "#services" },
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
        { label: "Facebook", handle: "/lucasleivafabian", href: "https://www.facebook.com/lucasleivafabian" },
        { label: "WhatsApp", handle: "WhatsApp", href: "https://wa.me/" },
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
      kicker: "Campañas audiovisuales",
      title: "Cartuchos premium para campañas, reels y piezas con impacto.",
      lead:
        "Navega piezas audiovisuales como cartuchos digitales: selecciona una campaña, arrastrala al reproductor y mirala en escena.",
      screenLabel: "Pantalla activa",
      cardLabel: "Seleccionar campaña",
      cta: "Ver campaña",
      sideRailLeft: "campañas audiovisuales",
      sideRailRight: "publicidad con ritmo",
      status: "Disponible para proyectos",
      activeLabel: "Campaña activa",
      dropIdle: "Solta el cartucho aca",
      dropLoaded: "Campaña cargada",
      dropHint: "Arrastra o toca la tarjeta activa para reproducir",
      loadSelected: "Reproducir campaña seleccionada",
      previous: "Campaña anterior",
      next: "Campaña siguiente",
      progress: "Progreso de campañas",
      services: [
        {
          title: "Bajo Flow Promo",
          eyebrow: "Spot principal",
          headline: "Edición dinámica con presencia de marca.",
          description:
            "Spot publicitario institucional con ritmo, tratamiento de color y diseño de sonido de alto impacto.",
          meta: "Horizontal / 4K / spot",
          cardImage: "/videos/campaign-publi-1-poster.jpg",
          screenImage: "/videos/campaign-publi-1-poster.jpg",
          videoName: "campaign-publi-1",
        },
        {
          title: "FAR Producciones",
          eyebrow: "Campaña audiovisual",
          headline: "Narrativa visual para producciones.",
          description:
            "Comercial de alta estética con transiciones cinemáticas, sincronización de audio y grado de color profesional.",
          meta: "Horizontal / 4K / comercial",
          cardImage: "/videos/campaign-publi-2-poster.jpg",
          screenImage: "/videos/campaign-publi-2-poster.jpg",
          videoName: "campaign-publi-2",
        },
        {
          title: "DG Branding & Spot",
          eyebrow: "Marca & producto",
          headline: "Mensaje directo e imagen limpia.",
          description:
            "Pieza audiovisual enfocada en identidad de marca, jerarquía de contenido y presencia en medios.",
          meta: "Horizontal / branding / comercial",
          cardImage: "/videos/campaign-publi-3-poster.jpg",
          screenImage: "/videos/campaign-publi-3-poster.jpg",
          videoName: "campaign-publi-3",
        },
        {
          title: "PC Loca Spot",
          eyebrow: "Contenido comercial",
          headline: "Ritmo rápido y conversión visual.",
          description:
            "Publicidad dinámica pensada para generar impacto inmediato en audiencias digitales.",
          meta: "Horizontal / ad / producto",
          cardImage: "/videos/campaign-publi-4-poster.jpg",
          screenImage: "/videos/campaign-publi-4-poster.jpg",
          videoName: "campaign-publi-4",
        },
        {
          title: "Roxwana Eléctrico",
          eyebrow: "Lanzamiento & promo",
          headline: "Estética moderna y movimiento continuo.",
          description:
            "Comercial de producto con ritmo, diseño de sonido envolvente y gráficos limpios.",
          meta: "Horizontal / promo / lanzamiento",
          cardImage: "/videos/campaign-publi-5-poster.jpg",
          screenImage: "/videos/campaign-publi-5-poster.jpg",
          videoName: "campaign-publi-5",
        },
        {
          title: "Pop Sound & Reels",
          eyebrow: "Formato vertical 9:16",
          headline: "Impacto en redes sociales.",
          description:
            "Edición vertical optimizada para Instagram Reels, TikTok y Shorts con subtítulos dinámicos y audio potente.",
          meta: "9:16 / social media / reels",
          cardImage: "/videos/campaign-publi-6-poster.jpg",
          screenImage: "/videos/campaign-publi-6-poster.jpg",
          videoName: "campaign-publi-6",
        },
        {
          title: "Rox Human Motion",
          eyebrow: "Formato vertical 9:16",
          headline: "Energía visual en vertical.",
          description:
            "Pieza de alto impacto visual para formatos móviles con cortes al ritmo del audio y pulido cinemático.",
          meta: "9:16 / social / tiktok & reels",
          cardImage: "/videos/campaign-publi-7-poster.jpg",
          screenImage: "/videos/campaign-publi-7-poster.jpg",
          videoName: "campaign-publi-7",
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
      { label: "Campaigns", href: "#services" },
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
        { label: "Facebook", handle: "/lucasleivafabian", href: "https://www.facebook.com/lucasleivafabian" },
        { label: "WhatsApp", handle: "WhatsApp", href: "https://wa.me/" },
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
      kicker: "Audiovisual campaigns",
      title: "Premium cartridges for campaigns, reels, and high-impact pieces.",
      lead:
        "Browse audiovisual pieces like digital cartridges: select a campaign, drag it into the player, and watch it in scene.",
      screenLabel: "Active screen",
      cardLabel: "Select campaign",
      cta: "View campaign",
      sideRailLeft: "audiovisual campaigns",
      sideRailRight: "advertising with rhythm",
      status: "Available for projects",
      activeLabel: "Active campaign",
      dropIdle: "Drop the cartridge here",
      dropLoaded: "Campaign loaded",
      dropHint: "Drag or tap the active card to play",
      loadSelected: "Play selected campaign",
      previous: "Previous campaign",
      next: "Next campaign",
      progress: "Campaign progress",
      services: [
        {
          title: "Bajo Flow Promo",
          eyebrow: "Main spot",
          headline: "Dynamic editing with brand presence.",
          description:
            "Institutional ad spot with rhythm, color treatment, and high-impact sound design.",
          meta: "Horizontal / 4K / spot",
          cardImage: "/videos/campaign-publi-1-poster.jpg",
          screenImage: "/videos/campaign-publi-1-poster.jpg",
          videoName: "campaign-publi-1",
        },
        {
          title: "FAR Producciones",
          eyebrow: "Audiovisual campaign",
          headline: "Visual storytelling for productions.",
          description:
            "High-aesthetic commercial with cinematic transitions, audio sync, and professional color grading.",
          meta: "Horizontal / 4K / commercial",
          cardImage: "/videos/campaign-publi-2-poster.jpg",
          screenImage: "/videos/campaign-publi-2-poster.jpg",
          videoName: "campaign-publi-2",
        },
        {
          title: "DG Branding & Spot",
          eyebrow: "Brand & product",
          headline: "Direct message, clean image.",
          description:
            "Audiovisual piece focused on brand identity, content hierarchy, and media presence.",
          meta: "Horizontal / branding / commercial",
          cardImage: "/videos/campaign-publi-3-poster.jpg",
          screenImage: "/videos/campaign-publi-3-poster.jpg",
          videoName: "campaign-publi-3",
        },
        {
          title: "PC Loca Spot",
          eyebrow: "Commercial content",
          headline: "Fast rhythm and visual conversion.",
          description:
            "Dynamic advertising designed for immediate impact on digital audiences.",
          meta: "Horizontal / ad / product",
          cardImage: "/videos/campaign-publi-4-poster.jpg",
          screenImage: "/videos/campaign-publi-4-poster.jpg",
          videoName: "campaign-publi-4",
        },
        {
          title: "Roxwana Eléctrico",
          eyebrow: "Launch & promo",
          headline: "Modern aesthetics and continuous motion.",
          description:
            "Product commercial with rhythm, immersive sound design, and clean graphics.",
          meta: "Horizontal / promo / launch",
          cardImage: "/videos/campaign-publi-5-poster.jpg",
          screenImage: "/videos/campaign-publi-5-poster.jpg",
          videoName: "campaign-publi-5",
        },
        {
          title: "Pop Sound & Reels",
          eyebrow: "Vertical format 9:16",
          headline: "Social media impact.",
          description:
            "Vertical editing optimized for Instagram Reels, TikTok, and Shorts with dynamic subtitles and powerful audio.",
          meta: "9:16 / social media / reels",
          cardImage: "/videos/campaign-publi-6-poster.jpg",
          screenImage: "/videos/campaign-publi-6-poster.jpg",
          videoName: "campaign-publi-6",
        },
        {
          title: "Rox Human Motion",
          eyebrow: "Vertical format 9:16",
          headline: "Visual energy in vertical.",
          description:
            "High-impact visual piece for mobile formats with beat-synced cuts and cinematic polish.",
          meta: "9:16 / social / tiktok & reels",
          cardImage: "/videos/campaign-publi-7-poster.jpg",
          screenImage: "/videos/campaign-publi-7-poster.jpg",
          videoName: "campaign-publi-7",
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
      { label: "Campanhas", href: "#services" },
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
        { label: "Facebook", handle: "/lucasleivafabian", href: "https://www.facebook.com/lucasleivafabian" },
        { label: "WhatsApp", handle: "WhatsApp", href: "https://wa.me/" },
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
      kicker: "Campanhas audiovisuais",
      title: "Cartuchos premium para campanhas, reels e pecas de impacto.",
      lead:
        "Navegue pecas audiovisuais como cartuchos digitais: selecione uma campanha, arraste para o player e assista em cena.",
      screenLabel: "Tela ativa",
      cardLabel: "Selecionar campanha",
      cta: "Ver campanha",
      sideRailLeft: "campanhas audiovisuais",
      sideRailRight: "publicidade com ritmo",
      status: "Disponivel para projetos",
      activeLabel: "Campanha ativa",
      dropIdle: "Solte o cartucho aqui",
      dropLoaded: "Campanha carregada",
      dropHint: "Arraste ou toque no cartao ativo para reproduzir",
      loadSelected: "Reproduzir campanha selecionada",
      previous: "Campanha anterior",
      next: "Proxima campanha",
      progress: "Progresso das campanhas",
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
          videoName: "campaign-youtube-video-largo",
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
          videoName: "campaign-reels-shorts",
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
          videoName: "campaign-postproduccion",
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
          videoName: "campaign-ads-contenido-comercial",
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
          videoName: "campaign-motion-visual-design",
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
    activeLabel: string;
    dropIdle: string;
    dropLoaded: string;
    dropHint: string;
    loadSelected: string;
    previous: string;
    next: string;
    progress: string;
    services: Array<{
      title: string;
      eyebrow: string;
      headline: string;
      description: string;
      meta: string;
      cardImage: string;
      screenImage: string;
      videoName: string;
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
