"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { type ThreeEvent, useFrame, useLoader } from "@react-three/fiber";
import { folder, useControls } from "leva";
import {
  CanvasTexture,
  DoubleSide,
  LinearFilter,
  MathUtils,
  SRGBColorSpace,
  TextureLoader,
  type Group,
} from "three";
import type { BioRoomLayout, WallSurface } from "@/components/bio-room/BioRoomLayout";
import { bioRoomPreset } from "@/data/bioRoomPreset";
import type { SiteCopy } from "@/data/site";
import { useBioRoomPresetStore } from "@/lib/useBioRoomPresetStore";
import { useBioRoomStore } from "@/lib/useBioRoomStore";

type BioRoomWorldPanelsProps = {
  copy: SiteCopy["bio"];
  layout: BioRoomLayout;
};

type WallSurfaceGroupProps = {
  wall: WallSurface;
  children: ReactNode;
};

type WallPanelProps = {
  height: number;
  width: number;
  x?: number;
  y?: number;
  z?: number;
  color?: string;
  opacity?: number;
};

type WallTextProps = {
  children: React.ReactNode;
  color?: string;
  fontSize: number;
  maxWidth?: number;
  textAlign?: "left" | "center" | "right";
  fontFamily?: string;
  x: number;
  y: number;
  z?: number;
};

type SocialIconKind = "facebook" | "instagram" | "tiktok" | "youtube";

const wallAccent = "#bdb6a5";
const wallAmber = "#d6a15f";
const wallInk = "#efe9dd";
const wallMuted = "#9ea6b4";
const collapsedLevaFolder = { collapsed: true } as const;

function openLink(href: string) {
  if (href.startsWith("#")) {
    window.location.hash = href.slice(1);
    return;
  }

  if (href.startsWith("mailto:")) {
    window.location.href = href;
    return;
  }

  window.open(href, "_blank", "noopener,noreferrer");
}

function WallSurfaceGroup({ children, wall }: WallSurfaceGroupProps) {
  return (
    <group
      name={wall.name}
      position={wall.position}
      rotation={wall.rotation}
    >
      {children}
    </group>
  );
}

function WallPanel({
  color = "#03070d",
  height,
  opacity = 0.68,
  width,
  x = 0,
  y = 0,
  z = 0.045,
}: WallPanelProps) {
  return (
    <mesh position={[x, y, z]}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        color={color}
        metalness={0.1}
        opacity={opacity}
        polygonOffset
        polygonOffsetFactor={-1}
        roughness={0.82}
        side={DoubleSide}
        transparent
      />
    </mesh>
  );
}

function WallGlowLine({
  color = wallAccent,
  height,
  opacity = 0.22,
  width,
  x,
  y,
  z = 0.075,
}: {
  color?: string;
  height: number;
  opacity?: number;
  width: number;
  x: number;
  y: number;
  z?: number;
}) {
  return (
    <mesh position={[x, y, z]}>
      <boxGeometry args={[width, height, 0.012]} />
      <meshBasicMaterial
        color={color}
        opacity={opacity}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}

function WallFrame({
  height,
  width,
  x = 0,
  y = 0,
}: {
  height: number;
  width: number;
  x?: number;
  y?: number;
}) {
  const thickness = 0.009;

  return (
    <group>
      <WallGlowLine height={thickness} width={width} x={x} y={y + height / 2} />
      <WallGlowLine height={thickness} width={width} x={x} y={y - height / 2} />
      <WallGlowLine height={height} width={thickness} x={x - width / 2} y={y} />
      <WallGlowLine height={height} width={thickness} x={x + width / 2} y={y} />
    </group>
  );
}

function WallText({
  children,
  color = wallInk,
  fontFamily = "Arial",
  fontSize,
  maxWidth,
  textAlign = "left",
  x,
  y,
  z = 0.105,
}: WallTextProps) {
  const text = typeof children === "string" ? children : String(children ?? "");
  const { height, texture, width } = useWallTextTexture({
    color,
    fontFamily,
    fontSize,
    maxWidth,
    text,
    textAlign,
  });
  const centeredX =
    textAlign === "center" ? x : textAlign === "right" ? x - width / 2 : x + width / 2;

  return (
    <mesh position={[centeredX, y, z]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        depthTest
        depthWrite
        map={texture}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}

function useWallTextTexture({
  color,
  fontFamily,
  fontSize,
  maxWidth,
  text,
  textAlign,
}: {
  color: string;
  fontFamily: string;
  fontSize: number;
  maxWidth?: number;
  text: string;
  textAlign: "left" | "center" | "right";
}) {
  return useMemo(() => {
    const pixelsPerUnit = 920;
    const width = Math.max(maxWidth ?? Math.min(2.8, Math.max(0.65, text.length * fontSize * 0.58)), 0.42);
    const fontPx = Math.max(18, Math.round(fontSize * pixelsPerUnit));
    const paddingX = Math.round(fontPx * 0.45);
    const paddingY = Math.round(fontPx * 0.32);
    const lineHeightPx = Math.round(fontPx * 1.18);
    const canvasWidth = Math.ceil(width * pixelsPerUnit);
    const formattedFontFamily = fontFamily.includes(" ")
      ? `"${fontFamily}", Arial, sans-serif`
      : `${fontFamily}, Arial, sans-serif`;

    const measureCanvas = document.createElement("canvas");
    const measureContext = measureCanvas.getContext("2d");

    if (!measureContext) {
      const emptyTexture = new CanvasTexture(measureCanvas);
      return { height: fontSize, texture: emptyTexture, width };
    }

    measureContext.font = `700 ${fontPx}px ${formattedFontFamily}`;
    const lines = wrapCanvasText(text, measureContext, canvasWidth - paddingX * 2);
    const canvasHeight = Math.max(
      Math.ceil(fontPx * 1.35),
      paddingY * 2 + lines.length * lineHeightPx,
    );
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const context = canvas.getContext("2d");

    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = `700 ${fontPx}px ${formattedFontFamily}`;
      context.fillStyle = color;
      context.textBaseline = "middle";
      context.textAlign = textAlign;

      const textX =
        textAlign === "center"
          ? canvas.width / 2
          : textAlign === "right"
            ? canvas.width - paddingX
            : paddingX;

      lines.forEach((line, index) => {
        context.fillText(
          line,
          textX,
          paddingY + lineHeightPx / 2 + index * lineHeightPx,
        );
      });
    }

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.needsUpdate = true;

    return {
      height: canvas.height / pixelsPerUnit,
      texture,
      width,
    };
  }, [color, fontFamily, fontSize, maxWidth, text, textAlign]);
}

function wrapCanvasText(
  text: string,
  context: CanvasRenderingContext2D,
  maxWidth: number,
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(testLine).width <= maxWidth || !currentLine) {
      currentLine = testLine;
      return;
    }

    lines.push(currentLine);
    currentLine = word;
  });

  if (currentLine) lines.push(currentLine);
  return lines.length > 0 ? lines : [text];
}

