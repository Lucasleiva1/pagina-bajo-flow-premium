"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points } from "three";

type ParticlesFieldProps = {
  count?: number;
  spread?: number;
};

export function ParticlesField({ count = 260, spread = 9 }: ParticlesFieldProps) {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * spread;
      values[index * 3 + 1] = (Math.random() - 0.5) * spread * 0.7;
      values[index * 3 + 2] = (Math.random() - 0.5) * spread - 2;
    }
    return values;
  }, [count, spread]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.035;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#5ea1ff" opacity={0.72} size={0.022} transparent />
    </points>
  );
}
