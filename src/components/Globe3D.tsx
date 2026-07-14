"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const EARTH_MODEL_URL = "/models/earth.glb";
const PLANE_MODEL_URL = "/models/plane.glb";

// Manually-uploaded models (see IMAGES.md-style upload instructions): drop a
// .glb at public/models/earth.glb (or plane.glb) via GitHub and it is picked
// up automatically, no code change needed. We HEAD-check first rather than
// letting useGLTF throw, since a 404 inside R3F's Suspense tree has no error
// boundary here and would crash the whole canvas.
function useModelAvailable(url: string): boolean {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch(url, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setAvailable(res.ok);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);
  return available;
}

// Normalize an arbitrary model so its longest axis spans `targetSize` world
// units and it is centered on its own origin, regardless of how the uploaded
// file was authored. (Using max box dimension / 2 as the radius — a bounding
// *sphere* of a globe's box overshoots the true radius by ~73%.)
function useNormalizedModel(scene: THREE.Object3D, targetSize: number) {
  return useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const longest = Math.max(size.x, size.y, size.z);
    const scale = longest > 0 ? targetSize / longest : 1;
    return { scale, offset: center.multiplyScalar(-1) };
  }, [scene, targetSize]);
}

// Some exported models ship fully-metallic materials, which render near-black
// without an environment map. Clamp them toward a matte look our simple light
// rig can illuminate.
function useMatteMaterials(scene: THREE.Object3D) {
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        const std = m as THREE.MeshStandardMaterial;
        if (std.isMeshStandardMaterial && std.metalness > 0.4) {
          std.metalness = 0.15;
          std.roughness = Math.max(std.roughness, 0.7);
        }
      }
    });
  }, [scene]);
}

function EarthModel() {
  const { scene } = useGLTF(EARTH_MODEL_URL);
  // Diameter 2 = unit radius, so the destination markers (radius ~1.03) sit
  // just above the surface.
  const { scale, offset } = useNormalizedModel(scene, 2);
  useMatteMaterials(scene);
  return (
    <group scale={scale}>
      <primitive object={scene} position={offset} />
    </group>
  );
}

function PlaneModel() {
  const { scene } = useGLTF(PLANE_MODEL_URL);
  const { scale, offset } = useNormalizedModel(scene, 0.42);
  useMatteMaterials(scene);
  return (
    <group scale={scale}>
      <primitive object={scene} position={offset} />
    </group>
  );
}

// Keeps a directional light glued to the camera so whichever side of the
// globe faces the viewer is always lit, even while OrbitControls auto-rotates.
function CameraLight() {
  const ref = useRef<THREE.DirectionalLight>(null);
  useFrame(({ camera }) => {
    ref.current?.position.copy(camera.position);
  });
  return <directionalLight ref={ref} intensity={1.3} />;
}

// A little plane circling the globe on a tilted orbit.
function OrbitingPlane() {
  const orbitRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (orbitRef.current) orbitRef.current.rotation.y = clock.elapsedTime * 0.45;
  });
  return (
    <group rotation={[0.45, 0, -0.3]}>
      <group ref={orbitRef}>
        <group position={[1.22, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <PlaneModel />
        </group>
      </group>
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
  const earthAvailable = useModelAvailable(EARTH_MODEL_URL);
  const planeAvailable = useModelAvailable(PLANE_MODEL_URL);

  return (
    <group rotation={[0.1, 0, 0]}>
      {planeAvailable && (
        <Suspense fallback={null}>
          <OrbitingPlane />
        </Suspense>
      )}
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
      <ambientLight intensity={1.4} />
      <CameraLight />
      <directionalLight position={[-3, -1, -2]} intensity={0.4} />
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