function getSocialIconKind(label: string): SocialIconKind | null {
  const normalized = label.toLowerCase();
  if (normalized.includes("youtube")) return "youtube";
  if (normalized.includes("instagram")) return "instagram";
  if (normalized.includes("facebook")) return "facebook";
  if (normalized.includes("tiktok")) return "tiktok";
  return null;
}

const socialIconSources: Record<SocialIconKind, string> = {
  facebook: "/images/social-icons/social-facebook-188.webp",
  instagram: "/images/social-icons/social-instagram-188.webp",
  tiktok: "/images/social-icons/social-tiktok-188.webp",
  youtube: "/images/social-icons/social-youtube-188.webp",
};

function getFrontWallBackgroundSource() {
  if (typeof window === "undefined") return "/images/bio-room/front-wall-background-1024.webp";

  const targetWidth = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
  if (targetWidth <= 768) return "/images/bio-room/front-wall-background-768.webp";
  if (targetWidth <= 1024) return "/images/bio-room/front-wall-background-1024.webp";
  if (targetWidth <= 1440) return "/images/bio-room/front-wall-background-1440.webp";
  return "/images/bio-room/front-wall-background-1672.webp";
}

function WallImageBackground({
  height,
  opacity = 0.72,
  scaleX = 1,
  scaleY = 1,
  width,
  x = 0,
  y = 0,
}: {
  height: number;
  opacity?: number;
  scaleX?: number;
  scaleY?: number;
  width: number;
  x?: number;
  y?: number;
}) {
  const [frontWallBackgroundSource] = useState(getFrontWallBackgroundSource);
  const texture = useLoader(TextureLoader, frontWallBackgroundSource);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;

  return (
    <mesh position={[x, y, 0.052]}>
      <planeGeometry args={[width * scaleX, height * scaleY]} />
      <meshBasicMaterial
        map={texture}
        opacity={opacity}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}

function SocialIconButton({
  href,
  kind,
  size,
  x,
  y,
}: {
  href: string;
  kind: SocialIconKind;
  size: number;
  x: number;
  y: number;
}) {
  const groupRef = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const texture = useLoader(TextureLoader, socialIconSources[kind]);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const targetScale = isHovered ? 1.16 : 1;
    const targetZ = isHovered ? 0.24 : 0.14;
    const targetRotationZ = isHovered
      ? Math.sin(state.clock.elapsedTime * 4.2) * 0.045
      : 0;

    const scale = MathUtils.damp(groupRef.current.scale.x, targetScale, 9, delta);
    groupRef.current.scale.setScalar(scale);
    groupRef.current.position.z = MathUtils.damp(groupRef.current.position.z, targetZ, 9, delta);
    groupRef.current.rotation.z = MathUtils.damp(groupRef.current.rotation.z, targetRotationZ, 8, delta);
  });

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    openLink(href);
  }

  function handlePointerOver(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = "pointer";
  }

  function handlePointerOut(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    setIsHovered(false);
    document.body.style.cursor = "";
  }

  return (
    <group
      onClick={handleClick}
      onPointerOut={handlePointerOut}
      onPointerOver={handlePointerOver}
      position={[x, y, 0.14]}
      ref={groupRef}
    >
      <mesh>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          transparent
        />
      </mesh>
    </group>
  );
}

