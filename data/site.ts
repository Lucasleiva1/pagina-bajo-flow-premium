export const navItems = [
  { label: "Intro", href: "#intro" },
  { label: "Work", href: "#work" },
  { label: "Craft", href: "#craft" },
  { label: "Bio", href: "#bio" },
  { label: "Contact", href: "#contact" },
];

export type NavItem = (typeof navItems)[number];

export const projects = [
  {
    title: "YouTube Launch",
    category: "Contenido principal",
    runtime: "Formato vertical / horizontal",
    description:
      "Proyecto base para un video principal: narrativa, ritmo, retencion, color y entrega lista para publicar.",
    tools: ["DaV", "Color", "Fair", "Cut", "AI"],
    video: "/assets/video_center.mp4",
    href: "https://www.youtube.com/@bajoflow",
  },
  {
    title: "Social Impact",
    category: "Redes sociales",
    runtime: "Shorts / Reels / TikTok",
    description:
      "Piezas cortas para captar atencion rapido: cortes precisos, subtitulos, energia y foco en retencion.",
    tools: ["Cut", "Sub", "Sound", "Color"],
    video: "/assets/video_left.mp4",
    href: "https://www.youtube.com/@bajoflow",
  },
  {
    title: "Brand Film",
    category: "Marca / institucional",
    runtime: "Campana / Institucional",
    description:
      "Videos para marca o institucion con tono profesional, atmosfera cuidada, audio limpio y entrega final solida.",
    tools: ["DaV", "Fair", "Grade", "Mix"],
    video: "/assets/video_right.mp4",
    href: "https://www.youtube.com/@bajoflow",
  },
];

export type Project = (typeof projects)[number];

export const craftSteps = [
  {
    number: "01",
    title: "Material",
    text: "Recibo archivos, referencias, musica, objetivo y tono de la pieza.",
    icon: "ingest",
  },
  {
    number: "02",
    title: "Corte",
    text: "Estructura, retencion, pausas, impacto y cortes con intencion.",
    icon: "cut",
  },
  {
    number: "03",
    title: "Color",
    text: "Contraste, profundidad, look cinematografico y coherencia visual.",
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
    text: "Graficas, visuales, detalles generativos y capas de energia visual.",
    icon: "spark",
  },
  {
    number: "06",
    title: "Entrega",
    text: "Version final optimizada para YouTube, redes, marcas o institucionales.",
    icon: "deliver",
  },
];

export const socialLinks = [
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
