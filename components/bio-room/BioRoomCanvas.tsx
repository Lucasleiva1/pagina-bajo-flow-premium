"use client";

import { type ReactNode, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useControls, folder, Leva } from "leva";
import {
  AdditiveBlending,
  CanvasTexture,
  DoubleSide,
  Group,
  LinearFilter,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
} from "three";
import {
  createBioRoomLayout,
  type BioRoomLayout,
} from "@/components/bio-room/BioRoomLayout";
import { BioRoomWorldPanels } from "@/components/bio-room/BioRoomWorldPanels";
import type { SiteCopy } from "@/data/site";
import { useBioRoomStore } from "@/lib/useBioRoomStore";

type BioRoomCanvasProps = {
  copy: SiteCopy["bio"];
};

const collapsedLevaFolder = { collapsed: true } as const;

/* ──────────────────────── Camera states ──────────────────────── */
/* Each state faces the target wall HEAD-ON so the Html panels
   rendered on that wall are fully readable (no extreme perspective). */
const cameraStates = {
  home: {
    position: new Vector3(0, 1.6, 6.2),
    target: new Vector3(0, 1.6, -3.5),
  },
  bio: {
    /* Camera moves to face the LEFT wall (character-right-wall) head-on */
    position: new Vector3(-1.6, 1.6, 0.4),
    target: new Vector3(-3.6, 1.5, 0.4),
  },
  gallery: {
    /* Camera moves to face the RIGHT wall (character-left-wall) head-on */
    position: new Vector3(1.6, 1.6, 0.4),
    target: new Vector3(3.6, 1.5, 0.4),
  },
  contact: {
    /* Zoom-in on the back wall contact links */
    position: new Vector3(0, 1.5, 4.2),
    target: new Vector3(0, 1.5, -3.5),
  },
};

/* ──────────────────────── Camera rig ──────────────────────── */
function CameraRig() {
  const activeRoomView = useBioRoomStore((state) => state.activeRoomView);
  const { camera } = useThree();
  const target = useRef(cameraStates.home.target.clone());

  useFrame((_, delta) => {
    const state = cameraStates[activeRoomView];
    const speed = 1 - Math.pow(0.025, delta);
    camera.position.lerp(state.position, speed);
    target.current.lerp(state.target, speed);
    camera.lookAt(target.current);
  });

  return null;
}

