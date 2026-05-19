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
      title: "¡Hola! Me llamo Lucas",
      identitySubtitle: "Editor de video · Corrección de color · Postproducción de audio",
      paragraphs: [
        "Soy un editor de video enfocado en transformar piezas audiovisuales en experiencias de alto impacto. Mi enfoque no se limita solo al montaje; me especializo en potenciar la narrativa visual a través de una corrección de color profesional y un tratamiento de sonido inmersivo.",
        "Cuento con experiencia técnica avanzada en herramientas de estándar industrial como DaVinci Resolve, dominando sus módulos de Color y Fairlight para asegurar que cada proyecto tenga un acabado cinematográfico y una claridad sonora impecable.",
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
          title: "Edición Dinámica",
          text: "Ritmo y fluidez adaptados al mensaje.",
        },
        {
          title: "Color Grading",
          text: "Creación de atmósferas visuales y coherencia estética.",
        },
        {
          title: "Post-producción de Audio",
          text: "Limpieza, mezcla y diseño sonoro.",
        },
        {
          title: "Versatilidad",
          text: "Formatos: YouTube, Social Media, Institucionales.",
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
      title: "I am Lucas, a video editor focused on transforming audiovisual pieces.",
      identitySubtitle: "Video editor · Post-production · Motion · Color · Visual content",
      paragraphs: [
        "I approach every project through rhythm, atmosphere, and emotion so every cut has a reason.",
        "Bajo Flow was created to build content with identity: videos for YouTube, social media, brands, and institutions.",
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
          title: "Who I am",
          text: "I am Lucas Leiva, an audiovisual editor and visual creator behind Bajo Flow.",
        },
        {
          title: "What I do",
          text: "I turn raw material into pieces with rhythm, image, sound, and presence for social media, brands, and institutions.",
        },
        {
          title: "How I work",
          text: "I shape the narrative, find the pulse of the edit, and refine color, audio, motion, and final delivery.",
        },
        {
          title: "My focus",
          text: "Every video should feel clear, cinematic, and identifiable without losing pace or retention.",
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
      title: "Sou Lucas, editor de vídeo focado em transformar peças audiovisuais.",
      identitySubtitle: "Editor de vídeo · Pós-produção · Motion · Cor · Conteúdo visual",
      paragraphs: [
        "Trabalho cada projeto a partir do ritmo, da atmosfera e da emoção para que cada corte tenha uma razão.",
        "Bajo Flow nasce para criar conteúdo com identidade: vídeos para YouTube, redes sociais, marcas e institucionais.",
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
          title: "Quem sou",
          text: "Sou Lucas Leiva, editor audiovisual e criador visual por trás da Bajo Flow.",
        },
        {
          title: "O que faço",
          text: "Transformo material bruto em peças com ritmo, imagem, som e presença para redes, marcas e institucionais.",
        },
        {
          title: "Como trabalho",
          text: "Organizo a narrativa, encontro o pulso do corte e cuido de cor, áudio, motion e entrega final.",
        },
        {
          title: "Meu enfoque",
          text: "Cada vídeo precisa parecer claro, cinematográfico e com identidade, sem perder velocidade nem retenção.",
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
