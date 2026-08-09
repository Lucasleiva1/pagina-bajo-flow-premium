"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { folder, useControls } from "leva";
import * as THREE from "three";
import { bioRoomPreset } from "@/data/bioRoomPreset";
import { useBioRoomPresetStore } from "@/lib/useBioRoomPresetStore";
import { type BioRoomView, useBioRoomStore } from "@/lib/useBioRoomStore";
import { playClickTick, playHoverTick } from "@/lib/soundEffects";

type FloorButtonConfig = {
  accent: string;
  index: string;
  label: string;
  position: [number, number, number];
  rotation: number;
  view: Exclude<BioRoomView, "home">;
};

type FloorButtonProps = FloorButtonConfig & {
  buttonDepth: number;
  buttonWidth: number;
  glowOpacity: number;
  labelSize: number;
  opacity: number;
  scaleX: number;
  scaleZ: number;
};

function createButtonTexture({
  accent,
  index,
  label,
  labelSize,
  hovered,
}: {
  accent: string;
  index: string;
  label: string;
  labelSize: number;
  hovered: boolean;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const borderAlpha = hovered ? 0.98 : 0.72;
  const corner = 34;
  const x = 20;
  const y = 24;
  const width = canvas.width - x * 2;
  const height = canvas.height - y * 2;

  ctx.beginPath();
  ctx.moveTo(x + corner, y);
  ctx.lineTo(x + width - corner, y);
  ctx.lineTo(x + width, y + corner);
  ctx.lineTo(x + width, y + height - corner);
  ctx.lineTo(x + width - corner, y + height);
  ctx.lineTo(x + corner, y + height);
  ctx.lineTo(x, y + height - corner);
  ctx.lineTo(x, y + corner);
  ctx.closePath();

  ctx.strokeStyle = accent;
  ctx.globalAlpha = borderAlpha;
  ctx.lineWidth = hovered ? 10 : 7;
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = accent;
  ctx.globalAlpha = hovered ? 0.95 : 0.72;
  ctx.fillRect(58, 56, 104, 8);
  ctx.fillRect(canvas.width - 162, canvas.height - 64, 104, 8);
  ctx.globalAlpha = 1;

  ctx.font = "700 34px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(226, 240, 255, 0.78)";
  ctx.fillText(index, 72, 128);

  ctx.font = `900 ${labelSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = hovered ? "#ffffff" : "#e8f2ff";
  ctx.shadowColor = accent;
  ctx.shadowBlur = hovered ? 22 : 12;
  ctx.fillText(label, 552, 133);
  ctx.shadowBlur = 0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  return texture;
}

function FloorButton({
  accent,
  buttonDepth,
  buttonWidth,
  glowOpacity,
  index,
  label,
  labelSize,
  opacity,
  position,
  rotation,
  scaleX,
  scaleZ,
  view,
}: FloorButtonProps) {
  const setActiveRoomView = useBioRoomStore((state) => state.setActiveRoomView);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    const nextTexture = createButtonTexture({ accent, hovered, index, label, labelSize });
    setTexture(nextTexture);

    return () => {
      nextTexture?.dispose();
    };
  }, [accent, hovered, index, label, labelSize]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  useFrame((_, delta) => {
    const targetOpacity = hovered ? 1 : opacity;
    const targetGlow = hovered ? glowOpacity * 2.1 : glowOpacity;

    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.damp(materialRef.current.opacity, targetOpacity, 12, delta);
    }

    if (glowRef.current) {
      glowRef.current.opacity = THREE.MathUtils.damp(glowRef.current.opacity, targetGlow, 10, delta);
    }
  });

  const activateView = () => {
    playClickTick();
    setActiveRoomView(view);
  };

  if (!texture) return null;

  return (
    <group position={position}>
      <mesh
        onPointerDown={(event) => {
          event.stopPropagation();
          activateView();
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "";
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
          playHoverTick();
        }}
        position={[0, 0.006, 0]}
        rotation={[-Math.PI / 2, 0, rotation]}
        renderOrder={21}
      >
        <planeGeometry args={[buttonWidth * scaleX * 1.35, buttonDepth * scaleZ * 1.7]} />
        <meshBasicMaterial
          color="#ffffff"
          depthTest={false}
          depthWrite={false}
          opacity={0.001}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      <mesh position={[0, -0.003, 0]} rotation={[-Math.PI / 2, 0, rotation]} renderOrder={19}>
        <planeGeometry args={[buttonWidth * scaleX * 1.18, buttonDepth * scaleZ * 1.42]} />
        <meshBasicMaterial
          ref={glowRef}
          color={accent}
          depthTest={false}
          depthWrite={false}
          opacity={glowOpacity}
          toneMapped={false}
          transparent
        />
      </mesh>
      <mesh
        onPointerDown={(event) => {
          event.stopPropagation();
          activateView();
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "";
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
          playHoverTick();
        }}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, rotation]}
        renderOrder={20}
      >
        <planeGeometry args={[buttonWidth * scaleX, buttonDepth * scaleZ]} />
        <meshBasicMaterial
          ref={materialRef}
          depthTest={false}
          depthWrite={false}
          map={texture}
          opacity={opacity}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
        />
      </mesh>
    </group>
  );
}

export function LucasFloorHUD({
  horizontalSpacingMultiplier = 1,
  scaleMultiplier = 1,
}: {
  horizontalSpacingMultiplier?: number;
  scaleMultiplier?: number;
}) {
  const activeRoomView = useBioRoomStore((state) => state.activeRoomView);
  const setPresetSection = useBioRoomPresetStore((state) => state.setSection);

  const controls = useControls("BOTONES PISO", {
    Grupo: folder({
      groupX: { value: bioRoomPreset.floorButtons.groupX, min: -3, max: 3, step: 0.02, label: "X" },
      groupY: { value: bioRoomPreset.floorButtons.groupY, min: 0.005, max: 0.16, step: 0.001, label: "Y altura" },
      groupZ: { value: bioRoomPreset.floorButtons.groupZ, min: -2, max: 2.5, step: 0.02, label: "Z" },
      scale: { value: bioRoomPreset.floorButtons.scale, min: 0.35, max: 2.2, step: 0.01, label: "Escala grupo" },
      gap: { value: bioRoomPreset.floorButtons.gap, min: -0.3, max: 0.8, step: 0.01, label: "Separacion" },
    }),
    BIO: folder({
      bioX: { value: bioRoomPreset.floorButtons.bioX, min: -2.6, max: 2.6, step: 0.02, label: "X" },
      bioY: { value: bioRoomPreset.floorButtons.bioY, min: -0.08, max: 0.12, step: 0.001, label: "Y" },
      bioZ: { value: bioRoomPreset.floorButtons.bioZ, min: -1, max: 2.4, step: 0.02, label: "Z" },
      bioWidth: { value: bioRoomPreset.floorButtons.bioWidth, min: 0.35, max: 2.2, step: 0.01, label: "Ancho" },
      bioDepth: { value: bioRoomPreset.floorButtons.bioDepth, min: 0.1, max: 0.9, step: 0.01, label: "Profundidad" },
      bioScaleX: { value: bioRoomPreset.floorButtons.bioScaleX, min: 0.25, max: 2.5, step: 0.01, label: "Deformar X" },
      bioScaleZ: { value: bioRoomPreset.floorButtons.bioScaleZ, min: 0.25, max: 2.5, step: 0.01, label: "Deformar Z" },
      bioRotation: { value: bioRoomPreset.floorButtons.bioRotation, min: -Math.PI, max: Math.PI, step: 0.01, label: "Rotacion" },
      bioOpacity: { value: bioRoomPreset.floorButtons.bioOpacity, min: 0.1, max: 1, step: 0.01, label: "Opacidad" },
      bioGlowOpacity: { value: bioRoomPreset.floorButtons.bioGlowOpacity, min: 0, max: 0.5, step: 0.01, label: "Glow" },
      bioLabelSize: { value: bioRoomPreset.floorButtons.bioLabelSize, min: 42, max: 116, step: 1, label: "Texto" },
    }, { collapsed: true }),
    HABILIDADES: folder({
      skillsX: { value: bioRoomPreset.floorButtons.skillsX, min: -2.6, max: 2.6, step: 0.02, label: "X" },
      skillsY: { value: bioRoomPreset.floorButtons.skillsY, min: -0.08, max: 0.12, step: 0.001, label: "Y" },
      skillsZ: { value: bioRoomPreset.floorButtons.skillsZ, min: -1, max: 2.4, step: 0.02, label: "Z" },
      skillsWidth: { value: bioRoomPreset.floorButtons.skillsWidth, min: 0.35, max: 2.2, step: 0.01, label: "Ancho" },
      skillsDepth: { value: bioRoomPreset.floorButtons.skillsDepth, min: 0.1, max: 0.9, step: 0.01, label: "Profundidad" },
      skillsScaleX: { value: bioRoomPreset.floorButtons.skillsScaleX, min: 0.25, max: 2.5, step: 0.01, label: "Deformar X" },
      skillsScaleZ: { value: bioRoomPreset.floorButtons.skillsScaleZ, min: 0.25, max: 2.5, step: 0.01, label: "Deformar Z" },
      skillsRotation: { value: bioRoomPreset.floorButtons.skillsRotation, min: -Math.PI, max: Math.PI, step: 0.01, label: "Rotacion" },
      skillsOpacity: { value: bioRoomPreset.floorButtons.skillsOpacity, min: 0.1, max: 1, step: 0.01, label: "Opacidad" },
      skillsGlowOpacity: { value: bioRoomPreset.floorButtons.skillsGlowOpacity, min: 0, max: 0.5, step: 0.01, label: "Glow" },
      skillsLabelSize: { value: bioRoomPreset.floorButtons.skillsLabelSize, min: 42, max: 116, step: 1, label: "Texto" },
    }, { collapsed: true }),
    CONTACTO: folder({
      contactX: { value: bioRoomPreset.floorButtons.contactX, min: -2.6, max: 2.6, step: 0.02, label: "X" },
      contactY: { value: bioRoomPreset.floorButtons.contactY, min: -0.08, max: 0.12, step: 0.001, label: "Y" },
      contactZ: { value: bioRoomPreset.floorButtons.contactZ, min: -1, max: 2.4, step: 0.02, label: "Z" },
      contactWidth: { value: bioRoomPreset.floorButtons.contactWidth, min: 0.35, max: 2.2, step: 0.01, label: "Ancho" },
      contactDepth: { value: bioRoomPreset.floorButtons.contactDepth, min: 0.1, max: 0.9, step: 0.01, label: "Profundidad" },
      contactScaleX: { value: bioRoomPreset.floorButtons.contactScaleX, min: 0.25, max: 2.5, step: 0.01, label: "Deformar X" },
      contactScaleZ: { value: bioRoomPreset.floorButtons.contactScaleZ, min: 0.25, max: 2.5, step: 0.01, label: "Deformar Z" },
      contactRotation: { value: bioRoomPreset.floorButtons.contactRotation, min: -Math.PI, max: Math.PI, step: 0.01, label: "Rotacion" },
      contactOpacity: { value: bioRoomPreset.floorButtons.contactOpacity, min: 0.1, max: 1, step: 0.01, label: "Opacidad" },
      contactGlowOpacity: { value: bioRoomPreset.floorButtons.contactGlowOpacity, min: 0, max: 0.5, step: 0.01, label: "Glow" },
      contactLabelSize: { value: bioRoomPreset.floorButtons.contactLabelSize, min: 42, max: 116, step: 1, label: "Texto" },
    }, { collapsed: true }),
  });

  useEffect(() => {
    setPresetSection("floorButtons", controls);
  }, [controls, setPresetSection]);

  const buttons = useMemo<FloorButtonConfig[]>(
    () => [
      {
        accent: "#ffb454",
        index: "01",
        label: "BIO",
        position: [(controls.bioX - controls.gap) * horizontalSpacingMultiplier, controls.bioY, controls.bioZ],
        rotation: controls.bioRotation,
        view: "bio",
      },
      {
        accent: "#9f7bff",
        index: "02",
        label: "HABILIDADES",
        position: [controls.skillsX * horizontalSpacingMultiplier, controls.skillsY, controls.skillsZ],
        rotation: controls.skillsRotation,
        view: "gallery",
      },
      {
        accent: "#e2f0ff",
        index: "03",
        label: "CONTACTO",
        position: [controls.contactX + controls.gap, controls.contactY, controls.contactZ],
        rotation: controls.contactRotation,
        view: "contact",
      },
    ],
    [
      controls.bioRotation,
      controls.bioX,
      controls.bioY,
      controls.bioZ,
      controls.contactRotation,
      controls.contactX,
      controls.contactY,
      controls.contactZ,
      controls.gap,
      controls.skillsRotation,
      controls.skillsX,
      controls.skillsY,
      controls.skillsZ,
      horizontalSpacingMultiplier,
    ],
  );

  if (activeRoomView !== "home") return null;

  return (
    <group
      position={[controls.groupX, controls.groupY, controls.groupZ]}
      scale={controls.scale * scaleMultiplier}
    >
      {buttons.map((button) => (
        <FloorButton
          buttonDepth={
            button.view === "bio" ? controls.bioDepth : button.view === "gallery" ? controls.skillsDepth : controls.contactDepth
          }
          buttonWidth={
            button.view === "bio" ? controls.bioWidth : button.view === "gallery" ? controls.skillsWidth : controls.contactWidth
          }
          glowOpacity={
            button.view === "bio"
              ? controls.bioGlowOpacity
              : button.view === "gallery"
                ? controls.skillsGlowOpacity
                : controls.contactGlowOpacity
          }
          key={button.view}
          labelSize={
            button.view === "bio" ? controls.bioLabelSize : button.view === "gallery" ? controls.skillsLabelSize : controls.contactLabelSize
          }
          opacity={
            button.view === "bio" ? controls.bioOpacity : button.view === "gallery" ? controls.skillsOpacity : controls.contactOpacity
          }
          scaleX={
            button.view === "bio" ? controls.bioScaleX : button.view === "gallery" ? controls.skillsScaleX : controls.contactScaleX
          }
          scaleZ={
            button.view === "bio" ? controls.bioScaleZ : button.view === "gallery" ? controls.skillsScaleZ : controls.contactScaleZ
          }
          {...button}
        />
      ))}
    </group>
  );
}