function FrontWall3D({ copy, wall }: { copy: SiteCopy["bio"]; wall: WallSurface }) {
  const setPresetSection = useBioRoomPresetStore((state) => state.setSection);
  const socialLinks = copy.contactLinks
    .map((link) => ({ ...link, kind: getSocialIconKind(link.label) }))
    .filter((link): link is typeof link & { kind: SocialIconKind } => Boolean(link.kind))
    .sort((a, b) => {
      const order: SocialIconKind[] = ["youtube", "instagram", "facebook", "tiktok"];
      return order.indexOf(a.kind) - order.indexOf(b.kind);
    });
  const leftControls = useControls("FRONT WALL LEFT", {
    position: folder({
      leftX: { value: bioRoomPreset.frontWall.leftX, min: -4, max: 0, step: 0.02, label: "X" },
      leftY: { value: bioRoomPreset.frontWall.leftY, min: -1.5, max: 1.5, step: 0.02, label: "Y" },
      leftScale: { value: bioRoomPreset.frontWall.leftScale, min: 0.45, max: 1.8, step: 0.01, label: "Escala" },
    }, collapsedLevaFolder),
    box: folder({
      leftPanelWidth: { value: bioRoomPreset.frontWall.leftPanelWidth, min: 1, max: 3.4, step: 0.02, label: "Ancho caja" },
      leftPanelHeight: { value: bioRoomPreset.frontWall.leftPanelHeight, min: 0.7, max: 2.4, step: 0.02, label: "Alto caja" },
      leftPanelOpacity: { value: bioRoomPreset.frontWall.leftPanelOpacity, min: 0, max: 0.9, step: 0.01, label: "Opacidad" },
    }, collapsedLevaFolder),
    text: folder({
      leftTextX: { value: bioRoomPreset.frontWall.leftTextX, min: -1.5, max: 0.1, step: 0.02, label: "Texto X" },
      leftKickerSize: { value: bioRoomPreset.frontWall.leftKickerSize, min: 0.035, max: 0.12, step: 0.005, label: "Kicker" },
      leftTitleSize: { value: bioRoomPreset.frontWall.leftTitleSize, min: 0.12, max: 0.5, step: 0.005, label: "Titulo" },
      leftSubtitleSize: { value: bioRoomPreset.frontWall.leftSubtitleSize, min: 0.035, max: 0.12, step: 0.005, label: "Subtitulo" },
      leftBodySize: { value: bioRoomPreset.frontWall.leftBodySize, min: 0.04, max: 0.14, step: 0.005, label: "Frase" },
      leftSmallSize: { value: bioRoomPreset.frontWall.leftSmallSize, min: 0.03, max: 0.1, step: 0.005, label: "Texto chico" },
      leftKickerY: { value: bioRoomPreset.frontWall.leftKickerY, min: -1.2, max: 1.2, step: 0.02, label: "Kicker Y" },
      leftTitleY: { value: bioRoomPreset.frontWall.leftTitleY, min: -1.2, max: 1.2, step: 0.02, label: "Titulo Y" },
      leftSubtitleY: { value: bioRoomPreset.frontWall.leftSubtitleY, min: -1.2, max: 1.2, step: 0.02, label: "Subtitulo Y" },
      leftBodyY: { value: bioRoomPreset.frontWall.leftBodyY, min: -1.4, max: 1.2, step: 0.02, label: "Frase Y" },
      leftSmallY: { value: bioRoomPreset.frontWall.leftSmallY, min: -1.4, max: 1.2, step: 0.02, label: "Texto chico Y" },
      leftFont: { value: bioRoomPreset.frontWall.leftFont, label: "Fuente instalada" },
    }, collapsedLevaFolder),
  }, collapsedLevaFolder);
  const rightControls = useControls("FRONT WALL SOCIALS", {
    position: folder({
      rightX: { value: bioRoomPreset.frontWall.rightX, min: 0, max: 4, step: 0.02, label: "X" },
      rightY: { value: bioRoomPreset.frontWall.rightY, min: -1.5, max: 1.5, step: 0.02, label: "Y" },
      rightScale: { value: bioRoomPreset.frontWall.rightScale, min: 0.45, max: 1.8, step: 0.01, label: "Escala" },
    }, collapsedLevaFolder),
    box: folder({
      rightPanelWidth: { value: bioRoomPreset.frontWall.rightPanelWidth, min: 1, max: 3.4, step: 0.02, label: "Ancho caja" },
      rightPanelHeight: { value: bioRoomPreset.frontWall.rightPanelHeight, min: 0.7, max: 2.4, step: 0.02, label: "Alto caja" },
      rightPanelOpacity: { value: bioRoomPreset.frontWall.rightPanelOpacity, min: 0, max: 0.9, step: 0.01, label: "Opacidad" },
    }, collapsedLevaFolder),
    textAndIcons: folder({
      rightTextX: { value: bioRoomPreset.frontWall.rightTextX, min: -1.4, max: 0.2, step: 0.02, label: "Texto X" },
      rightTitleSize: { value: bioRoomPreset.frontWall.rightTitleSize, min: 0.06, max: 0.2, step: 0.005, label: "Titulo" },
      rightTitleY: { value: bioRoomPreset.frontWall.rightTitleY, min: -0.2, max: 1, step: 0.02, label: "Titulo Y" },
      rightBodySize: { value: bioRoomPreset.frontWall.rightBodySize, min: 0.03, max: 0.1, step: 0.005, label: "Texto" },
      rightFont: { value: bioRoomPreset.frontWall.rightFont, label: "Fuente instalada" },
      socialIconSize: { value: bioRoomPreset.frontWall.socialIconSize, min: 0.28, max: 0.9, step: 0.01, label: "Iconos" },
      socialIconGap: { value: bioRoomPreset.frontWall.socialIconGap, min: 0.32, max: 0.9, step: 0.01, label: "Separacion" },
      socialRowY: { value: bioRoomPreset.frontWall.socialRowY, min: -0.5, max: 0.7, step: 0.02, label: "Fila Y" },
      socialTextY: { value: bioRoomPreset.frontWall.socialTextY, min: -1.1, max: 0.3, step: 0.02, label: "Bajada Y" },
    }, collapsedLevaFolder),
  }, collapsedLevaFolder);
  const backgroundControls = useControls("pared-fondo", {
    backgroundX: { value: bioRoomPreset.frontWall.backgroundX, min: -1.2, max: 1.2, step: 0.01, label: "Mover X" },
    backgroundY: { value: bioRoomPreset.frontWall.backgroundY, min: -0.8, max: 0.8, step: 0.01, label: "Mover Y" },
    backgroundScaleX: { value: bioRoomPreset.frontWall.backgroundScaleX, min: 0.7, max: 1.6, step: 0.01, label: "Escala ancho" },
    backgroundScaleY: { value: bioRoomPreset.frontWall.backgroundScaleY, min: 0.7, max: 1.6, step: 0.01, label: "Escala alto" },
  }, { collapsed: false });

  useEffect(() => {
    setPresetSection("frontWall", {
      ...leftControls,
      ...rightControls,
      ...backgroundControls,
    });
  }, [backgroundControls, leftControls, rightControls, setPresetSection]);

  return (
    <WallSurfaceGroup wall={wall}>
      <WallPanel height={wall.height - 0.48} width={wall.width - 0.72} />
      <WallImageBackground
        height={wall.height - 0.6}
        scaleX={backgroundControls.backgroundScaleX}
        scaleY={backgroundControls.backgroundScaleY}
        width={wall.width - 0.88}
        x={backgroundControls.backgroundX}
        y={backgroundControls.backgroundY}
      />
      <WallFrame height={wall.height - 0.56} width={wall.width - 0.84} />

      <group
        position={[leftControls.leftX, leftControls.leftY, 0]}
        scale={[leftControls.leftScale, leftControls.leftScale, 1]}
      >
        <WallPanel
          color="#02050a"
          height={leftControls.leftPanelHeight}
          opacity={leftControls.leftPanelOpacity}
          width={leftControls.leftPanelWidth}
        />
        <WallGlowLine
          height={leftControls.leftPanelHeight * 0.78}
          opacity={0.34}
          width={0.014}
          x={-leftControls.leftPanelWidth / 2 + 0.18}
          y={0.01}
        />
        <WallText color={wallAmber} fontFamily={leftControls.leftFont} fontSize={leftControls.leftKickerSize} maxWidth={1.7} x={leftControls.leftTextX} y={leftControls.leftKickerY}>
          {copy.kicker}
        </WallText>
        <WallText fontFamily={leftControls.leftFont} fontSize={leftControls.leftTitleSize} maxWidth={2.24} x={leftControls.leftTextX} y={leftControls.leftTitleY}>
          BAJO FLOW
        </WallText>
        <WallText color={wallMuted} fontFamily={leftControls.leftFont} fontSize={leftControls.leftSubtitleSize} maxWidth={2.06} x={leftControls.leftTextX} y={leftControls.leftSubtitleY}>
          {copy.identitySubtitle}
        </WallText>
        <WallText fontFamily={leftControls.leftFont} fontSize={leftControls.leftBodySize} maxWidth={1.96} x={leftControls.leftTextX} y={leftControls.leftBodyY}>
          {copy.frontParagraphs[0]}
        </WallText>
        <WallText color={wallMuted} fontFamily={leftControls.leftFont} fontSize={leftControls.leftSmallSize} maxWidth={1.96} x={leftControls.leftTextX} y={leftControls.leftSmallY}>
          {copy.frontParagraphs[1]}
        </WallText>
      </group>

      <group
        position={[rightControls.rightX, rightControls.rightY, 0]}
        scale={[rightControls.rightScale, rightControls.rightScale, 1]}
      >
        <WallPanel
          color="#02050a"
          height={rightControls.rightPanelHeight}
          opacity={rightControls.rightPanelOpacity}
          width={rightControls.rightPanelWidth}
        />
        <WallText fontFamily={rightControls.rightFont} fontSize={rightControls.rightTitleSize} maxWidth={1.8} x={rightControls.rightTextX} y={rightControls.rightTitleY}>
          Redes Sociales
        </WallText>
        {socialLinks.map((link, index) => (
          <SocialIconButton
            href={link.href}
            key={link.label}
            kind={link.kind}
            size={rightControls.socialIconSize}
            x={-(socialLinks.length - 1) * rightControls.socialIconGap / 2 + index * rightControls.socialIconGap}
            y={rightControls.socialRowY}
          />
        ))}
        <WallText color={wallMuted} fontFamily={rightControls.rightFont} fontSize={rightControls.rightBodySize} maxWidth={1.86} x={rightControls.rightTextX} y={rightControls.socialTextY}>
          Seguime para ver piezas, procesos, color y cortes pensados para marcas, artistas y contenido digital.
        </WallText>
      </group>
    </WallSurfaceGroup>
  );
}

