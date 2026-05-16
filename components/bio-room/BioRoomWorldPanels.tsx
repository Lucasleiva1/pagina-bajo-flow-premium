"use client";

import { type ReactNode, useMemo } from "react";
import { type ThreeEvent, useLoader } from "@react-three/fiber";
import {
  CanvasTexture,
  DoubleSide,
  LinearFilter,
  SRGBColorSpace,
  TextureLoader,
} from "three";
import type { BioRoomLayout, WallSurface } from "@/components/bio-room/BioRoomLayout";
import type { SiteCopy } from "@/data/site";
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
  x: number;
  y: number;
  z?: number;
};

const wallAccent = "#f7e5c8";
const wallAmber = "#ffb454";
const wallInk = "#f6f2ea";
const wallMuted = "#b9c0cc";

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
  color = "#05080e",
  height,
  opacity = 0.84,
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
        metalness={0.18}
        opacity={opacity}
        polygonOffset
        polygonOffsetFactor={-1}
        roughness={0.72}
        side={DoubleSide}
        transparent
      />
    </mesh>
  );
}

function WallGlowLine({
  height,
  width,
  x,
  y,
  z = 0.075,
}: {
  height: number;
  width: number;
  x: number;
  y: number;
  z?: number;
}) {
  return (
    <mesh position={[x, y, z]}>
      <boxGeometry args={[width, height, 0.012]} />
      <meshBasicMaterial color={wallAccent} toneMapped={false} />
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
  const thickness = 0.018;

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
  fontSize,
  maxWidth,
  text,
  textAlign,
}: {
  color: string;
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

    const measureCanvas = document.createElement("canvas");
    const measureContext = measureCanvas.getContext("2d");

    if (!measureContext) {
      const emptyTexture = new CanvasTexture(measureCanvas);
      return { height: fontSize, texture: emptyTexture, width };
    }

    measureContext.font = `700 ${fontPx}px Arial, sans-serif`;
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
      context.font = `700 ${fontPx}px Arial, sans-serif`;
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
  }, [color, fontSize, maxWidth, text, textAlign]);
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

function WallButton({
  handle,
  href,
  label,
  x,
  y,
}: {
  handle: string;
  href: string;
  label: string;
  x: number;
  y: number;
}) {
  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    openLink(href);
  }

  return (
    <group position={[x, y, 0.09]}>
      <mesh onClick={handleClick}>
        <planeGeometry args={[1.12, 0.34]} />
        <meshStandardMaterial
          color="#090d16"
          emissive="#24170a"
          emissiveIntensity={0.18}
          metalness={0.22}
          roughness={0.65}
        />
      </mesh>
      <WallFrame height={0.34} width={1.12} />
      <WallText fontSize={0.075} maxWidth={0.95} x={-0.46} y={0.055} z={0.13}>
        {label}
      </WallText>
      <WallText color={wallMuted} fontSize={0.052} maxWidth={0.95} x={-0.46} y={-0.075} z={0.13}>
        {handle}
      </WallText>
    </group>
  );
}

function ToolChip({ label, x, y }: { label: string; x: number; y: number }) {
  return (
    <group position={[x, y, 0.1]}>
      <WallPanel color="#0b111d" height={0.2} opacity={0.92} width={0.78} z={0} />
      <WallText color={wallMuted} fontSize={0.045} maxWidth={0.66} textAlign="center" x={0} y={0} z={0.04}>
        {label}
      </WallText>
    </group>
  );
}

function FrontWall3D({ copy, wall }: { copy: SiteCopy["bio"]; wall: WallSurface }) {
  const tools = copy.tools.slice(0, 10);

  return (
    <WallSurfaceGroup wall={wall}>
      <WallPanel height={wall.height - 0.48} width={wall.width - 0.72} />
      <WallFrame height={wall.height - 0.56} width={wall.width - 0.84} />

      <WallText color={wallAmber} fontSize={0.14} maxWidth={1.6} textAlign="center" x={0} y={1.08}>
        {copy.kicker}
      </WallText>
      <WallText fontSize={0.38} maxWidth={3.4} textAlign="center" x={0} y={0.78}>
        BAJO FLOW
      </WallText>
      <WallText color={wallMuted} fontSize={0.085} maxWidth={4.7} textAlign="center" x={0} y={0.49}>
        {copy.identitySubtitle}
      </WallText>

      <WallPanel height={1.18} opacity={0.72} width={1.88} x={-2.35} y={-0.15} />
      <WallFrame height={1.18} width={1.88} x={-2.35} y={-0.15} />
      <WallText fontSize={0.092} maxWidth={1.55} x={-3.12} y={0.2}>
        {copy.paragraphs[0]}
      </WallText>
      <WallText color={wallMuted} fontSize={0.061} maxWidth={1.55} x={-3.12} y={-0.29}>
        {copy.paragraphs[1]}
      </WallText>

      {copy.contactLinks.map((link, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        return (
          <WallButton
            handle={link.handle}
            href={link.href}
            key={link.label}
            label={link.label}
            x={1.62 + col * 1.22}
            y={0.24 - row * 0.43}
          />
        );
      })}

      <WallText color={wallAmber} fontSize={0.075} maxWidth={1.5} x={1.02} y={-1.05}>
        Skills & Expertise
      </WallText>
      {tools.map((tool, index) => {
        const col = index % 5;
        const row = Math.floor(index / 5);
        return (
          <ToolChip
            key={tool}
            label={tool}
            x={1.15 + col * 0.83}
            y={-1.28 - row * 0.26}
          />
        );
      })}
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
      <WallPanel color="#080d16" height={0.78} opacity={0.86} width={2.75} z={0} />
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
          color="#080d16"
          emissive="#160d18"
          emissiveIntensity={0.18}
          metalness={0.18}
          roughness={0.68}
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
            image={item.image}
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
