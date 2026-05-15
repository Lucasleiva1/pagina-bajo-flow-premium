const projects = [
  {
    number: "01",
    title: "YouTube Launch",
    type: "Contenido principal",
    description: "Proyecto base para un video principal: narrativa, ritmo, retencion, color y entrega lista para publicar.",
    runtime: "Formato vertical / horizontal",
    href: "https://www.youtube.com/@bajoflow",
  },
  {
    number: "02",
    title: "Social Impact",
    type: "Redes sociales",
    description: "Piezas cortas para captar atencion rapido: cortes precisos, subtitulos, energia y foco en retencion.",
    runtime: "Shorts / Reels / TikTok",
    href: "https://www.youtube.com/@bajoflow",
  },
  {
    number: "03",
    title: "Brand Film",
    type: "Marca / institucional",
    description: "Videos para marca o institucion con tono profesional, atmosfera cuidada, audio limpio y entrega final solida.",
    runtime: "Campana / Institucional",
    href: "https://www.youtube.com/@bajoflow",
  },
];

const revealItems = document.querySelectorAll("[data-reveal]");
const scenes = document.querySelectorAll("[data-scene]");
const cursorLight = document.querySelector(".cursor-light");
const progress = document.querySelector(".scroll-progress");
const heroVideo = document.querySelector(".hero-video");
const magneticItems = document.querySelectorAll(".magnetic");
const reactiveCards = document.querySelectorAll(".main-card, .side-card, .process-step, .social-card");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sceneObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-active", entry.isIntersecting);
      if (entry.target.id === "intro" && heroVideo) {
        if (entry.isIntersecting) {
          heroVideo.play().catch(() => {});
        } else {
          heroVideo.pause();
        }
      }
    });
  },
  { threshold: 0.62 }
);

scenes.forEach((scene) => sceneObserver.observe(scene));

function updateProgress() {
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const amount = pageHeight > 0 ? window.scrollY / pageHeight : 0;
  progress.style.transform = `scaleX(${amount})`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;

window.addEventListener("pointermove", (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
  cursorLight.style.opacity = "1";
  cursorLight.style.left = `${pointerX}px`;
  cursorLight.style.top = `${pointerY}px`;
});

window.addEventListener("pointerleave", () => {
  cursorLight.style.opacity = "0";
});

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    item.style.setProperty("--x", `${x}px`);
    item.style.setProperty("--y", `${y}px`);
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
    item.style.setProperty("--x", "0px");
    item.style.setProperty("--y", "0px");
  });
});

reactiveCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  });
});

const projectCard = document.querySelector("[data-project-card]");
const dots = document.querySelectorAll("[data-dot]");
let currentProject = 0;

function renderProject(index) {
  const normalized = (index + projects.length) % projects.length;
  const project = projects[normalized];
  currentProject = normalized;

  projectCard.animate(
    [
      { opacity: 1, transform: "translateZ(105px) scale(1)" },
      { opacity: 0.7, transform: "translateZ(60px) scale(0.985)" },
    ],
    { duration: 160, easing: "ease-out" }
  ).onfinish = () => {
    projectCard.querySelector(".project-number").textContent = project.number;
    projectCard.querySelector("h3").textContent = project.title;
    projectCard.querySelector(".project-type").textContent = project.type;
    projectCard.querySelector(".project-description").textContent = project.description;
    projectCard.querySelector(".runtime").textContent = project.runtime;
    projectCard.querySelector(".card-media img").src = project.image;
    dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === normalized));

    projectCard.animate(
      [
        { opacity: 0.7, transform: "translateZ(60px) scale(0.985)" },
        { opacity: 1, transform: "translateZ(105px) scale(1)" },
      ],
      { duration: 240, easing: "ease-out" }
    );
  };
}

document.querySelectorAll("[data-slide]").forEach((button) => {
  button.addEventListener("click", () => {
    renderProject(currentProject + (button.dataset.slide === "next" ? 1 : -1));
  });
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => renderProject(Number(dot.dataset.dot)));
});

const canvas = document.querySelector("#particleField");
const ctx = canvas.getContext("2d");
const particles = [];
const particleCount = window.matchMedia("(max-width: 760px)").matches ? 46 : 88;

function resetCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i += 1) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.35 + 0.12,
      drift: Math.random() * 0.28 - 0.14,
      alpha: Math.random() * 0.42 + 0.16,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  const mousePullX = (pointerX - window.innerWidth / 2) * 0.0008;
  const mousePullY = (pointerY - window.innerHeight / 2) * 0.0008;

  particles.forEach((particle) => {
    particle.y -= particle.speed + mousePullY;
    particle.x += particle.drift + mousePullX;

    if (particle.y < -10) {
      particle.y = window.innerHeight + 10;
      particle.x = Math.random() * window.innerWidth;
    }

    if (particle.x < -10) particle.x = window.innerWidth + 10;
    if (particle.x > window.innerWidth + 10) particle.x = -10;

    const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 8);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.alpha})`);
    gradient.addColorStop(0.42, `rgba(94, 161, 255, ${particle.alpha * 0.28})`);
    gradient.addColorStop(1, "rgba(255, 77, 141, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 8, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(drawParticles);
}

window.addEventListener("resize", () => {
  resetCanvas();
  createParticles();
});

resetCanvas();
createParticles();
drawParticles();
