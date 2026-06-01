"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

/* Site's signature expo curve (matches globals.css cubic-bezier(0.16,1,0.3,1)). */
const EASE = [0.16, 1, 0.3, 1] as const;

interface SiteLoaderProps {
  /** Mount/unmount the loader. The line-draw + split reveal plays on false. */
  show?: boolean;
  /** 0–100 for a real counter. Omit to auto-count over `countDurationMs`. */
  progress?: number;
  /** How long the auto counter takes to reach 100 when `progress` is omitted. */
  countDurationMs?: number;
  /** Curtain fill. Defaults to the brand color (reads in both themes). */
  color?: string;
  /** Text color on the curtain. */
  foreground?: string;
  /** Colored tile in the counter (left box bg / right box text). */
  boxColor?: string;
  /** White tile in the counter (right box bg / left box text). */
  boxWhite?: string;
  /** Fired after the reveal finishes — good for unmounting a route gate. */
  onExitComplete?: () => void;
  className?: string;
}

/** rAF counter, cubic-out so it decelerates into 100 (spylt feel). */
function useAutoCount(durationMs: number, enabled: boolean) {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const start = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setN(Math.round(easeOut(t) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, enabled]);
  return n;
}

/* Square box size + digit size — fluid so it needs no media queries.
   Numerals are large relative to the box so they nearly fill / crop it (reference look). */
const BOX = "clamp(4.5rem, 14vw, 7.5rem)"; /* tile height */
const BOX_W = `calc(${BOX} * 0.8)`; /* narrower than tall — trims the horizontal padding */
/* Numerals sized so the padding is even on all four sides. */
const BOX_FS = "clamp(5rem, 16.5vw, 9rem)";
const COUNTER_FONT = "var(--font-counter), system-ui, sans-serif";
/* Reel cells are taller than the box so neighbouring digits stay clear of the
   box window — the active glyph can crop to the edges without a neighbour sliver. */
const CELL = `calc(${BOX} * 1.65)`;

/* One digit in a square tile. The 0-9 reel slides vertically (befreaky-style roll).
   Global reduced-motion CSS zeroes the transition (instant). */
function BoxDigit({ d, bg, fg }: { d: number; bg: string; fg: string }) {
  // Center digit d inside the box window: box centre minus the digit cell's centre.
  const y = `calc((${BOX} / 2) - (${CELL} * ${d}) - (${CELL} / 2))`;
  return (
    <span
      className="relative block overflow-hidden"
      style={{
        width: BOX_W,
        height: BOX,
        background: bg,
        color: fg,
        fontSize: BOX_FS,
        fontFamily: COUNTER_FONT,
        fontWeight: 300,
      }}
    >
      <span
        className="absolute inset-x-0 top-0 flex flex-col tabular-nums"
        style={{ transform: `translateY(${y})`, transition: "transform 1.1s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="grid place-items-center" style={{ height: CELL, width: BOX_W, lineHeight: 1 }}>
            {i}
          </span>
        ))}
      </span>
    </span>
  );
}

/* Two-digit counter (00–99) as an inverted tile pair:
   left = colored bg + white digit, right = white bg + colored digit. */
function BoxCounter({ value, boxColor, white }: { value: number; boxColor: string; white: string }) {
  const v = Math.max(0, Math.min(99, value));
  return (
    <span className="flex gap-[3px]" aria-hidden>
      <BoxDigit d={Math.floor(v / 10)} bg={boxColor} fg={white} />
      <BoxDigit d={v % 10} bg={white} fg={boxColor} />
    </span>
  );
}

/* Signature handwriting/outline animation for "Vibecoder".
   Renders the default site font with outline-drawing to fill transition. */