function BioContributionRow3D({
  text,
  title,
  fontSize,
  x,
  y,
}: {
  text: string;
  title: string;
  fontSize: number;
  x: number;
  y: number;
}) {
  return (
    <group position={[x, y, 0.12]}>
      <WallText color={wallInk} fontSize={fontSize} maxWidth={1.22} x={0} y={0} z={0.04}>
        {`${title}:`}
      </WallText>
      <WallText color={wallMuted} fontSize={fontSize} maxWidth={2.58} x={1.06} y={0} z={0.04}>
        {text}
      </WallText>
    </group>
  );
}

function WallPngImage3D({
  height,
  opacity,
  scale = 1,
  src,
  width,
  x,
  y,
  z = 0.2,
}: {
  height: number;
  opacity: number;
  scale?: number;
  src: string;
  width: number;
  x: number;
  y: number;
  z?: number;
}) {
  const texture = useLoader(TextureLoader, src);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;

  return (
    <mesh position={[x, y, z]}>
      <planeGeometry args={[width * scale, height * scale]} />
      <meshBasicMaterial
        alphaTest={0.02}
        map={texture}
        opacity={opacity}
        side={DoubleSide}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}

function BioWall3D({ copy, wall }: { copy: SiteCopy["bio"]; wall: WallSurface }) {
  const setPresetSection = useBioRoomPresetStore((state) => state.setSection);
  const controls = useControls("MURO IZQUIERDO (Bio)", {
    "Contenido general": folder({
      contentX: { value: bioRoomPreset.bioWall.contentX, min: -1.5, max: 1.5, step: 0.02, label: "Mover X" },
      contentY: { value: bioRoomPreset.bioWall.contentY, min: -1.2, max: 1.2, step: 0.02, label: "Mover Y" },
      contentScale: { value: bioRoomPreset.bioWall.contentScale, min: 0.65, max: 1.45, step: 0.01, label: "Escala" },
    }, collapsedLevaFolder),
    "Panel fondo": folder({
      panelX: { value: bioRoomPreset.bioWall.panelX, min: -2, max: 2, step: 0.02, label: "X" },
      panelY: { value: bioRoomPreset.bioWall.panelY, min: -1.2, max: 1.2, step: 0.02, label: "Y" },
      panelWidth: { value: bioRoomPreset.bioWall.panelWidth, min: 2.5, max: 5.4, step: 0.02, label: "Ancho" },
      panelHeight: { value: bioRoomPreset.bioWall.panelHeight, min: 1.8, max: 3.4, step: 0.02, label: "Alto" },
      panelOpacity: { value: bioRoomPreset.bioWall.panelOpacity, min: 0, max: 0.95, step: 0.01, label: "Opacidad" },
    }, collapsedLevaFolder),
    "Textos": folder({
      titleX: { value: bioRoomPreset.bioWall.titleX, min: -3, max: -0.3, step: 0.02, label: "Titulo X" },
      titleY: { value: bioRoomPreset.bioWall.titleY, min: -0.2, max: 1.5, step: 0.02, label: "Titulo Y" },
      titleSize: { value: bioRoomPreset.bioWall.titleSize, min: 0.09, max: 0.28, step: 0.005, label: "Titulo tamano" },
      paragraphX: { value: bioRoomPreset.bioWall.paragraphX, min: -3, max: -0.3, step: 0.02, label: "Parrafos X" },
      paragraphOneY: { value: bioRoomPreset.bioWall.paragraphOneY, min: -0.5, max: 1.2, step: 0.02, label: "Parrafo 1 Y" },
      paragraphTwoY: { value: bioRoomPreset.bioWall.paragraphTwoY, min: -1, max: 0.7, step: 0.02, label: "Parrafo 2 Y" },
      paragraphSize: { value: bioRoomPreset.bioWall.paragraphSize, min: 0.04, max: 0.11, step: 0.005, label: "Parrafo tamano" },
    }, collapsedLevaFolder),
    "Aportes": folder({
      contributionLabelX: { value: bioRoomPreset.bioWall.contributionLabelX, min: -3, max: 0.4, step: 0.02, label: "Titulo aportes X" },
      contributionLabelY: { value: bioRoomPreset.bioWall.contributionLabelY, min: -1.2, max: 0.4, step: 0.02, label: "Titulo aportes Y" },
      contributionRowsX: { value: bioRoomPreset.bioWall.contributionRowsX, min: -3, max: 0.4, step: 0.02, label: "Filas aportes X" },
      contributionStartY: { value: bioRoomPreset.bioWall.contributionStartY, min: -1.4, max: 0.2, step: 0.02, label: "Inicio filas Y" },
      contributionGap: { value: bioRoomPreset.bioWall.contributionGap, min: 0.1, max: 0.3, step: 0.01, label: "Separacion" },
      contributionSize: { value: bioRoomPreset.bioWall.contributionSize, min: 0.04, max: 0.09, step: 0.005, label: "Tamano" },
    }, collapsedLevaFolder),
    "Imagen sentado": folder({
      sittingImageX: { value: bioRoomPreset.bioWall.sittingImageX, min: -3, max: 0.6, step: 0.02, label: "Imagen X" },
      sittingImageY: { value: bioRoomPreset.bioWall.sittingImageY, min: -1.5, max: 0.4, step: 0.02, label: "Imagen Y" },
      sittingImageWidth: { value: bioRoomPreset.bioWall.sittingImageWidth, min: 0.4, max: 2.6, step: 0.02, label: "Ancho" },
      sittingImageHeight: { value: bioRoomPreset.bioWall.sittingImageHeight, min: 0.25, max: 1.6, step: 0.02, label: "Alto" },
      sittingImageScale: { value: bioRoomPreset.bioWall.sittingImageScale, min: 0.35, max: 3.6, step: 0.02, label: "Escala uniforme" },
      sittingImageOpacity: { value: bioRoomPreset.bioWall.sittingImageOpacity, min: 0, max: 1, step: 0.01, label: "Opacidad" },
    }, collapsedLevaFolder),
  }, collapsedLevaFolder);

  useEffect(() => {
    setPresetSection("bioWall", controls);
  }, [controls, setPresetSection]);

  return (
    <WallSurfaceGroup wall={wall}>
      <WallPanel height={wall.height - 0.58} width={wall.width - 0.72} />
      <group position={[controls.contentX, controls.contentY, 0]} scale={controls.contentScale}>
      <group position={[controls.panelX, controls.panelY, 0.08]}>
        <WallPanel color="#030611" height={controls.panelHeight} opacity={controls.panelOpacity} width={controls.panelWidth} z={0} />
        <WallGlowLine color="#00f0ff" height={0.84} opacity={0.9} width={0.018} x={-2.12} y={-0.67} z={0.055} />
      </group>
      <WallText fontSize={controls.titleSize} maxWidth={3.42} x={controls.titleX} y={controls.titleY} z={0.16}>
        {copy.title}
      </WallText>
      <WallText color={wallMuted} fontSize={controls.paragraphSize} maxWidth={3.48} x={controls.paragraphX} y={controls.paragraphOneY} z={0.16}>
        {copy.paragraphs[0]}
      </WallText>
      <WallText color={wallMuted} fontSize={controls.paragraphSize} maxWidth={3.48} x={controls.paragraphX} y={controls.paragraphTwoY} z={0.16}>
        {copy.paragraphs[1]}
      </WallText>
      <WallText color="#00f0ff" fontSize={0.078} maxWidth={3.5} x={controls.contributionLabelX} y={controls.contributionLabelY} z={0.16}>
        LO QUE APORTO A CADA PROYECTO:
      </WallText>
      {copy.bioBlocks.map((block, index) => (
        <BioContributionRow3D
          key={block.title}
          fontSize={controls.contributionSize}
          text={block.text}
          title={block.title}
          x={controls.contributionRowsX}
          y={controls.contributionStartY - index * controls.contributionGap}
        />
      ))}
      <WallPngImage3D
        height={controls.sittingImageHeight}
        opacity={controls.sittingImageOpacity}
        scale={controls.sittingImageScale}
        src="/assets/bio-room/lucas-sentado.png"
        width={controls.sittingImageWidth}
        x={controls.sittingImageX}
        y={controls.sittingImageY}
      />
      </group>
    </WallSurfaceGroup>
  );
}

const accentColors: Record<string, string> = {
  blue: "#5ea1ff",
  cyan: "#00d4f5",
  violet: "#9f7bff",
  pink: "#ff4d8d",
  amber: "#d6a15f",
  green: "#4dffb4",
};

function getSkillThumbnail(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function getSkillPoster(item: SiteCopy["bio"]["skillItems"][number]) {
  return item.poster ?? (item.videoId ? getSkillThumbnail(item.videoId) : "");
}

function SkillThumbnail({
  item,
  onClick,
  restZ,
  hoverZ,
  width,
  x,
  y,
}: {
  item: SiteCopy["bio"]["skillItems"][number];
  onClick: () => void;
  restZ: number;
  hoverZ: number;
  width: number;
  x: number;
  y: number;
}) {
  const groupRef = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const posterSrc = getSkillPoster(item);
  const texture = useLoader(TextureLoader, posterSrc || "/images/bio-room/front-wall-background-768.webp");
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  const height = width * (9 / 16);
  const accent = accentColors[item.accent] ?? "#5ea1ff";

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetZ = isHovered ? hoverZ : restZ;
    groupRef.current.position.z = MathUtils.damp(groupRef.current.position.z, targetZ, 8, delta);
  });

  return (
    <group
      onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(); }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setIsHovered(false); document.body.style.cursor = ""; }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setIsHovered(true); document.body.style.cursor = "pointer"; }}
      position={[x, y, restZ]}
      ref={groupRef}
    >
      {/* Dark background — slightly behind the image */}
      <mesh position={[0, 0, -0.012]}>
        <planeGeometry args={[width + 0.08, height + 0.08]} />
        <meshBasicMaterial color="#010208" polygonOffset polygonOffsetFactor={2} polygonOffsetUnits={2} />
      </mesh>
      {/* Thumbnail image */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
          toneMapped={false}
        />
      </mesh>
      {/* Border frame using WallFrame primitives */}
      <WallGlowLine color={isHovered ? accent : wallAccent} height={height + 0.08} opacity={isHovered ? 0.86 : 0.28} width={0.009} x={-width / 2 - 0.04} y={0} z={0.015} />
      <WallGlowLine color={isHovered ? accent : wallAccent} height={height + 0.08} opacity={isHovered ? 0.86 : 0.28} width={0.009} x={width / 2 + 0.04} y={0} z={0.015} />
      <WallGlowLine color={isHovered ? accent : wallAccent} height={0.009} opacity={isHovered ? 0.72 : 0.22} width={width + 0.08} x={0} y={height / 2 + 0.04} z={0.015} />
      <WallGlowLine color={isHovered ? accent : wallAccent} height={0.009} opacity={isHovered ? 0.72 : 0.22} width={width + 0.08} x={0} y={-height / 2 - 0.04} z={0.015} />
    </group>
  );
}

