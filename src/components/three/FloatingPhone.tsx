'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export function FloatingPhone() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.15 + 0.3;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.05;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.15;
  });

  return (
    <group ref={groupRef} scale={1.8}>
      {/* Phone body */}
      <RoundedBox args={[1.4, 2.8, 0.12]} radius={0.15} smoothness={4}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* Screen */}
      <RoundedBox args={[1.25, 2.55, 0.01]} radius={0.12} smoothness={4} position={[0, 0, 0.07]}>
        <meshStandardMaterial color="#0a0a0a" />
      </RoundedBox>

      {/* Screen gradient overlay */}
      <RoundedBox args={[1.2, 2.5, 0.005]} radius={0.1} smoothness={4} position={[0, 0, 0.076]}>
        <meshStandardMaterial
          color="#dc2626"
          transparent
          opacity={0.08}
        />
      </RoundedBox>

      {/* App icon placeholder */}
      <RoundedBox args={[0.35, 0.35, 0.005]} radius={0.08} smoothness={4} position={[0, 0.4, 0.08]}>
        <meshStandardMaterial color="#dc2626" transparent opacity={0.3} />
      </RoundedBox>

      {/* Text lines (content placeholders) */}
      {[-0.1, -0.35, -0.6, -0.85].map((y, i) => (
        <RoundedBox key={i} args={[0.9 - i * 0.1, 0.06, 0.005]} radius={0.02} smoothness={2} position={[0, y, 0.08]}>
          <meshStandardMaterial color="#2a2a2a" />
        </RoundedBox>
      ))}

      {/* Notch */}
      <RoundedBox args={[0.4, 0.08, 0.01]} radius={0.04} smoothness={4} position={[0, 1.2, 0.075]}>
        <meshStandardMaterial color="#0a0a0a" />
      </RoundedBox>

      {/* Camera dot */}
      <mesh position={[0.08, 1.2, 0.08]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Red glow */}
      <pointLight position={[0, 0, 1]} color="#dc2626" intensity={0.5} distance={3} />
    </group>
  );
}
