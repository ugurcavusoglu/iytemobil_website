'use client';

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { FloatingPhone } from './FloatingPhone';
import { ParticleField } from './ParticleField';
import { Suspense } from 'react';

export function PhoneScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-3, -3, 2]} intensity={0.3} color="#dc2626" />

          <FloatingPhone />
          <ParticleField count={150} />

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