/* ──────────────────────── Glow line helper ──────────────────────── */
function GlowLine({
  color = "#cfc8b8",
  opacity = 0.16,
  position,
  rotation,
  scale,
}: {
  color?: string;
  opacity?: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color={color}
        toneMapped={false}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

/* ──────────────────────── Softbox texture ──────────────────────── */
function SoftboxTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 126);
      gradient.addColorStop(0, "rgba(255,255,255,0.95)");
      gradient.addColorStop(0.5, "rgba(255,190,116,0.35)");
      gradient.addColorStop(1, "rgba(255,190,116,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
    }

    const texture = new CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

/* ──────────────────────── Lucas billboard ──────────────────────── */
function LucasBillboard() {
  const texture = useLoader(
    TextureLoader,
    "/assets/bio-room/lucas-fullbody-cutout.png",
  );

  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;

  // Leva controls for Lucas
  const lucasControls = useControls("🧍 LUCAS (Billboard)", {
    posX: { value: 0, min: -4, max: 4, step: 0.05, label: "X" },
    posY: { value: 1.12, min: 0, max: 3, step: 0.05, label: "Y" },
    posZ: { value: 0.6, min: -3.5, max: 4, step: 0.05, label: "Z" },
    width: { value: 1.74, min: 0.5, max: 4, step: 0.05, label: "Ancho" },
    height: { value: 2.55, min: 0.5, max: 5, step: 0.05, label: "Alto" },
    emissiveIntensity: { value: 0.08, min: 0, max: 0.5, step: 0.01, label: "Brillo" },
  }, collapsedLevaFolder);

  return (
    <group position={[lucasControls.posX, lucasControls.posY, lucasControls.posZ]}>
      {/* Main character plane */}
      <mesh position={[0, 0.12, 0]}>
        <planeGeometry args={[lucasControls.width, lucasControls.height]} />
        <meshStandardMaterial
          alphaTest={0.05}
          emissive="#ffffff"
          emissiveIntensity={lucasControls.emissiveIntensity}
          emissiveMap={texture}
          map={texture}
          side={DoubleSide}
          transparent
        />
      </mesh>
      {/* Floor shadow */}
      <mesh position={[0, -1.13, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.92, 80]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.52} />
      </mesh>
      {/* Amber glow ring on floor */}
      <mesh position={[0, -1.12, 0.025]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.58, 0.95, 96]} />
        <meshBasicMaterial color="#ffb454" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

/* ──────────────────────── Room shell ──────────────────────── */
function RoomShell({
  children,
}: {
  children?: (layout: BioRoomLayout) => ReactNode;
}) {
  const softbox = SoftboxTexture();

  // Leva controls for Room dimensions
  const roomControls = useControls("🏠 ROOM (Habitación)", {
    halfWidth: { value: 4, min: 2, max: 8, step: 0.1, label: "Mitad Ancho (W)" },
    depth: { value: 8, min: 4, max: 14, step: 0.1, label: "Profundidad (D)" },
    height: { value: 3.2, min: 2, max: 6, step: 0.1, label: "Altura (H)" },
    zBack: { value: -3.5, min: -8, max: 0, step: 0.1, label: "Z Pared Fondo" },
  }, collapsedLevaFolder);

  // Leva controls for Lights
  const lightControls = useControls("💡 LUCES", {
    "Key Light (Cenital)": folder({
      keyPosX: { value: 0, min: -5, max: 5, step: 0.1, label: "X" },
      keyPosY: { value: 3.3, min: 0, max: 6, step: 0.1, label: "Y" },
      keyPosZ: { value: 1, min: -5, max: 8, step: 0.1, label: "Z" },
      keyIntensity: { value: 22, min: 0, max: 50, step: 0.5, label: "Intensidad" },
    }, collapsedLevaFolder),
    "Warm Rim (Contorno)": folder({
      rimPosX: { value: 0, min: -5, max: 5, step: 0.1, label: "X" },
      rimPosY: { value: 2.6, min: 0, max: 5, step: 0.1, label: "Y" },
      rimPosZ: { value: -1.8, min: -5, max: 5, step: 0.1, label: "Z" },
      rimIntensity: { value: 12, min: 0, max: 30, step: 0.5, label: "Intensidad" },
    }, collapsedLevaFolder),
    "Cool Accent (Azul)": folder({
      coolPosX: { value: 3.2, min: -5, max: 5, step: 0.1, label: "X" },
      coolPosY: { value: 1.8, min: 0, max: 5, step: 0.1, label: "Y" },
      coolPosZ: { value: 1.5, min: -5, max: 8, step: 0.1, label: "Z" },
      coolIntensity: { value: 5, min: 0, max: 20, step: 0.5, label: "Intensidad" },
    }, collapsedLevaFolder),
    "Front Fill (Frontal)": folder({
      fillPosX: { value: 0, min: -5, max: 5, step: 0.1, label: "X" },
      fillPosY: { value: 1.6, min: 0, max: 5, step: 0.1, label: "Y" },
      fillPosZ: { value: 4.5, min: -2, max: 10, step: 0.1, label: "Z" },
      fillIntensity: { value: 6, min: 0, max: 20, step: 0.5, label: "Intensidad" },
    }, collapsedLevaFolder),
    ambientIntensity: { value: 0.35, min: 0, max: 2, step: 0.05, label: "Ambiente" },
  }, collapsedLevaFolder);

  const cinemaLightControls = useControls("CINEMA LIGHT RIG", {
    "Back Wall Wash": folder({
      wallWashY: { value: 2.15, min: 0.1, max: 4.5, step: 0.05, label: "Y" },
      wallWashZ: { value: -2.95, min: -5, max: 2, step: 0.05, label: "Z" },
      wallWashIntensity: { value: 7.5, min: 0, max: 25, step: 0.25, label: "Intensidad" },
      wallWashDistance: { value: 4.8, min: 0.5, max: 10, step: 0.1, label: "Distancia" },
    }, collapsedLevaFolder),
    "Side Wall Wash": folder({
      sideWashY: { value: 1.35, min: 0.1, max: 4.5, step: 0.05, label: "Y" },
      sideWashZ: { value: -0.2, min: -4, max: 4, step: 0.05, label: "Z" },
      sideWashIntensity: { value: 3.4, min: 0, max: 15, step: 0.2, label: "Intensidad" },
      sideWashDistance: { value: 3.6, min: 0.5, max: 8, step: 0.1, label: "Distancia" },
    }, collapsedLevaFolder),
    "Floor Bounce": folder({
      floorBounceY: { value: 0.3, min: 0.05, max: 1.5, step: 0.05, label: "Y" },
      floorBounceZ: { value: 0.92, min: -2, max: 4, step: 0.05, label: "Z" },
      floorBounceIntensity: { value: 2.2, min: 0, max: 12, step: 0.2, label: "Intensidad" },
      floorGlowOpacity: { value: 0.16, min: 0, max: 0.55, step: 0.01, label: "Glow piso" },
    }, collapsedLevaFolder),
    fogNear: { value: 4.8, min: 1, max: 10, step: 0.1, label: "Niebla inicio" },
    fogFar: { value: 12, min: 5, max: 22, step: 0.1, label: "Niebla final" },
    softboxOpacity: { value: 0.54, min: 0, max: 1, step: 0.01, label: "Softbox" },
  }, collapsedLevaFolder);

  const visualControls = useControls("ROOM VISUALS", {
    wallMetalness: { value: 0.1, min: 0, max: 0.45, step: 0.01, label: "Metal paredes" },
    wallRoughness: { value: 0.86, min: 0.3, max: 1, step: 0.01, label: "Rugosidad paredes" },
    floorMetalness: { value: 0.18, min: 0, max: 0.55, step: 0.01, label: "Metal piso" },
    floorRoughness: { value: 0.7, min: 0.25, max: 1, step: 0.01, label: "Rugosidad piso" },
    guideOpacity: { value: 0.16, min: 0, max: 0.65, step: 0.01, label: "Lineas guia" },
    panelOpacity: { value: 0.62, min: 0.2, max: 1, step: 0.01, label: "Panel fondo" },
  }, collapsedLevaFolder);

  const W = roomControls.halfWidth;
  const D = roomControls.depth;
  const Zback = roomControls.zBack;
  const H = roomControls.height;
  const layout = useMemo(
    () =>
      createBioRoomLayout({
        depth: D,
        halfWidth: W,
        height: H,
        zBack: Zback,
      }),
    [D, H, W, Zback],
  );
  const centerZ = layout.centerZ;

  return (
    <group>
      <color attach="background" args={["#03050a"]} />
      <fog
        attach="fog"
        args={["#03050a", cinemaLightControls.fogNear, cinemaLightControls.fogFar]}
      />

      {/* Ambient + directional lights */}
      <ambientLight intensity={lightControls.ambientIntensity} />

      {/* Main key light – warm overhead */}
      <spotLight
        angle={0.52}
        color="#fff2dd"
        intensity={lightControls.keyIntensity}
        penumbra={0.9}
        position={[lightControls.keyPosX, lightControls.keyPosY, lightControls.keyPosZ]}
        target-position={[0, 0, 0]}
      />

      {/* Warm fill from behind-above for character rim */}
      <pointLight
        color="#8db6ff"
        intensity={lightControls.rimIntensity}
        position={[lightControls.rimPosX, lightControls.rimPosY, lightControls.rimPosZ]}
        distance={6}
      />

      {/* Cool accent from the right side */}
      <pointLight
        color="#5ea1ff"
        intensity={lightControls.coolIntensity}
        position={[lightControls.coolPosX, lightControls.coolPosY, lightControls.coolPosZ]}
        distance={6}
      />

      {/* Front fill to brighten character */}
      <pointLight
        color="#e8dfd0"
        intensity={lightControls.fillIntensity}
        position={[lightControls.fillPosX, lightControls.fillPosY, lightControls.fillPosZ]}
        distance={7}
      />

      <pointLight
        color="#d69b55"
        distance={cinemaLightControls.wallWashDistance}
        intensity={cinemaLightControls.wallWashIntensity}
        position={[0, cinemaLightControls.wallWashY, cinemaLightControls.wallWashZ]}
      />

      <pointLight
        color="#678fff"
        distance={cinemaLightControls.sideWashDistance}
        intensity={cinemaLightControls.sideWashIntensity}
        position={[-W + 0.55, cinemaLightControls.sideWashY, cinemaLightControls.sideWashZ]}
      />

      <pointLight
        color="#9f72ff"
        distance={cinemaLightControls.sideWashDistance}
        intensity={cinemaLightControls.sideWashIntensity * 0.65}
        position={[W - 0.55, cinemaLightControls.sideWashY, cinemaLightControls.sideWashZ]}
      />

      <pointLight
        color="#d7a368"
        distance={3.2}
        intensity={cinemaLightControls.floorBounceIntensity}
        position={[0, cinemaLightControls.floorBounceY, cinemaLightControls.floorBounceZ]}
      />

      {/* Floor */}
      <mesh position={[0, 0, centerZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W * 2, D]} />
        <meshStandardMaterial
          color="#05070d"
          metalness={visualControls.floorMetalness}
          roughness={visualControls.floorRoughness}
        />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, H, centerZ]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W * 2, D]} />
        <meshStandardMaterial
          color="#03050a"
          metalness={visualControls.wallMetalness}
          roughness={visualControls.wallRoughness}
        />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, H / 2, Zback]}>
        <planeGeometry args={[W * 2, H]} />
        <meshStandardMaterial
          color="#050910"
          metalness={visualControls.wallMetalness}
          roughness={visualControls.wallRoughness}
        />
      </mesh>

      {/* Physical back-wall display pad. This lives in WebGL, so Lucas can sit in front of it by real Z depth. */}
      <mesh position={[0, H / 2, Zback + 0.018]}>
        <planeGeometry args={[W * 2 - 0.72, H - 0.48]} />
        <meshStandardMaterial
          color="#03060b"
          metalness={visualControls.wallMetalness + 0.04}
          opacity={visualControls.panelOpacity}
          roughness={visualControls.wallRoughness}
          transparent
        />
      </mesh>

      <GlowLine
        position={[0, H - 0.28, Zback + 0.035]}
        opacity={visualControls.guideOpacity}
        scale={[W * 2 - 0.95, 0.014, 0.014]}
      />
      <GlowLine
        position={[0, 0.28, Zback + 0.035]}
        opacity={visualControls.guideOpacity}
        scale={[W * 2 - 0.95, 0.014, 0.014]}
      />
      <GlowLine
        position={[-W + 0.46, H / 2, Zback + 0.035]}
        opacity={visualControls.guideOpacity}
        rotation={[0, 0, Math.PI / 2]}
        scale={[H - 0.72, 0.014, 0.014]}
      />
      <GlowLine
        position={[W - 0.46, H / 2, Zback + 0.035]}
        opacity={visualControls.guideOpacity}
        rotation={[0, 0, Math.PI / 2]}
        scale={[H - 0.72, 0.014, 0.014]}
      />

      {/* Left wall (character-right-wall = bio) */}
      <mesh
        position={layout.walls.characterRightWall.position}
        rotation={layout.walls.characterRightWall.rotation}
      >
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial
          color="#04080f"
          metalness={visualControls.wallMetalness}
          roughness={visualControls.wallRoughness}
        />
      </mesh>

      {/* Right wall (character-left-wall = gallery) */}
      <mesh
        position={layout.walls.characterLeftWall.position}
        rotation={layout.walls.characterLeftWall.rotation}
      >
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial
          color="#04080f"
          metalness={visualControls.wallMetalness}
          roughness={visualControls.wallRoughness}
        />
      </mesh>

      {/* Ceiling softbox (cinematic light panel) */}
      <mesh
        position={[0, H - 0.02, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[3.6, 0.5]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#fff4e4"
          map={softbox}
          transparent
          opacity={cinemaLightControls.softboxOpacity}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0.022, 0.86]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.18, 96]} />
        <meshBasicMaterial
          color="#d39a5d"
          opacity={cinemaLightControls.floorGlowOpacity}
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* Floor glow lines */}
      <GlowLine
        position={[0, 0.015, Zback + 0.1]}
        opacity={visualControls.guideOpacity * 0.8}
        scale={[W * 2 - 0.6, 0.018, 0.018]}
      />
      <GlowLine
        position={[-W + 0.12, 0.015, centerZ]}
        opacity={visualControls.guideOpacity * 0.65}
        rotation={[0, Math.PI / 2, 0]}
        scale={[D - 0.6, 0.018, 0.018]}
      />
      <GlowLine
        position={[W - 0.12, 0.015, centerZ]}
        opacity={visualControls.guideOpacity * 0.65}
        rotation={[0, Math.PI / 2, 0]}
        scale={[D - 0.6, 0.018, 0.018]}
      />

      {/* Ceiling glow lines */}
      <GlowLine
        position={[0, H - 0.08, Zback + 0.2]}
        opacity={visualControls.guideOpacity * 0.72}
        scale={[W * 2 - 1.2, 0.018, 0.018]}
      />
      <GlowLine
        position={[-W + 0.15, H - 0.08, centerZ]}
        opacity={visualControls.guideOpacity * 0.6}
        rotation={[0, Math.PI / 2, 0]}
        scale={[D - 1.2, 0.018, 0.018]}
      />
      <GlowLine
        position={[W - 0.15, H - 0.08, centerZ]}
        opacity={visualControls.guideOpacity * 0.6}
        rotation={[0, Math.PI / 2, 0]}
        scale={[D - 1.2, 0.018, 0.018]}
      />
      {children?.(layout)}
    </group>
  );
}

/* ──────────────────────── Scene wrapper ──────────────────────── */
function SceneContent({ copy }: BioRoomCanvasProps) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.008;
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={42} position={[0, 1.6, 6.2]} />
      <CameraRig />
      <RoomShell>
        {(layout) => <BioRoomWorldPanels copy={copy} layout={layout} />}
      </RoomShell>
      <group ref={groupRef}>
        <LucasBillboard />
      </group>
    </>
  );
}

export function BioRoomCanvas({ copy }: BioRoomCanvasProps) {
  return (
    <div className="bio-room-canvas">
      {/* Leva GUI panel — visible in dev mode */}
      <Leva
        collapsed={false}
        oneLineLabels
        titleBar={{ title: "🎬 Bio Room Controls" }}
      />
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <SceneContent copy={copy} />
      </Canvas>
    </div>
  );
}