function SkillsWall3D({ copy, wall }: { copy: SiteCopy["bio"]; wall: WallSurface }) {
  const openGalleryItem = useBioRoomStore((state) => state.openGalleryItem);
  const setPresetSection = useBioRoomPresetStore((state) => state.setSection);
  const controls = useControls("MURO DERECHO (Habilidades)", {
    "Contenido general": folder({
      showFrame: { value: bioRoomPreset.skillsWall.showFrame, label: "Mostrar marco" },
      contentX: { value: bioRoomPreset.skillsWall.contentX, min: -1.5, max: 1.5, step: 0.02, label: "Mover X" },
      contentY: { value: bioRoomPreset.skillsWall.contentY, min: -1.2, max: 1.2, step: 0.02, label: "Mover Y" },
      contentScale: { value: bioRoomPreset.skillsWall.contentScale, min: 0.65, max: 1.45, step: 0.01, label: "Escala" },
    }, collapsedLevaFolder),
    "Panel mural": folder({
      panelWidth: { value: bioRoomPreset.skillsWall.panelWidth, min: 3.4, max: 5.8, step: 0.02, label: "Panel ancho" },
      panelHeight: { value: bioRoomPreset.skillsWall.panelHeight, min: 2.2, max: 3.4, step: 0.02, label: "Panel alto" },
      panelOpacity: { value: bioRoomPreset.skillsWall.panelOpacity, min: 0, max: 0.95, step: 0.01, label: "Opacidad" },
      frameWidth: { value: bioRoomPreset.skillsWall.frameWidth, min: 3.4, max: 5.8, step: 0.02, label: "Marco ancho" },
      frameHeight: { value: bioRoomPreset.skillsWall.frameHeight, min: 2.2, max: 3.4, step: 0.02, label: "Marco alto" },
    }, collapsedLevaFolder),
    "Titulo": folder({
      headerY: { value: bioRoomPreset.skillsWall.headerY, min: 0.25, max: 1.45, step: 0.02, label: "Bloque Y" },
      kickerSize: { value: bioRoomPreset.skillsWall.kickerSize, min: 0.035, max: 0.1, step: 0.005, label: "Showcase" },
      titleSize: { value: bioRoomPreset.skillsWall.titleSize, min: 0.12, max: 0.38, step: 0.005, label: "Habilidades" },
      subtitleSize: { value: bioRoomPreset.skillsWall.subtitleSize, min: 0.035, max: 0.1, step: 0.005, label: "Subtitulo" },
      dividerWidth: { value: bioRoomPreset.skillsWall.dividerWidth, min: 1.2, max: 4.8, step: 0.05, label: "Linea ancho" },
      dividerY: { value: bioRoomPreset.skillsWall.dividerY, min: -0.1, max: 0.6, step: 0.02, label: "Linea Y" },
    }, collapsedLevaFolder),
    "Tarjetas": folder({
      cardsY: { value: bioRoomPreset.skillsWall.cardsY, min: -0.75, max: 0.45, step: 0.02, label: "Fila Y" },
      thumbWidth: { value: bioRoomPreset.skillsWall.thumbWidth, min: 0.75, max: 1.65, step: 0.02, label: "Video ancho" },
      cardGap: { value: bioRoomPreset.skillsWall.cardGap, min: -0.1, max: 0.7, step: 0.02, label: "Separacion" },
      numberSize: { value: bioRoomPreset.skillsWall.numberSize, min: 0.035, max: 0.09, step: 0.005, label: "Numero" },
      cardTitleSize: { value: bioRoomPreset.skillsWall.cardTitleSize, min: 0.04, max: 0.11, step: 0.005, label: "Titulo" },
      cardDescriptionSize: { value: bioRoomPreset.skillsWall.cardDescriptionSize, min: 0.035, max: 0.09, step: 0.005, label: "Descripcion" },
      ctaSize: { value: bioRoomPreset.skillsWall.ctaSize, min: 0.035, max: 0.08, step: 0.005, label: "Ver" },
    }, collapsedLevaFolder),
    "Profundidad": folder({
      thumbnailLiftZ: { value: bioRoomPreset.skillsWall.thumbnailLiftZ, min: 0.04, max: 0.28, step: 0.01, label: "Video Z" },
      thumbnailHoverZ: { value: bioRoomPreset.skillsWall.thumbnailHoverZ, min: 0.08, max: 0.38, step: 0.01, label: "Hover Z" },
    }, collapsedLevaFolder),
    "Imagen sentado": folder({
      sittingImageX: { value: bioRoomPreset.skillsWall.sittingImageX, min: -0.4, max: 3.2, step: 0.02, label: "Imagen X" },
      sittingImageY: { value: bioRoomPreset.skillsWall.sittingImageY, min: -1.5, max: 0.6, step: 0.02, label: "Imagen Y" },
      sittingImageScale: { value: bioRoomPreset.skillsWall.sittingImageScale, min: 0.35, max: 3.6, step: 0.02, label: "Escala uniforme" },
      sittingImageOpacity: { value: bioRoomPreset.skillsWall.sittingImageOpacity, min: 0, max: 1, step: 0.01, label: "Opacidad" },
    }, collapsedLevaFolder),
  }, collapsedLevaFolder);

  useEffect(() => {
    setPresetSection("skillsWall", controls);
  }, [controls, setPresetSection]);

  // The camera lateral view shows roughly ±1.6 units from center X.
  // Layout: header row top-center, 3 cards in a horizontal row below.
  // Each card = thumbnail + number + title + description below it.

  const thumbW = controls.thumbWidth;           // thumbnail width
  const thumbH = thumbW * (9 / 16); // ~0.72
  const cardGap = controls.cardGap;           // horizontal gap between cards
  const numCards = copy.skillItems.length; // 3
  const totalRowW = numCards * thumbW + (numCards - 1) * cardGap; // ~4.32
  const firstCardX = -totalRowW / 2 + thumbW / 2; // leftmost card center X
  const cardsY = controls.cardsY;          // vertical center of the card row
  const headerY = controls.headerY;           // top of header area

  return (
    <WallSurfaceGroup wall={wall}>
      {/* Base wall panel */}
      <WallPanel height={wall.height - 0.48} width={wall.width - 0.72} />
      {/* Dark inner panel — tighter to the visible camera area */}
      <WallPanel color="#030611" height={controls.panelHeight} opacity={controls.panelOpacity} width={controls.panelWidth} z={0.04} />
      {/* Outer frame around visible content */}
      {controls.showFrame ? <WallFrame height={controls.frameHeight} width={controls.frameWidth} /> : null}
      <WallPngImage3D
        height={0.7}
        opacity={controls.sittingImageOpacity}
        scale={controls.sittingImageScale}
        src="/assets/bio-room/lucas-sentado-blanco.png"
        width={1.24}
        x={controls.sittingImageX}
        y={controls.sittingImageY}
        z={0.23}
      />

      <group position={[controls.contentX, controls.contentY, 0]} scale={controls.contentScale}>

      {/* ── HEADER ── centered */}
      {/* Kicker */}
      <WallText color="#9f7bff" fontSize={controls.kickerSize} maxWidth={2.4} textAlign="center" x={0} y={headerY} z={0.22}>
        SHOWCASE TÉCNICO
      </WallText>
      {/* Main title */}
      <WallText fontSize={controls.titleSize} maxWidth={2.8} textAlign="center" x={0} y={headerY - 0.34} z={0.20}>
        HABILIDADES
      </WallText>
      {/* Subtitle */}
      <WallText color={wallMuted} fontSize={controls.subtitleSize} maxWidth={2.8} textAlign="center" x={0} y={headerY - 0.72} z={0.18}>
        Nodos técnicos conectados por sonido, color y motion.
      </WallText>

      {/* Divider */}
      <WallGlowLine color="#9f7bff" height={0.006} opacity={0.38} width={controls.dividerWidth} x={0} y={controls.dividerY} z={0.16} />

      {/* ── SKILL CARDS — horizontal row ── */}
      {copy.skillItems.map((item, index) => {
        const accent = accentColors[item.accent] ?? "#5ea1ff";
        const numLabel = String(index + 1).padStart(2, "0");
        const cardX = firstCardX + index * (thumbW + cardGap);

        return (
          <group key={item.title}>
            {/* Number badge */}
            <WallText color={accent} fontSize={controls.numberSize} maxWidth={0.28} textAlign="center" x={cardX} y={cardsY + thumbH / 2 + 0.14} z={0.24}>
              {numLabel}
            </WallText>

            {/* Thumbnail */}
            <SkillThumbnail
              hoverZ={controls.thumbnailHoverZ}
              item={item}
              onClick={() => openGalleryItem(item)}
              restZ={controls.thumbnailLiftZ}
              width={thumbW}
              x={cardX}
              y={cardsY}
            />

            {/* Title below thumbnail */}
            <WallText fontSize={controls.cardTitleSize} maxWidth={thumbW} textAlign="center" x={cardX} y={cardsY - thumbH / 2 - 0.2} z={0.20}>
              {item.title}
            </WallText>

            {/* Description below title */}
            <WallText color={wallMuted} fontSize={controls.cardDescriptionSize} maxWidth={thumbW - 0.04} textAlign="center" x={cardX} y={cardsY - thumbH / 2 - 0.52} z={0.18}>
              {item.description}
            </WallText>

            {/* "Ver ▶" CTA */}
            <WallText color={accent} fontSize={controls.ctaSize} maxWidth={0.6} textAlign="center" x={cardX} y={cardsY - thumbH / 2 - 0.72} z={0.22}>
              Ver ▶
            </WallText>

            {/* Vertical separator between cards */}
            {index < numCards - 1 && (
              <WallGlowLine
                color={wallAccent}
                height={thumbH + 0.8}
                opacity={0.14}
                width={0.007}
                x={cardX + thumbW / 2 + cardGap / 2}
                y={cardsY - 0.12}
                z={0.1}
              />
            )}
          </group>
        );
      })}

      </group>
    </WallSurfaceGroup>
  );
}

export function BioRoomWorldPanels({ copy, layout }: BioRoomWorldPanelsProps) {
  return (
    <>
      <FrontWall3D copy={copy} wall={layout.walls.backWall} />
      <BioWall3D copy={copy} wall={layout.walls.characterRightWall} />
      <SkillsWall3D copy={copy} wall={layout.walls.characterLeftWall} />
    </>
  );
}
