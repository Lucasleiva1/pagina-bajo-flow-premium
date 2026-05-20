"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { type ThreeEvent, useFrame, useLoader, useThree } from "@react-three/fiber";
import { folder, useControls } from "leva";
import {
  CanvasTexture,
  DoubleSide,
  LinearFilter,
  LinearMipmapLinearFilter,
  MathUtils,
  SRGBColorSpace,
  TextureLoader,
  type Group,
} from "three";
import type { BioRoomLayout, WallSurface } from "@/components/bio-room/BioRoomLayout";
import { bioRoomPreset, type BioRoomPreset } from "@/data/bioRoomPreset";
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
  fontFamily?: string;
  fontStyle?: "normal" | "italic";
  fontWeight?: number;
  letterSpacing?: number;
  lineHeight?: number;
  maxWidth?: number;
  opacity?: number;
  textAlign?: "left" | "center" | "right";
  x: number;
  y: number;
  z?: number;
};

type SocialIconKind = "facebook" | "instagram" | "tiktok" | "youtube";
type BioWallControls = BioRoomPreset["bioWall"];

const wallAccent = "#bdb6a5";
const wallAmber = "#d6a15f";
const wallInk = "#efe9dd";
const wallMuted = "#9ea6b4";
const collapsedLevaFolder = { collapsed: true } as const;
const editorialSerif = "DM Serif Display";
const editorialCondensed = "Bebas Neue";
const editorialUi = "Space Grotesk";

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
  fontStyle = "normal",
  fontSize,
  fontWeight = 700,
  letterSpacing = 0,
  lineHeight = 1.18,
  maxWidth,
  opacity = 1,
  textAlign = "left",
  x,
  y,
  z = 0.105,
}: WallTextProps) {
  const text = typeof children === "string" ? children : String(children ?? "");
  const { gl } = useThree();
  const [fontsReady, setFontsReady] = useState(() => typeof document === "undefined" || !("fonts" in document));

  useEffect(() => {
    if (typeof document === "undefined" || !("fonts" in document)) {
      setFontsReady(true);
      return;
    }

    let isMounted = true;
    document.fonts.ready.then(() => {
      if (isMounted) setFontsReady(true);
    });

    return () => {
      isMounted = false;
    };
  }, [fontFamily]);

  const textAnisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 8);
  const { height, texture, width } = useWallTextTexture({
    anisotropy: textAnisotropy,
    color,
    fontFamily,
    fontStyle,
    fontSize,
    fontWeight,
    fontsReady,
    letterSpacing,
    lineHeight,
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
        map={texture}
        opacity={opacity}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}

function useWallTextTexture({
  anisotropy,
  color,
  fontFamily,
  fontStyle,
  fontSize,
  fontWeight,
  fontsReady,
  letterSpacing,
  lineHeight,
  maxWidth,
  text,
  textAlign,
}: {
  anisotropy: number;
  color: string;
  fontFamily: string;
  fontStyle: "normal" | "italic";
  fontSize: number;
  fontWeight: number;
  fontsReady: boolean;
  letterSpacing: number;
  lineHeight: number;
  maxWidth?: number;
  text: string;
  textAlign: "left" | "center" | "right";
}) {
  return useMemo(() => {
    const isWideViewport =
      typeof window !== "undefined" && window.matchMedia("(min-width: 900px)").matches;
    const pixelsPerUnit = isWideViewport ? 1320 : 980;
    const width = Math.max(maxWidth ?? Math.min(2.8, Math.max(0.65, text.length * fontSize * 0.58)), 0.42);
    const fontPx = Math.max(18, Math.round(fontSize * pixelsPerUnit));
    const paddingX = Math.round(fontPx * 0.45);
    const paddingY = Math.round(fontPx * 0.32);
    const lineHeightPx = Math.round(fontPx * lineHeight);
    const canvasWidth = Math.ceil(width * pixelsPerUnit);
    const resolvedFontFamily = resolveCanvasFontFamily(fontFamily);
    const formattedFontFamily = formatCanvasFontFamily(resolvedFontFamily);
    const font = `${fontStyle} ${fontWeight} ${fontPx}px ${formattedFontFamily}`;

    const measureCanvas = document.createElement("canvas");
    const measureContext = measureCanvas.getContext("2d");

    if (!measureContext) {
      const emptyTexture = new CanvasTexture(measureCanvas);
      emptyTexture.colorSpace = SRGBColorSpace;
      emptyTexture.minFilter = LinearMipmapLinearFilter;
      emptyTexture.magFilter = LinearFilter;
      emptyTexture.anisotropy = anisotropy;
      return { height: fontSize, texture: emptyTexture, width };
    }

    if (!fontsReady) {
      const pendingCanvas = document.createElement("canvas");
      pendingCanvas.width = canvasWidth;
      pendingCanvas.height = Math.ceil(fontPx * 1.35);
      const pendingTexture = new CanvasTexture(pendingCanvas);
      pendingTexture.colorSpace = SRGBColorSpace;
      pendingTexture.minFilter = LinearMipmapLinearFilter;
      pendingTexture.magFilter = LinearFilter;
      pendingTexture.anisotropy = anisotropy;
      return { height: pendingCanvas.height / pixelsPerUnit, texture: pendingTexture, width };
    }

    measureContext.font = font;
    const letterSpacingPx = Math.round(letterSpacing * pixelsPerUnit);
    const lines = wrapCanvasText(text, measureContext, canvasWidth - paddingX * 2, letterSpacingPx);
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
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.font = font;
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
        drawCanvasTextWithLetterSpacing(
          context,
          line,
          textX,
          paddingY + lineHeightPx / 2 + index * lineHeightPx,
          letterSpacingPx,
          textAlign,
        );
      });
    }

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.magFilter = LinearFilter;
    texture.anisotropy = anisotropy;
    texture.needsUpdate = true;

    return {
      height: canvas.height / pixelsPerUnit,
      texture,
      width,
    };
  }, [anisotropy, color, fontFamily, fontSize, fontStyle, fontWeight, fontsReady, letterSpacing, lineHeight, maxWidth, text, textAlign]);
}

