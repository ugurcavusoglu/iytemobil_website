'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

const PARTICLE_STEP = 4;
const MOUSE_RADIUS = 1.1;

function sampleWordmark(text: string, width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.font = `900 ${Math.floor(height * 0.82)}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2 + height * 0.04);
  const data = ctx.getImageData(0, 0, width, height).data;
  const points: number[] = [];
  for (let y = 0; y < height; y += PARTICLE_STEP) {
    for (let x = 0; x < width; x += PARTICLE_STEP) {
      if (data[(y * width + x) * 4 + 3] > 128) points.push((x / width - 0.5) * 8, -(y / height - 0.5) * 8 * (height / width), 0);
    }
  }
  return new Float32Array(points);
}

export default function ParticleWordmarkScene({ progress }: { progress: MotionValue<number> }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 7;

    const target = sampleWordmark('İYTE', 640, 260);
    const count = target.length / 3;
    const scattered = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      scattered[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      scattered[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      scattered[i * 3 + 2] = r * Math.cos(phi) - 2;
    }

    const positions = scattered.slice();
    const colors = new Float32Array(count * 3);
    const red = new THREE.Color('#E63946');
    const white = new THREE.Color('#fafafa');
    for (let i = 0; i < count; i++) {
      const c = Math.random() < 0.28 ? red : white;
      colors.set([c.r, c.g, c.b], i * 3);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const mouse = new THREE.Vector2(99, 99);
    const mouseWorld = new THREE.Vector3();
    const onMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    };
    const onLeave = () => mouse.set(99, 99);
    mount.addEventListener('pointermove', onMove);
    mount.addEventListener('pointerleave', onLeave);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.position.z = camera.aspect < 1 ? 11 : 7;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    onResize();
    window.addEventListener('resize', onResize);

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(mount);

    let frame = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      const time = clock.getElapsedTime();
      const p = progress.get();
      const form = Math.min(1, Math.max(0, (p - 0.1) / 0.35)) * (1 - Math.min(1, Math.max(0, (p - 0.75) / 0.2)));
      const ease = form * form * (3 - 2 * form);

      mouseWorld.set(mouse.x, mouse.y, 0.5).unproject(camera).sub(camera.position).normalize();
      mouseWorld.multiplyScalar(-camera.position.z / mouseWorld.z).add(camera.position);

      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const ix = i * 3;
        const wobble = Math.sin(time * 0.8 + i * 0.37) * 0.04 * (1 - ease * 0.7);
        let tx = scattered[ix] + (target[ix] - scattered[ix]) * ease + wobble;
        let ty = scattered[ix + 1] + (target[ix + 1] - scattered[ix + 1]) * ease + Math.cos(time * 0.7 + i) * 0.04 * (1 - ease * 0.7);
        const tz = scattered[ix + 2] + (target[ix + 2] - scattered[ix + 2]) * ease;
        const dx = tx - mouseWorld.x;
        const dy = ty - mouseWorld.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_RADIUS) {
          const push = (1 - dist / MOUSE_RADIUS) * 0.9;
          tx += (dx / (dist || 1)) * push;
          ty += (dy / (dist || 1)) * push;
        }
        pos[ix] += (tx - pos[ix]) * 0.08;
        pos[ix + 1] += (ty - pos[ix + 1]) * 0.08;
        pos[ix + 2] += (tz - pos[ix + 2]) * 0.08;
      }
      geometry.attributes.position.needsUpdate = true;
      points.rotation.y = Math.sin(time * 0.2) * 0.15 * (1 - ease) + (1 - ease) * time * 0.05;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      mount.removeEventListener('pointermove', onMove);
      mount.removeEventListener('pointerleave', onLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [progress]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
