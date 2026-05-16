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
      { label: "Proceso", href: "#craft" },
      { label: "Bio", href: "#bio" },
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
    craft: {
      kicker: "Proceso creativo",
      title: "Del material crudo a una pieza con pulso.",
      description:
        "No es una lista de servicios. Es el recorrido visual del trabajo: ritmo, atmósfera, intención, sonido y entrega.",
      steps: [
        {
          number: "01",
          title: "Material",
          text: "Recibo archivos, referencias, música, objetivo y tono de la pieza.",
          icon: "ingest",
        },
        {
          number: "02",
          title: "Corte",
          text: "Estructura, retención, pausas, impacto y cortes con intención.",
          icon: "cut",
        },
        {
          number: "03",
          title: "Color",
          text: "Contraste, profundidad, look cinematográfico y coherencia visual.",
          icon: "color",
        },
        {
          number: "04",
          title: "Audio",
          text: "Limpieza, mezcla, ambiente, golpe sonoro y pulso emocional.",
          icon: "wave",
        },
        {
          number: "05",
          title: "Motion / AI",
          text: "Gráficas, visuales, detalles generativos y capas de energía visual.",
          icon: "spark",
        },
        {
          number: "06",
          title: "Entrega",
          text: "Versión final optimizada para YouTube, redes, marcas o institucionales.",
          icon: "deliver",
        },
      ],
    },
    bio: {
      kicker: "Bio",
      title: "Soy Lucas, editor de video enfocado en transformar piezas audiovisuales.",
      identitySubtitle: "Editor de video · Postproducción · Motion · Color · Contenido visual",
      paragraphs: [
        "Trabajo cada proyecto desde el ritmo, la atmósfera y la emoción para que cada corte tenga una razón.",
        "Bajo Flow nace para crear contenido con identidad: videos para YouTube, redes sociales, marcas e institucionales.",
      ],
      tags: ["Edición de video", "Color", "Post audio", "Redes sociales", "Institucionales"],
      roomControls: [
        { label: "Inicio", view: "home" },
        { label: "Bio", view: "bio" },
        { label: "Galería", view: "gallery" },
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
          title: "Quién soy",
          text: "Soy Lucas Leiva, editor audiovisual y creador visual detrás de Bajo Flow.",
        },
        {
          title: "Qué hago",
          text: "Transformo material crudo en piezas con ritmo, imagen, sonido y presencia para redes, marcas e institucionales.",
        },
        {
          title: "Cómo trabajo",
          text: "Ordeno la narrativa, encuentro el pulso del corte y cuido color, audio, motion y entrega final.",
        },
        {
          title: "Mi enfoque",
          text: "Cada video tiene que sentirse claro, cinematográfico y con identidad, sin perder velocidad ni retención.",
        },
      ],
      galleryItems: [
        { title: "Ritmo visual", category: "Placeholder", image: "/assets/bio-room/gallery-01.png" },
        { title: "Color y atmósfera", category: "Placeholder", image: "/assets/bio-room/gallery-02.png" },
        { title: "Motion", category: "Placeholder", image: "/assets/bio-room/gallery-03.png" },
        { title: "Postproducción", category: "Placeholder", image: "/assets/bio-room/gallery-04.png" },
        { title: "Social cuts", category: "Placeholder", image: "/assets/bio-room/gallery-05.png" },
        { title: "Identidad visual", category: "Placeholder", image: "/assets/bio-room/gallery-06.png" },
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
      { label: "Craft", href: "#craft" },
      { label: "Bio", href: "#bio" },
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
    craft: {
      kicker: "Craft sequence",
      title: "From raw material to a piece with pulse.",
      description:
        "This is not a list of services. It is the visual path of the work: rhythm, atmosphere, intention, sound, and delivery.",
      steps: [
        {
          number: "01",
          title: "Material",
          text: "I receive files, references, music, goals, and the tone of the piece.",
          icon: "ingest",
        },
        {
          number: "02",
          title: "Cut",
          text: "Structure, retention, pauses, impact, and intentional cuts.",
          icon: "cut",
        },
        {
          number: "03",
          title: "Color",
          text: "Contrast, depth, cinematic look, and visual consistency.",
          icon: "color",
        },
        {
          number: "04",
          title: "Audio",
          text: "Cleanup, mix, atmosphere, sonic hits, and emotional pulse.",
          icon: "wave",
        },
        {
          number: "05",
          title: "Motion / AI",
          text: "Graphics, visuals, generative details, and layers of visual energy.",
          icon: "spark",
        },
        {
          number: "06",
          title: "Delivery",
          text: "Final version optimized for YouTube, social media, brands, or institutions.",
          icon: "deliver",
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
      tags: ["Video editing", "Color grading", "Post audio", "Social media", "Institutional"],
      roomControls: [
        { label: "Home", view: "home" },
        { label: "Bio", view: "bio" },
        { label: "Gallery", view: "gallery" },
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
      galleryItems: [
        { title: "Visual rhythm", category: "Placeholder", image: "/assets/bio-room/gallery-01.png" },
        { title: "Color and atmosphere", category: "Placeholder", image: "/assets/bio-room/gallery-02.png" },
        { title: "Motion", category: "Placeholder", image: "/assets/bio-room/gallery-03.png" },
        { title: "Post-production", category: "Placeholder", image: "/assets/bio-room/gallery-04.png" },
        { title: "Social cuts", category: "Placeholder", image: "/assets/bio-room/gallery-05.png" },
        { title: "Visual identity", category: "Placeholder", image: "/assets/bio-room/gallery-06.png" },
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
      { label: "Processo", href: "#craft" },
      { label: "Bio", href: "#bio" },
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
    craft: {
      kicker: "Processo criativo",
      title: "Do material bruto a uma peça com pulso.",
      description:
        "Não é uma lista de serviços. É o percurso visual do trabalho: ritmo, atmosfera, intenção, som e entrega.",
      steps: [
        {
          number: "01",
          title: "Material",
          text: "Recebo arquivos, referências, música, objetivo e tom da peça.",
          icon: "ingest",
        },
        {
          number: "02",
          title: "Corte",
          text: "Estrutura, retenção, pausas, impacto e cortes com intenção.",
          icon: "cut",
        },
        {
          number: "03",
          title: "Cor",
          text: "Contraste, profundidade, look cinematográfico e coerência visual.",
          icon: "color",
        },
        {
          number: "04",
          title: "Áudio",
          text: "Limpeza, mixagem, ambiente, impacto sonoro e pulso emocional.",
          icon: "wave",
        },
        {
          number: "05",
          title: "Motion / AI",
          text: "Gráficos, visuais, detalhes generativos e camadas de energia visual.",
          icon: "spark",
        },
        {
          number: "06",
          title: "Entrega",
          text: "Versão final otimizada para YouTube, redes, marcas ou institucionais.",
          icon: "deliver",
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
      tags: ["Edição de vídeo", "Cor", "Pós-áudio", "Redes sociais", "Institucionais"],
      roomControls: [
        { label: "Início", view: "home" },
        { label: "Bio", view: "bio" },
        { label: "Galeria", view: "gallery" },
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
      galleryItems: [
        { title: "Ritmo visual", category: "Placeholder", image: "/assets/bio-room/gallery-01.png" },
        { title: "Cor e atmosfera", category: "Placeholder", image: "/assets/bio-room/gallery-02.png" },
        { title: "Motion", category: "Placeholder", image: "/assets/bio-room/gallery-03.png" },
        { title: "Pós-produção", category: "Placeholder", image: "/assets/bio-room/gallery-04.png" },
        { title: "Cortes sociais", category: "Placeholder", image: "/assets/bio-room/gallery-05.png" },
        { title: "Identidade visual", category: "Placeholder", image: "/assets/bio-room/gallery-06.png" },
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
  craft: {
    kicker: string;
    title: string;
    description: string;
    steps: Array<{
      number: string;
      title: string;
      text: string;
      icon: string;
    }>;
  };
  bio: {
    kicker: string;
    title: string;
    identitySubtitle: string;
    paragraphs: string[];
    tags: string[];
    roomControls: Array<{ label: string; view: "home" | "bio" | "gallery" | "contact" }>;
    contactLinks: Array<{ label: string; handle: string; href: string }>;
    tools: string[];
    bioBlocks: Array<{ title: string; text: string }>;
    galleryItems: Array<{ title: string; category: string; image: string }>;
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
export type CraftStep = SiteCopy["craft"]["steps"][number];
export type SocialLink = SiteCopy["contact"]["socialLinks"][number];