function wrapCanvasText(
  text: string,
  context: CanvasRenderingContext2D,
  maxWidth: number,
  letterSpacingPx = 0,
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (measureTextWidth(context, testLine, letterSpacingPx) <= maxWidth || !currentLine) {
      currentLine = testLine;
      return;
    }

    lines.push(currentLine);
    currentLine = word;
  });

  if (currentLine) lines.push(currentLine);
  return lines.length > 0 ? lines : [text];
}

function resolveCanvasFontFamily(fontFamily: string) {
  if (typeof document === "undefined") return fontFamily;

  const style = getComputedStyle(document.body);
  if (fontFamily === editorialSerif) return style.getPropertyValue("--font-editorial-serif").trim() || fontFamily;
  if (fontFamily === editorialCondensed) return style.getPropertyValue("--font-editorial-condensed").trim() || fontFamily;
  if (fontFamily === editorialUi) return style.getPropertyValue("--font-editorial-ui").trim() || fontFamily;

  if (fontFamily.startsWith("var(")) {
    const variableName = fontFamily.slice(4, -1).trim();
    return style.getPropertyValue(variableName).trim() || fontFamily;
  }

  return fontFamily;
}

function formatCanvasFontFamily(fontFamily: string) {
  if (fontFamily.includes(",")) return fontFamily;
  return fontFamily.includes(" ") ? `"${fontFamily}", Arial, sans-serif` : `${fontFamily}, Arial, sans-serif`;
}

function measureTextWidth(
  context: CanvasRenderingContext2D,
  text: string,
  letterSpacingPx: number,
) {
  if (letterSpacingPx === 0 || text.length < 2) return context.measureText(text).width;
  return context.measureText(text).width + letterSpacingPx * (text.length - 1);
}

