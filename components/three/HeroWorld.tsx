"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, PerspectiveCamera } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { ParticlesField } from "@/components/three/ParticlesField";

function HeroRig() {
  const group = useRef<Group>(null);
  const monolith = useRef<Mesh>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y += (state.pointer.x * 0.18 - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (-state.pointer.y * 0.08 - group.current.rotation.x) * 0.04;

    if (monolith.current) {
      monolith.current.rotation.y = state.clock.elapsedTime * 0.17;
      monolith.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
    }
  });

  return (
    <group ref={group}>
      <ParticlesField count={320} spread={11} />
      <Float floatIntensity={1.4} rotationIntensity={0.35} speed={1.3}>
        <mesh ref={monolith} position={[1.9, 0.15, -1.9]} rotation={[0.35, 0.4, -0.18]}>
          <boxGeometry args={[0.72, 2.2, 0.42]} />
          <meshPhysicalMaterial
            color="#0b0f18"
            emissive="#1e2a5a"
            emissiveIntensity={0.55}
            metalness={0.65}
            roughness={0.18}
            transmission={0.12}
          />
        </mesh>
      </Float>

      <mesh position={[0.45, -1.15, -2.4]} rotation={[-1.12, 0, 0]}>
        <planeGeometry args={[7.5, 3.2]} />
        <meshBasicMaterial color="#11162a" opacity={0.24} transparent />
      </mesh>
      <mesh position={[-1.7, 0.2, -3.1]} rotation={[0.15, -0.35, 0.06]}>
        <planeGeometry args={[2.1, 3.7]} />
        <meshBasicMaterial color="#7b4cff" opacity={0.09} transparent />
      </mesh>
      <pointLight color="#ff4d8d" intensity={12} position={[-2.1, -0.2, 1.2]} />
      <pointLight color="#5ea1ff" intensity={18} position={[2.8, 1.4, 1.6]} />
    </group>
  );
}

export function HeroWorld() {
  return (
    <div className="hero-world" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault fov={38} position={[0, 0.2, 6.2]} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <HeroRig />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
