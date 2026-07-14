"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const EARTH_MODEL_URL = "/models/earth.glb";

// Manually-uploaded Earth model (see IMAGES.md-style upload instructions):
// drop a .glb at public/models/earth.glb via GitHub and it replaces the
// procedural sphere below automatically, no code change needed. We HEAD-check
// first rather than letting useGLTF throw, since a 404 inside R3F's Suspense
// tree has no error boundary here and would crash the whole canvas.
function useEarthModelAvailable(): boolean {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch(EARTH_MODEL_URL, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setAvailable(res.ok);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return available;
}

function EarthModel() {
  const { scene } = useGLTF(EARTH_MODEL_URL);
  // Normalize any model to a unit sphere so the destination markers (placed at
  // radius ~1.03) always sit just above the surface, regardless of how the
  // uploaded file was authored.
  const { scale, offset } = useMemo(() => {
    const sphere = new THREE.Box3().setFromObject(scene).getBoundingSphere(new THREE.Sphere());
    const s = sphere.radius > 0 ? 1 / sphere.radius : 1;
    return { scale: s, offset: sphere.center.multiplyScalar(-1) };
  }, [scene]);
  return (
    <group scale={scale}>
      <primitive object={scene} position={offset} />
    </group>
  );
}

type Marker = { slug: string; name: string; code: string; color: string; lat: number; lng: number };

const markers: Marker[] = [
  { slug: "cyprus", name: "Cyprus", code: "CY", color: "#0284C7", lat: 35.13, lng: 33.43 },
  { slug: "albania", name: "Albania", code: "AL", color: "#DC2626", lat: 41.15, lng: 20.17 },
  { slug: "malaysia", name: "Malaysia", code: "MY", color: "#4F46E5", lat: 4.21, lng: 101.98 },
  { slug: "cambodia", name: "Cambodia", code: "KH", color: "#7C3AED", lat: 12.57, lng: 104.99 },
  { slug: "thailand", name: "Thailand", code: "TH", color: "#F59E0B", lat: 13.75, lng: 100.5 },
  { slug: "russia", name: "Russia", code: "RU", color: "#2563EB", lat: 55.75, lng: 37.62 },
];

function latLngToVec3(lat: number, lng: number, r: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
}

function DestinationMarker({ marker }: { marker: Marker }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const dotRef = useRef<THREE.Mesh>(null);
  const position = useMemo(() => latLngToVec3(marker.lat, marker.lng, 1.03), [marker]);

  useFrame(({ clock }) => {
    if (!dotRef.current) return;
    const pulse = hovered ? 1.5 : 1 + Math.sin(clock.elapsedTime * 2.2 + marker.lat) * 0.15;
    dotRef.current.scale.setScalar(pulse);
  });

  return (
    <group position={position}>
      <mesh
        ref={dotRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/destinations/${marker.slug}/`);
        }}
      >
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshBasicMaterial color={marker.color} toneMapped={false} />
      </mesh>
      <Html distanceFactor={4} occlude={false} zIndexRange={[20, 0]}>
        <div
          className={`pointer-events-none -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full border border-white/40 bg-white/95 px-2.5 py-1 text-[10px] font-bold text-ink shadow-lg transition-all duration-200 ${
            hovered ? "-mt-2 opacity-100" : "-mt-0.5 opacity-0"
          }`}
        >
          {marker.code} · {marker.name}
        </div>
      </Html>
    </group>
  );
}

function GlobeMesh() {
  const earthAvailable = useEarthModelAvailable();

  return (
    <group rotation={[0.1, 0, 0]}>
      {earthAvailable ? (
        <Suspense fallback={null}>
          <EarthModel />
        </Suspense>
      ) : (
        <>
          {/* solid core */}
          <mesh>
            <sphereGeometry args={[1, 48, 48]} />
            <meshStandardMaterial color="#3b1d78" roughness={0.85} metalness={0.05} />
          </mesh>
          {/* wireframe graticule shell */}
          <mesh>
            <sphereGeometry args={[1.004, 24, 16]} />
            <meshBasicMaterial color="#c4b0fb" wireframe transparent opacity={0.35} />
          </mesh>
          {/* soft outer glow shell */}
          <mesh>
            <sphereGeometry args={[1.08, 32, 32]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.08} side={THREE.BackSide} />
          </mesh>
        </>
      )}

      {markers.map((m) => (
        <DestinationMarker key={m.slug} marker={m} />
      ))}
    </group>
  );
}

export default function Globe3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="grid h-full w-full place-items-center" aria-hidden="true">
        <div className="h-[70%] w-[70%] animate-pulse rounded-full bg-brand-200/50" />
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 2.7], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={1.6} />
      <directionalLight position={[3, 2, 4]} intensity={1.4} />
      <directionalLight position={[-3, -1, -2]} intensity={0.5} />
      <GlobeMesh />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.9}
        minPolarAngle={Math.PI / 2 - 0.5}
        maxPolarAngle={Math.PI / 2 + 0.5}
      />
    </Canvas>
  );
}
