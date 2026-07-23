"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { CubesProps } from "@/components/reactbits/Cubes";

const Cubes = dynamic(() => import("@/components/reactbits/Cubes"), { ssr: false });

// Cubes (GSAP-driven) is desktop-only decoration everywhere it's used today
// (the wrapping markup is already `hidden lg:block`) — but a CSS visibility
// class doesn't stop the component from mounting and running its GSAP
// tweens, IntersectionObserver, and pointer listeners underneath. Gating the
// mount itself on viewport width keeps GSAP out of the bundle entirely for
// visitors who will never see it (mobile/tablet), instead of just hiding it.
export default function LazyCubes(props: CubesProps) {
  const [eligible, setEligible] = useState(false);
  useEffect(() => {
    setEligible(window.matchMedia("(min-width: 1024px)").matches);
  }, []);
  if (!eligible) return null;
  return <Cubes {...props} />;
}
