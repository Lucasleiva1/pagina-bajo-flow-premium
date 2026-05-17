"use client";

import { Suspense, useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";

// ----------------------------------------------------
// CONTROLES MANUALES PARA EL USUARIO
// ----------------------------------------------------
// Cambiá este valor para darle más o menos relieve 3D al video.
// OJO: Si es muy alto (ej. 1.0) va a parecer "gelatina" que tiembla,
// porque los píxeles del video cambian de brillo en cada frame, moviendo la pared.
// Valores recomendados: 0.05 a 0.2
const DISPLACEMENT_INTENSITY = 0.15;

// Cambiá a true si querés ver la malla de polígonos (solo para probar el rendimiento).
const WIREFRAME = false;
// ----------------------------------------------------

function getHeroVideoSource() {
  const width = window.visualViewport?.width ?? document.documentElement.clientWidth ?? window.innerWidth;
  const variant = width <= 600 ? 480 : width <= 900 ? 768 : width <= 1400 ? 1280 : 1920;
  const probe = document.createElement("video");
  const supportsWebm = probe.canPlayType('video/webm; codecs="vp9, opus"') !== "";
  return `/videos/reel-${variant}.${supportsWebm ? "webm" : "mp4"}`;
}

function CinemaScreen() {
  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src = getHeroVideoSource();
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.preload = "metadata";
    return vid;
  });

  const videoTexture = useMemo(() => {
    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [video]);

  useEffect(() => {
    function playFromVisibleFrame() {
      if (video.currentTime < 0.35) video.currentTime = 0.8;
      video.play().catch(() => {});
    }

    if (video.readyState >= 1) playFromVisibleFrame();
    else video.addEventListener("loadedmetadata", playFromVisibleFrame, { once: true });

    return () => video.removeEventListener("loadedmetadata", playFromVisibleFrame);
  }, [video]);

  return (
    <mesh position={[0, 0, 0]} scale={[-1, 1, 1]}>
      {/* 
        Aumentamos los polígonos para que el mapa de desplazamiento tenga vértices que mover:
        radialSegments = 128, heightSegments = 64
        Es lo suficientemente liviano (low-poly) pero da un efecto buenísimo.
      */}
      <cylinderGeometry args={[12, 12, 13.5, 128, 64, true, Math.PI - 1.0, 2.0]} />

      <meshStandardMaterial
        map={videoTexture}
        displacementMap={videoTexture}
        displacementScale={DISPLACEMENT_INTENSITY}
        emissiveMap={videoTexture}
        emissive={"#ffffff"}
        emissiveIntensity={0.72}
        side={THREE.DoubleSide}
        toneMapped={false}
        wireframe={WIREFRAME}
        roughness={0.9}
      />
    </mesh>
  );
}

function HeroRig() {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    // Paneo inmersivo suave con el mouse
    group.current.rotation.y += (state.pointer.x * 0.15 - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (-state.pointer.y * 0.05 - group.current.rotation.x) * 0.05;
  });

  return (
    <group ref={group}>
      <CinemaScreen />
    </group>
  );
}

export function HeroWorld() {
  return (
    <div className="hero-world" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault fov={45} position={[0, 0, 0]} />
        <Suspense fallback={null}>
          {/* Luces para que el relieve 3D genere sombras sutiles y se note la profundidad */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <HeroRig />
        </Suspense>
      </Canvas>
    </div>
  );
}
