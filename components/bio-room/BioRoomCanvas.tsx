"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
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
import { BioRoomHtmlPanels } from "@/components/bio-room/BioRoomHtmlPanels";
import type { SiteCopy } from "@/data/site";
import { useBioRoomStore } from "@/lib/useBioRoomStore";

type BioRoomCanvasProps = {
  copy: SiteCopy["bio"];
};

const cameraStates = {
  home: {
    position: new Vector3(0, 1.62, 5.8),
    target: new Vector3(-0.34, 1.48, -1.8),
  },
  bio: {
    position: new Vector3(-4.3, 1.62, 3.1),
    target: new Vector3(-3.45, 1.58, -1.55),
  },
  gallery: {
    position: new Vector3(4.3, 1.62, 3.1),
    target: new Vector3(3.45, 1.58, -1.55),
  },
  contact: {
    position: new Vector3(-0.86, 1.52, 5.1),
    target: new Vector3(-1.34, 1.32, -3.08),
  },
};

function CameraRig() {
  const activeRoomView = useBioRoomStore((state) => state.activeRoomView);
  const { camera } = useThree();
  const target = useRef(cameraStates.home.target.clone());

  useFrame((_, delta) => {
    const state = cameraStates[activeRoomView];
    const speed = 1 - Math.pow(0.035, delta);
    camera.position.lerp(state.position, speed);
    target.current.lerp(state.target, speed);
    camera.lookAt(target.current);
  });

  return null;
}

function GlowLine({ position, rotation, scale }: { position: [number, number, number]; rotation?: [number, number, number]; scale: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#f7e5c8" toneMapped={false} transparent opacity={0.72} />
    </mesh>
  );
}

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

function LucasBillboard() {
  const texture = useLoader(TextureLoader, "/assets/bio-room/lucas-fullbody-cutout.png");

  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;

  return (
    <group position={[0, 1.12, -1.18]}>
      <mesh position={[0, 0.12, 0]}>
        <planeGeometry args={[1.74, 2.55]} />
        <meshBasicMaterial alphaTest={0.05} map={texture} side={DoubleSide} transparent />
      </mesh>
      <mesh position={[0, -1.13, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.92, 80]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.42} />
      </mesh>
      <mesh position={[0, -1.12, 0.025]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.58, 0.9, 96]} />
        <meshBasicMaterial color="#ffb454" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function RoomShell() {
  const softbox = SoftboxTexture();

  return (
    <group>
      <color attach="background" args={["#05070d"]} />
      <fog attach="fog" args={["#05070d", 4.5, 9.8]} />
      <ambientLight intensity={0.28} />
      <pointLight color="#ffb454" intensity={10} position={[0, 2.8, 1.4]} distance={7} />
      <pointLight color="#5ea1ff" intensity={4} position={[2.8, 1.4, 0.4]} distance={5} />
      <spotLight angle={0.46} color="#ffffff" intensity={18} penumbra={0.86} position={[0, 3.1, 1.4]} />

      <mesh position={[0, 0, -0.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 6.5]} />
        <meshStandardMaterial color="#070911" metalness={0.24} roughness={0.62} />
      </mesh>
      <mesh position={[0, 3.05, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 6.5]} />
        <meshStandardMaterial color="#05060b" metalness={0.1} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.5, -3.55]}>
        <planeGeometry args={[8, 3.1]} />
        <meshStandardMaterial color="#080c14" metalness={0.18} roughness={0.74} />
      </mesh>
      <mesh position={[-3.7, 1.5, -0.55]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[6.5, 3.1]} />
        <meshStandardMaterial color="#070a12" metalness={0.18} roughness={0.76} />
      </mesh>
      <mesh position={[3.7, 1.5, -0.55]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[6.5, 3.1]} />
        <meshStandardMaterial color="#070a12" metalness={0.18} roughness={0.76} />
      </mesh>

      <mesh position={[0, 3.01, -1.05]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.3, 0.36]} />
        <meshBasicMaterial blending={AdditiveBlending} color="#fff4e4" map={softbox} transparent opacity={0.9} toneMapped={false} />
      </mesh>

      <GlowLine position={[0, 0.015, -3.18]} scale={[6.4, 0.018, 0.018]} />
      <GlowLine position={[-3.22, 0.015, -0.45]} rotation={[0, Math.PI / 2, 0]} scale={[5.35, 0.018, 0.018]} />
      <GlowLine position={[3.22, 0.015, -0.45]} rotation={[0, Math.PI / 2, 0]} scale={[5.35, 0.018, 0.018]} />
      <GlowLine position={[0, 2.92, -3.48]} scale={[5.4, 0.018, 0.018]} />
      <GlowLine position={[-3.62, 2.88, -0.4]} rotation={[0, Math.PI / 2, 0]} scale={[4.9, 0.018, 0.018]} />
      <GlowLine position={[3.62, 2.88, -0.4]} rotation={[0, Math.PI / 2, 0]} scale={[4.9, 0.018, 0.018]} />
    </group>
  );
}

function SceneContent({ copy }: BioRoomCanvasProps) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.012;
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={42} position={[0, 1.62, 5.8]} />
      <CameraRig />
      <RoomShell />
      <group ref={groupRef}>
        <LucasBillboard />
      </group>
      <BioRoomHtmlPanels copy={copy} />
    </>
  );
}

export function BioRoomCanvas({ copy }: BioRoomCanvasProps) {
  return (
    <div className="bio-room-canvas">
      <Canvas dpr={[1, 1.5]} gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}>
        <SceneContent copy={copy} />
      </Canvas>
    </div>
  );
}
