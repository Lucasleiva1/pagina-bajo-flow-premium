"use client";

import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { Environment, Float, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Mesh } from "three";
import { ParticlesField } from "@/components/three/ParticlesField";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Project } from "@/data/site";

type WorkGallery3DProps = {
  active: number;
  projects: Project[];
  setActive: (index: number) => void;
};

type ProjectCardProps = {
  active: number;
  index: number;
  project: Project;
  projectCount: number;
  setActive: (index: number) => void;
  texture: THREE.Texture;
};

function shortestOffset(index: number, active: number, length: number) {
  let offset = index - active;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

function ProjectCard({ active, index, project, projectCount, setActive, texture }: ProjectCardProps) {
  const mesh = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const offset = shortestOffset(index, active, projectCount);
  const isActive = offset === 0;

  const [video] = useState(() => {
    if (!project.video) return null;
    const vid = document.createElement("video");
    vid.src = project.video;
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    return vid;
  });

  const videoTexture = useMemo(() => {
    if (!video) return null;
    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, [video]);

  useEffect(() => {
    if (!video) return;
    if (isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive, video]);

  useFrame((state) => {
    if (!mesh.current) return;

    // Matemática corregida para Cover Flow triangular ("\ /")
    const targetX = offset * 2.3;
    const targetY = isActive ? 0 : -0.15;
    const targetZ = isActive ? 0.3 : -1.2 - Math.abs(offset) * 0.4;
    const targetScale = isActive ? 1.25 : 0.85;
    const hoverLift = hovered && isActive ? 0.12 : 0;
    
    // Rotación invertida para apuntar hacia el centro
    const targetRotY = isActive ? 0 : Math.sign(offset) * -0.55;

    mesh.current.position.lerp(new THREE.Vector3(targetX, targetY + hoverLift, targetZ), 0.1);
    mesh.current.rotation.y += (targetRotY + state.pointer.x * (isActive ? 0.05 : 0.02) - mesh.current.rotation.y) * 0.1;
    mesh.current.rotation.x += ((hovered && isActive ? -0.05 : 0) - mesh.current.rotation.x) * 0.1;
    mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    setActive(index);
  }

  const initialX = offset * 2.3;
  const initialZ = isActive ? 0.3 : -1.2 - Math.abs(offset) * 0.4;

  return (
    <Float floatIntensity={isActive ? 0.2 : 0.05} rotationIntensity={0.05} speed={1.5}>
      <mesh
        onClick={handleClick}
        onPointerOut={() => setHovered(false)}
        onPointerOver={() => setHovered(true)}
        position={[initialX, 0, initialZ]}
        ref={mesh}
        scale={isActive ? 1.25 : 0.85}
      >
        <planeGeometry args={[3.6, 2.25]} />
        <meshBasicMaterial map={videoTexture ? videoTexture : texture} toneMapped={false} />
      </mesh>
      <mesh position={[initialX, -1.45, isActive ? 0 : -1.4]} rotation={[-1.35, 0, 0]}>
        <planeGeometry args={[3.3, 1.15]} />
        <meshBasicMaterial color="#ff4d8d" opacity={isActive ? 0.15 : 0.04} transparent />
      </mesh>
    </Float>
  );
}

function GalleryWorld({ active, projects, setActive }: WorkGallery3DProps) {
  const textures = useTexture(projects.map((project) => project.image)) as THREE.Texture[];

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
    });
  }, [textures]);

  return (
    <>
      <color attach="background" args={["#05070b"]} />
      <fog attach="fog" args={["#05070b", 3.5, 10]} />
      <ambientLight intensity={0.5} />
      <spotLight angle={0.5} color="#5ea1ff" intensity={30} penumbra={0.8} position={[0, 4, 4]} />
      <pointLight color="#ff4d8d" intensity={25} position={[-3.5, -0.8, 2.3]} />
      <ParticlesField count={150} spread={8} />
      {projects.map((project, index) => (
        <ProjectCard
          active={active}
          index={index}
          key={project.title}
          project={project}
          projectCount={projects.length}
          setActive={setActive}
          texture={textures[index]}
        />
      ))}
      <mesh position={[0, -1.7, -1.6]} rotation={[-1.5, 0, 0]}>
        <planeGeometry args={[9, 3.2]} />
        <meshBasicMaterial color="#0b0f18" opacity={0.72} transparent />
      </mesh>
      <Environment preset="night" />
    </>
  );
}

export function WorkGallery3D({ active, projects, setActive }: WorkGallery3DProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="work-canvas" aria-label="Galeria 3D de trabajos">
      <Canvas
        camera={{ fov: 42, position: [0, 0.1, 6.6] }}
        dpr={reducedMotion ? [1, 1] : [1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <GalleryWorld active={active} projects={projects} setActive={setActive} />
        </Suspense>
      </Canvas>
    </div>
  );
}