function VibecoderText({ color }: { color: string }) {
  const draw = {
    hidden: { 
      strokeDashoffset: 1000, 
      strokeDasharray: 1000, 
      fill: "rgba(255, 255, 255, 0)",
      fillOpacity: 0,
      opacity: 0 
    },
    visible: {
      strokeDashoffset: 0,
      strokeDasharray: 1000,
      fill: color,
      fillOpacity: 1,
      opacity: 1,
      transition: {
        strokeDashoffset: { duration: 1.8, ease: "easeInOut" },
        fill: { delay: 0.9, duration: 1.2, ease: [0.25, 1, 0.5, 1] },
        fillOpacity: { delay: 0.9, duration: 1.2, ease: [0.25, 1, 0.5, 1] },
        opacity: { duration: 0.2 },
      },
    },
  };

  return (
    <svg
      width="400"
      height="120"
      viewBox="0 0 400 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="max-w-full h-auto"
    >
      <motion.text
        x="50%"
        y="62%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke={color}
        strokeWidth="2"
        variants={draw}
        fontSize="76"
        style={{
          fontFamily: "var(--font-poppins), var(--font-sans), sans-serif",
          fontWeight: 800,
          letterSpacing: "-0.03em",
        }}
      >
        Vibecoder
      </motion.text>
    </svg>
  );
}

export function SiteLoader({
  show = true,
  progress,
  countDurationMs = 1600,
  color = "var(--loader-curtain)",
  foreground = "var(--loader-on)",
  boxColor = "var(--loader-box)",
  boxWhite = "#ffffff",
  onExitComplete,
  className,
}: SiteLoaderProps) {
  const reduce = useReducedMotion();
  const determinate = typeof progress === "number";
  const auto = useAutoCount(countDurationMs, !determinate);
  /* Counter tops out at 99 — never shows 100 (befreaky.co style). */
  const count = Math.min(99, determinate ? Math.max(0, Math.round(progress!)) : auto);

  /* Panels split apart on exit: top half up, bottom half down — after the line is drawn. */
  const panelExit = (dir: -1 | 1) =>
    reduce
      ? { opacity: 0, transition: { duration: 0.3, delay: 0.2 } }
      : { y: `${dir * 100}%`, transition: { duration: 0.85, ease: EASE, delay: 0.55 } };

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {show && (
        <motion.div
          role="status"
          aria-busy="true"
          aria-label={`Loading ${count}%`}
          className={cn("fixed inset-0 z-[100] overflow-hidden", className)}
          initial={false}
        >
          {/* Top half of the curtain. 0.5px overflow hides the midline seam during load. */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 top-0"
            style={{ height: "calc(50% + 0.5px)", background: color, willChange: "transform" }}
            initial={reduce ? { opacity: 1 } : { y: 0 }}
            exit={panelExit(-1)}
          />
          {/* Bottom half. */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{ background: color, willChange: "transform" }}
            initial={reduce ? { opacity: 1 } : { y: 0 }}
            exit={panelExit(1)}
          />

          {/* p10 exit line: a thread in the theme background color draws across the midline,
              then the curtain opens along it. Hidden (scaleX 0) during load. */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="absolute inset-x-0 top-1/2 z-20 h-[5px] -translate-y-1/2 origin-center"
              style={{ background: "var(--background)", willChange: "transform, opacity", scaleX: 0 }}
              /* Draw fully edge-to-edge (~0.55s), hold across the whole reveal, vanish at ~1.5s. */
              exit={{
                scaleX: [0, 1, 1, 1],
                opacity: [1, 1, 1, 0],
                transition: { duration: 1.75, ease: EASE, delay: 0.05, times: [0, 0.29, 0.83, 1] },
              }}
            />
          )}

          {/* Center content — fades out before the split opens. */}
          <motion.div
            className="absolute inset-0 z-10 grid place-items-center px-6 text-center"
            style={{ color: foreground }}
            exit={{ opacity: 0, transition: { duration: reduce ? 0.2 : 0.3, ease: "easeIn" } }}
          >
            {/* Handwriting wordmark animation. */}
            <motion.div
              initial="hidden"
              animate="visible"
              aria-label="Vibecoder"
              className="flex items-center justify-center h-48 w-full max-w-2xl mx-auto"
            >
              <VibecoderText color={foreground} />
            </motion.div>
          </motion.div>

          {/* Giant counter, bottom corner (spylt). Tabular so digits don't jitter. */}
          <motion.div
            className="absolute bottom-6 right-6 z-10 flex items-end leading-none sm:bottom-10 sm:right-10"
            style={{ color: foreground, fontVariantNumeric: "tabular-nums" }}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.15 } }}
            exit={{ opacity: 0, transition: { duration: reduce ? 0.2 : 0.3, ease: "easeIn" } }}
          >
            <BoxCounter value={count} boxColor={boxColor} white={boxWhite} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SiteLoader;
