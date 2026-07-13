"use client";

import { useEffect, useState } from "react";

export type Countdown = { days: number; hours: number; mins: number; secs: number; expired: boolean };

function compute(target: number): Countdown {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, expired: true };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    mins: Math.floor(diff / 60_000) % 60,
    secs: Math.floor(diff / 1_000) % 60,
    expired: false,
  };
}

export function useCountdown(expiresAt: string | null): Countdown | null {
  const [state, setState] = useState<Countdown | null>(null);

  useEffect(() => {
    if (!expiresAt) return;
    const target = new Date(expiresAt).getTime();
    setState(compute(target));
    const id = setInterval(() => setState(compute(target)), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return state;
}
