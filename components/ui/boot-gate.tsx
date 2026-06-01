"use client";

import * as React from "react";

import { SiteLoader } from "@/components/ui/site-loader";

interface BootGateProps {
  children: React.ReactNode;
  /** Minimum time the loader stays up so a fast load still reads as intentional. */
  minDurationMs?: number;
  /** Hard cap so the loader can never trap the user. */
  maxDurationMs?: number;
  /** Curtain fill (defaults to brand). */
  color?: string;
  /** Text color on the curtain (defaults to brand foreground). */
  foreground?: string;
}

/**
 * Full-page boot loader. Visible on every hard reload (true on first paint).
 * Drives a real 0→100 counter: the number climbs toward 95 over `minDurationMs`,
 * holds until the window 'load' event fires, then snaps to 100 and the curtain
 * splits open to reveal the page.
 */
export function BootGate({
  children,
  minDurationMs = 1600,
  maxDurationMs = 8000,
  color,
  foreground,
}: BootGateProps) {
  const [progress, setProgress] = React.useState(0);
  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    let raf = 0;
    let loaded = document.readyState === "complete";
    let phase2Start: number | null = null;
    const start = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const onLoad = () => {
      loaded = true;
    };
    if (!loaded) window.addEventListener("load", onLoad, { once: true });
    const cap = setTimeout(() => {
      loaded = true;
    }, maxDurationMs);

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - start;
      const ready = loaded && elapsed >= minDurationMs;

      if (!ready) {
        // Climb 0 → 95, then hold at 95 until the page is ready.
        setProgress(easeOut(Math.min(1, elapsed / minDurationMs)) * 95);
        raf = requestAnimationFrame(tick);
        return;
      }

      // Ready: ease 95 → 99, hold on 99, then trigger the reveal.
      if (phase2Start === null) phase2Start = now;
      const t2 = Math.min(1, (now - phase2Start) / 350);
      setProgress(95 + easeOut(t2) * 4);

      if (t2 >= 1) {
        setProgress(99);
        setTimeout(() => {
          if (!cancelled) setShow(false);
        }, 1010);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(cap);
      window.removeEventListener("load", onLoad);
    };
  }, [minDurationMs, maxDurationMs]);

  return (
    <>
      <SiteLoader show={show} progress={progress} color={color} foreground={foreground} />
      {children}
    </>
  );
}

export default BootGate;