function drawCanvasTextWithLetterSpacing(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  letterSpacingPx: number,
  textAlign: "left" | "center" | "right",
) {
  if (letterSpacingPx === 0 || text.length < 2) {
    context.fillText(text, x, y);
    return;
  }

  const width = measureTextWidth(context, text, letterSpacingPx);
  let cursorX = textAlign === "center" ? x - width / 2 : textAlign === "right" ? x - width : x;
  context.save();
  context.textAlign = "left";

  Array.from(text).forEach((character) => {
    context.fillText(character, cursorX, y);
    cursorX += context.measureText(character).width + letterSpacingPx;
  });

  context.restore();
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

function BioContributionCard3D({
  accent,
  bodySize,
  bodyWidth,
  cardHeight,
  cardWidth,
  index,
  numberSize,
  text,
  title,
  titleSize,
  x,
  y,
}: {
  accent: string;
  bodySize: number;
  bodyWidth: number;
  cardHeight: number;
  cardWidth: number;
  index: number;
  numberSize: number;
  text: string;
  title: string;
  titleSize: number;
  x: number;
  y: number;
}) {
  return (
    <group position={[x, y, 0.2]}>
      <WallPanel color="#020710" height={cardHeight} opacity={0.62} width={cardWidth} z={0.01} />
      <WallFrame height={cardHeight} width={cardWidth} />
      <WallText
        color={accent}
        fontFamily={editorialUi}
        fontSize={numberSize}
        fontWeight={600}
        letterSpacing={0.016}
        maxWidth={0.4}
        x={-cardWidth / 2 + 0.12}
        y={cardHeight / 2 - 0.1}
        z={0.08}
      >
        {String(index + 1).padStart(2, "0")}
      </WallText>
      <WallText
        fontFamily={editorialSerif}
        fontSize={titleSize}
        fontWeight={400}
        maxWidth={bodyWidth}
        x={-cardWidth / 2 + 0.16}
        y={-0.04}
        z={0.08}
      >
        {title}
      </WallText>
      <WallText
        color="#c9d1dd"
        fontFamily={editorialUi}
        fontSize={bodySize}
        fontWeight={400}
        lineHeight={1.28}
        maxWidth={bodyWidth}
        x={-cardWidth / 2 + 0.16}
        y={-0.21}
        z={0.08}
      >
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

function BioWallContent3D({
  controls,
  copy,
  wall,
}: {
  controls: BioWallControls;
  copy: SiteCopy["bio"];
  wall: WallSurface;
}) {
  const cardAccent = ["#5ea1ff", "#3b7cff", "#65ddff", "#8fa4ff"];

  return (
    <WallSurfaceGroup wall={wall}>
      <WallPanel height={wall.height - 0.58} width={wall.width - 0.72} z={0.14} />
      <group position={[controls.contentX, controls.contentY, controls.contentZ]} scale={controls.contentScale}>
        <group position={[controls.panelX, controls.panelY, 0.08]}>
          <WallPanel color="#02050b" height={Math.max(controls.panelHeight, 3.08)} opacity={controls.panelOpacity} width={Math.max(controls.panelWidth, 5.42)} z={0} />
          <WallGlowLine color="#3b82ff" height={0.005} opacity={controls.decorLineOpacity} width={4.9} x={0.22} y={-1.43} z={0.055} />
          <WallGlowLine color="#3b82ff" height={0.64} opacity={controls.decorLineOpacity} width={0.014} x={2.58} y={0.82} z={0.055} />
          <WallGlowLine color="#5ea1ff" height={0.006} opacity={controls.decorLineOpacity} width={0.78} x={0.06} y={1.23} z={0.055} />
          <WallGlowLine color="#5ea1ff" height={0.006} opacity={controls.decorLineOpacity} width={0.84} x={2.1} y={-0.58} z={0.055} />
        </group>

        {copy.backgroundWords.map((word, index) => (
          <WallText
            color="#1b335a"
            fontFamily={editorialCondensed}
            fontSize={controls.bgWordsSize}
            fontWeight={400}
            letterSpacing={0.012}
            maxWidth={1.32}
            opacity={controls.bgWordsOpacity}
            textAlign="center"
            x={controls.bgWordsX}
            y={controls.bgWordsY - index * controls.bgWordsGap}
            z={0.14}
            key={word}
          >
            {word.toUpperCase()}
          </WallText>
        ))}

        <WallText
          color="#64a6ff"
          fontFamily={editorialUi}
          fontSize={controls.topNavSize}
          fontWeight={600}
          letterSpacing={0.026}
          maxWidth={controls.topNavWidth}
          x={controls.topNavX}
          y={controls.topNavY}
          z={0.22}
        >
          {copy.editorialNav.map((item) => item.toUpperCase()).join(" / ")}
        </WallText>
        <WallText
          fontFamily={editorialSerif}
          fontSize={controls.headlineSize}
          fontWeight={400}
          lineHeight={0.98}
          maxWidth={controls.headlineWidth}
          x={controls.headlineX}
          y={controls.headlineY}
          z={0.22}
        >
          {copy.title}
        </WallText>
        <WallText
          color="#d9dde8"
          fontFamily={editorialUi}
          fontSize={controls.introSize}
          fontWeight={400}
          lineHeight={1.22}
          maxWidth={controls.introWidth}
          x={controls.introX}
          y={controls.introY}
          z={0.22}
        >
          {`${copy.editorialIntro.prefix} ${copy.editorialIntro.name}, ${copy.editorialIntro.suffix}`}
        </WallText>
        {copy.editorialColumns.map((paragraph, index) => (
          <WallText
            color="#c3cad7"
            fontFamily={editorialUi}
            fontSize={controls.columnsSize}
            fontWeight={400}
            lineHeight={1.3}
            maxWidth={controls.columnsWidth}
            x={controls.columnsX + index * controls.columnsGap}
            y={controls.columnsY}
            z={0.22}
            key={paragraph}
          >
            {paragraph}
          </WallText>
        ))}
        <WallGlowLine color="#687083" height={controls.columnDividerHeight} opacity={0.42} width={0.007} x={controls.columnDividerX} y={controls.columnDividerY} z={0.22} />
        <WallText
          color="#5ea1ff"
          fontFamily={editorialSerif}
          fontSize={controls.quoteMarkSize}
          fontWeight={400}
          maxWidth={0.34}
          x={controls.quoteMarkX}
          y={controls.quoteY}
          z={0.22}
        >
          "
        </WallText>
        <WallText
          fontFamily={editorialSerif}
          fontSize={controls.quoteSize}
          fontStyle="italic"
          fontWeight={400}
          lineHeight={1.06}
          maxWidth={controls.quoteWidth}
          x={controls.quoteX}
          y={controls.quoteY}
          z={0.22}
        >
          {copy.editorialQuote}
        </WallText>
        <WallText
          color="#5ea1ff"
          fontFamily={editorialUi}
          fontSize={controls.contributionTitleSize}
          fontWeight={600}
          letterSpacing={0.035}
          maxWidth={1.7}
          x={controls.contributionTitleX}
          y={controls.contributionTitleY}
          z={0.22}
        >
          {copy.contributionLabel.toUpperCase()}
        </WallText>
        {copy.bioBlocks.map((block, index) => (
          <BioContributionCard3D
            accent={cardAccent[index] ?? "#5ea1ff"}
            bodySize={controls.cardBodySize}
            bodyWidth={controls.cardBodyWidth}
            cardHeight={controls.cardHeight}
            cardWidth={controls.cardWidth}
            index={index}
            key={block.title}
            numberSize={controls.cardNumberSize}
            text={block.text}
            title={block.title}
            titleSize={controls.cardTitleSize}
            x={controls.cardStartX + index * controls.cardGap}
            y={controls.cardY}
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
          z={0.27}
        />
      </group>
    </WallSurfaceGroup>
  );
}

function BioWallWithLeva3D({ copy, wall }: { copy: SiteCopy["bio"]; wall: WallSurface }) {
  const setPresetSection = useBioRoomPresetStore((state) => state.setSection);
  const controls = useControls("MURO IZQUIERDO (Bio)", {
    "Contenido general": folder({
      contentX: { value: bioRoomPreset.bioWall.contentX, min: -3.5, max: 2, step: 0.02, label: "Mover X" },
      contentY: { value: bioRoomPreset.bioWall.contentY, min: -1.2, max: 1.2, step: 0.02, label: "Mover Y" },
      contentZ: { value: bioRoomPreset.bioWall.contentZ, min: 0.02, max: 0.75, step: 0.01, label: "Separar de pared" },
      contentScale: { value: bioRoomPreset.bioWall.contentScale, min: 0.65, max: 1.45, step: 0.01, label: "Escala" },
    }, collapsedLevaFolder),
    "Panel fondo": folder({
      panelX: { value: bioRoomPreset.bioWall.panelX, min: -4, max: 2.5, step: 0.02, label: "X" },
      panelY: { value: bioRoomPreset.bioWall.panelY, min: -1.2, max: 1.2, step: 0.02, label: "Y" },
      panelWidth: { value: bioRoomPreset.bioWall.panelWidth, min: 2.5, max: 5.4, step: 0.02, label: "Ancho" },
      panelHeight: { value: bioRoomPreset.bioWall.panelHeight, min: 1.8, max: 3.4, step: 0.02, label: "Alto" },
      panelOpacity: { value: bioRoomPreset.bioWall.panelOpacity, min: 0, max: 0.95, step: 0.01, label: "Opacidad" },
    }, collapsedLevaFolder),
    "Textos": folder({
      titleX: { value: bioRoomPreset.bioWall.titleX, min: -5, max: 1, step: 0.02, label: "Titulo X" },
      titleY: { value: bioRoomPreset.bioWall.titleY, min: -0.2, max: 1.5, step: 0.02, label: "Titulo Y" },
      titleSize: { value: bioRoomPreset.bioWall.titleSize, min: 0.09, max: 0.28, step: 0.005, label: "Titulo tamano" },
      paragraphX: { value: bioRoomPreset.bioWall.paragraphX, min: -5, max: 1, step: 0.02, label: "Parrafos X" },
      paragraphOneY: { value: bioRoomPreset.bioWall.paragraphOneY, min: -0.5, max: 1.2, step: 0.02, label: "Parrafo 1 Y" },
      paragraphTwoY: { value: bioRoomPreset.bioWall.paragraphTwoY, min: -1, max: 0.7, step: 0.02, label: "Parrafo 2 Y" },
      paragraphSize: { value: bioRoomPreset.bioWall.paragraphSize, min: 0.04, max: 0.11, step: 0.005, label: "Parrafo tamano" },
    }, collapsedLevaFolder),
    "Palabras fondo": folder({
      bgWordsX: { value: bioRoomPreset.bioWall.bgWordsX, min: -5, max: 0.8, step: 0.02, label: "X" },
      bgWordsY: { value: bioRoomPreset.bioWall.bgWordsY, min: -0.2, max: 1.5, step: 0.02, label: "Y" },
      bgWordsGap: { value: bioRoomPreset.bioWall.bgWordsGap, min: 0.25, max: 0.8, step: 0.01, label: "Separacion" },
      bgWordsSize: { value: bioRoomPreset.bioWall.bgWordsSize, min: 0.18, max: 0.7, step: 0.005, label: "Tamano" },
      bgWordsOpacity: { value: bioRoomPreset.bioWall.bgWordsOpacity, min: 0, max: 1, step: 0.01, label: "Opacidad" },
    }, collapsedLevaFolder),
    "Barra superior": folder({
      topNavX: { value: bioRoomPreset.bioWall.topNavX, min: -4, max: 2.8, step: 0.02, label: "X" },
      topNavY: { value: bioRoomPreset.bioWall.topNavY, min: 0.6, max: 1.55, step: 0.02, label: "Y" },
      topNavSize: { value: bioRoomPreset.bioWall.topNavSize, min: 0.025, max: 0.09, step: 0.005, label: "Tamano" },
      topNavWidth: { value: bioRoomPreset.bioWall.topNavWidth, min: 1.2, max: 3.4, step: 0.02, label: "Ancho" },
    }, collapsedLevaFolder),
    "Titulo editorial": folder({
      headlineX: { value: bioRoomPreset.bioWall.headlineX, min: -4, max: 2.8, step: 0.02, label: "X" },
      headlineY: { value: bioRoomPreset.bioWall.headlineY, min: 0.45, max: 1.45, step: 0.02, label: "Y" },
      headlineSize: { value: bioRoomPreset.bioWall.headlineSize, min: 0.08, max: 0.36, step: 0.005, label: "Tamano" },
      headlineWidth: { value: bioRoomPreset.bioWall.headlineWidth, min: 1.3, max: 3.8, step: 0.02, label: "Ancho" },
    }, collapsedLevaFolder),
    "Intro": folder({
      introX: { value: bioRoomPreset.bioWall.introX, min: -4, max: 2.8, step: 0.02, label: "X bloque" },
      introY: { value: bioRoomPreset.bioWall.introY, min: -0.2, max: 1.1, step: 0.02, label: "Y" },
      introSize: { value: bioRoomPreset.bioWall.introSize, min: 0.03, max: 0.1, step: 0.005, label: "Tamano" },
      introWidth: { value: bioRoomPreset.bioWall.introWidth, min: 0.8, max: 3.6, step: 0.02, label: "Ancho" },
    }, collapsedLevaFolder),
    "Columnas": folder({
      columnsX: { value: bioRoomPreset.bioWall.columnsX, min: -4, max: 2.8, step: 0.02, label: "X" },
      columnsY: { value: bioRoomPreset.bioWall.columnsY, min: -0.5, max: 0.8, step: 0.02, label: "Y" },
      columnsGap: { value: bioRoomPreset.bioWall.columnsGap, min: 0.6, max: 2, step: 0.02, label: "Separacion" },
      columnsSize: { value: bioRoomPreset.bioWall.columnsSize, min: 0.025, max: 0.09, step: 0.005, label: "Tamano" },
      columnsWidth: { value: bioRoomPreset.bioWall.columnsWidth, min: 0.6, max: 1.8, step: 0.02, label: "Ancho" },
      columnDividerX: { value: bioRoomPreset.bioWall.columnDividerX, min: -4, max: 2.8, step: 0.02, label: "Linea X" },
      columnDividerY: { value: bioRoomPreset.bioWall.columnDividerY, min: -0.6, max: 0.8, step: 0.02, label: "Linea Y" },
      columnDividerHeight: { value: bioRoomPreset.bioWall.columnDividerHeight, min: 0, max: 1.2, step: 0.02, label: "Linea alto" },
    }, collapsedLevaFolder),
    "Frase quote": folder({
      quoteMarkX: { value: bioRoomPreset.bioWall.quoteMarkX, min: -4, max: 2.8, step: 0.02, label: "Comillas X" },
      quoteX: { value: bioRoomPreset.bioWall.quoteX, min: -4, max: 2.8, step: 0.02, label: "Texto X" },
      quoteY: { value: bioRoomPreset.bioWall.quoteY, min: -1, max: 0.4, step: 0.02, label: "Y" },
      quoteMarkSize: { value: bioRoomPreset.bioWall.quoteMarkSize, min: 0.06, max: 0.32, step: 0.005, label: "Comillas tamano" },
      quoteSize: { value: bioRoomPreset.bioWall.quoteSize, min: 0.04, max: 0.18, step: 0.005, label: "Texto tamano" },
      quoteWidth: { value: bioRoomPreset.bioWall.quoteWidth, min: 0.9, max: 3.2, step: 0.02, label: "Ancho" },
    }, collapsedLevaFolder),
    "Titulo aportes": folder({
      contributionTitleX: { value: bioRoomPreset.bioWall.contributionTitleX, min: -4, max: 2.8, step: 0.02, label: "X" },
      contributionTitleY: { value: bioRoomPreset.bioWall.contributionTitleY, min: -1.3, max: 0.2, step: 0.02, label: "Y" },
      contributionTitleSize: { value: bioRoomPreset.bioWall.contributionTitleSize, min: 0.025, max: 0.09, step: 0.005, label: "Tamano" },
    }, collapsedLevaFolder),
    "Tarjetas aportes": folder({
      cardStartX: { value: bioRoomPreset.bioWall.cardStartX, min: -4, max: 1.6, step: 0.02, label: "Inicio X" },
      cardY: { value: bioRoomPreset.bioWall.cardY, min: -1.45, max: -0.35, step: 0.02, label: "Y" },
      cardGap: { value: bioRoomPreset.bioWall.cardGap, min: 0.65, max: 1.3, step: 0.02, label: "Separacion" },
      cardWidth: { value: bioRoomPreset.bioWall.cardWidth, min: 0.55, max: 1.4, step: 0.02, label: "Ancho" },
      cardHeight: { value: bioRoomPreset.bioWall.cardHeight, min: 0.32, max: 0.9, step: 0.02, label: "Alto" },
      cardNumberSize: { value: bioRoomPreset.bioWall.cardNumberSize, min: 0.025, max: 0.09, step: 0.005, label: "Numero" },
      cardTitleSize: { value: bioRoomPreset.bioWall.cardTitleSize, min: 0.04, max: 0.16, step: 0.005, label: "Titulo" },
      cardBodySize: { value: bioRoomPreset.bioWall.cardBodySize, min: 0.02, max: 0.07, step: 0.005, label: "Texto" },
      cardBodyWidth: { value: bioRoomPreset.bioWall.cardBodyWidth, min: 0.35, max: 1.2, step: 0.02, label: "Texto ancho" },
    }, collapsedLevaFolder),
    "Lineas decorativas": folder({
      decorLineOpacity: { value: bioRoomPreset.bioWall.decorLineOpacity, min: 0, max: 0.8, step: 0.01, label: "Opacidad" },
    }, collapsedLevaFolder),
    "Aportes": folder({
      contributionLabelX: { value: bioRoomPreset.bioWall.contributionLabelX, min: -5, max: 1, step: 0.02, label: "Titulo aportes X" },
      contributionLabelY: { value: bioRoomPreset.bioWall.contributionLabelY, min: -1.2, max: 0.4, step: 0.02, label: "Titulo aportes Y" },
      contributionRowsX: { value: bioRoomPreset.bioWall.contributionRowsX, min: -5, max: 1, step: 0.02, label: "Filas aportes X" },
      contributionStartY: { value: bioRoomPreset.bioWall.contributionStartY, min: -1.4, max: 0.2, step: 0.02, label: "Inicio filas Y" },
      contributionGap: { value: bioRoomPreset.bioWall.contributionGap, min: 0.1, max: 0.3, step: 0.01, label: "Separacion" },
      contributionSize: { value: bioRoomPreset.bioWall.contributionSize, min: 0.04, max: 0.09, step: 0.005, label: "Tamano" },
    }, collapsedLevaFolder),
    "Imagen sentado": folder({
      sittingImageX: { value: bioRoomPreset.bioWall.sittingImageX, min: -5, max: 1.2, step: 0.02, label: "Imagen X" },
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

  return <BioWallContent3D controls={controls} copy={copy} wall={wall} />;
}

function BioWallWithoutLeva3D({ copy, wall }: { copy: SiteCopy["bio"]; wall: WallSurface }) {
  const controls = useBioRoomPresetStore((state) => state.preset.bioWall);

  return <BioWallContent3D controls={controls} copy={copy} wall={wall} />;
}

function BioWall3D({ copy, wall }: { copy: SiteCopy["bio"]; wall: WallSurface }) {
  const isBioLevaDisabled = useBioRoomStore((state) => state.isBioLevaDisabled);

  return isBioLevaDisabled ? (
    <BioWallWithoutLeva3D copy={copy} wall={wall} />
  ) : (
    <BioWallWithLeva3D copy={copy} wall={wall} />
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
  const wallSeparation = 0.26;
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
      <WallPanel height={wall.height - 0.48} width={wall.width - 0.72} z={0.14} />
      {/* Dark inner panel — tighter to the visible camera area */}
      <WallPanel color="#030611" height={controls.panelHeight} opacity={controls.panelOpacity} width={controls.panelWidth} z={wallSeparation + 0.04} />
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
        z={wallSeparation + 0.34}
      />

      <group position={[controls.contentX, controls.contentY, wallSeparation]} scale={controls.contentScale}>

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
