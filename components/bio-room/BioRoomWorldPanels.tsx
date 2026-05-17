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
  height,
  opacity = 0.22,
  width,
  x,
  y,
  z = 0.075,
}: {
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
        color={wallAccent}
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

function getGalleryTextureSource(src: string) {
  return `${src.replace("/assets/bio-room/", "/images/bio-room/").replace(/\.(png|jpe?g)$/i, "")}-480.webp`;
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
  label,
  labelY,
  size,
  x,
  y,
}: {
  href: string;
  kind: SocialIconKind;
  label: string;
  labelY: number;
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
      <WallText color={wallMuted} fontSize={0.038} maxWidth={0.7} textAlign="center" x={0} y={labelY} z={0.05}>
        {label}
      </WallText>
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
      socialLabelY: { value: bioRoomPreset.frontWall.socialLabelY, min: -0.8, max: -0.1, step: 0.01, label: "Label Y" },
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
          {copy.paragraphs[0]}
        </WallText>
        <WallText color={wallMuted} fontFamily={leftControls.leftFont} fontSize={leftControls.leftSmallSize} maxWidth={1.96} x={leftControls.leftTextX} y={leftControls.leftSmallY}>
          {copy.paragraphs[1]}
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
            label={link.label}
            labelY={rightControls.socialLabelY}
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

function BioBlock3D({
  text,
  title,
  x,
  y,
}: {
  text: string;
  title: string;
  x: number;
  y: number;
}) {
  return (
    <group position={[x, y, 0.08]}>
      <WallPanel color="#050a12" height={0.78} opacity={0.72} width={2.75} z={0} />
      <WallFrame height={0.78} width={2.75} />
      <WallText color={wallAmber} fontSize={0.078} maxWidth={2.3} x={-1.17} y={0.21} z={0.045}>
        {title}
      </WallText>
      <WallText color={wallMuted} fontSize={0.058} maxWidth={2.28} x={-1.17} y={-0.09} z={0.045}>
        {text}
      </WallText>
    </group>
  );
}

function BioWall3D({ copy, wall }: { copy: SiteCopy["bio"]; wall: WallSurface }) {
  const positions = [
    [-2.05, 0.28],
    [1.05, 0.28],
    [-2.05, -0.68],
    [1.05, -0.68],
  ] as const;

  return (
    <WallSurfaceGroup wall={wall}>
      <WallPanel height={wall.height - 0.58} width={wall.width - 0.72} />
      <WallFrame height={wall.height - 0.66} width={wall.width - 0.86} />
      <WallText color={wallAmber} fontSize={0.09} maxWidth={1.6} x={-3.34} y={1.08}>
        Bio
      </WallText>
      <WallText fontSize={0.19} maxWidth={4.5} x={-3.34} y={0.82}>
        {copy.title}
      </WallText>
      {copy.bioBlocks.map((block, index) => (
        <BioBlock3D
          key={block.title}
          text={block.text}
          title={block.title}
          x={positions[index]?.[0] ?? -2.05}
          y={positions[index]?.[1] ?? -0.68}
        />
      ))}
    </WallSurfaceGroup>
  );
}

function GalleryCard3D({
  category,
  image,
  onClick,
  title,
  x,
  y,
}: {
  category: string;
  image: string;
  onClick: (event: ThreeEvent<MouseEvent>) => void;
  title: string;
  x: number;
  y: number;
}) {
  const texture = useLoader(TextureLoader, image);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;

  return (
    <group position={[x, y, 0.09]}>
      <mesh onClick={onClick}>
        <planeGeometry args={[1.42, 0.88]} />
        <meshStandardMaterial
          color="#050a12"
          emissive="#0d0810"
          emissiveIntensity={0.06}
          metalness={0.12}
          roughness={0.78}
        />
      </mesh>
      <WallFrame height={0.88} width={1.42} />
      <mesh position={[0, 0.13, 0.04]}>
        <planeGeometry args={[1.18, 0.52]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <WallText fontSize={0.062} maxWidth={1.1} textAlign="center" x={0} y={-0.23} z={0.05}>
        {title}
      </WallText>
      <WallText color={wallMuted} fontSize={0.042} maxWidth={1.1} textAlign="center" x={0} y={-0.36} z={0.05}>
        {category}
      </WallText>
    </group>
  );
}

function GalleryWall3D({ copy, wall }: { copy: SiteCopy["bio"]; wall: WallSurface }) {
  const openGalleryItem = useBioRoomStore((state) => state.openGalleryItem);

  return (
    <WallSurfaceGroup wall={wall}>
      <WallPanel height={wall.height - 0.58} width={wall.width - 0.72} />
      <WallFrame height={wall.height - 0.66} width={wall.width - 0.86} />
      <WallText color={wallAmber} fontSize={0.09} maxWidth={1.8} x={-3.34} y={1.08}>
        Galeria visual
      </WallText>
      <WallText fontSize={0.22} maxWidth={3.2} x={-3.34} y={0.8}>
        Trabajos
      </WallText>
      {copy.galleryItems.map((item, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        return (
          <GalleryCard3D
            category={item.category}
            image={getGalleryTextureSource(item.image)}
            key={item.title}
            onClick={(event) => {
              event.stopPropagation();
              openGalleryItem(item);
            }}
            title={item.title}
            x={-2.15 + col * 1.62}
            y={0.18 - row * 1.02}
          />
        );
      })}
    </WallSurfaceGroup>
  );
}

export function BioRoomWorldPanels({ copy, layout }: BioRoomWorldPanelsProps) {
  return (
    <>
      <FrontWall3D copy={copy} wall={layout.walls.backWall} />
      <BioWall3D copy={copy} wall={layout.walls.characterRightWall} />
      <GalleryWall3D copy={copy} wall={layout.walls.characterLeftWall} />
    </>
  );
}
