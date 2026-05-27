"use client"

const RINGS = [
  { size: 540, inclineZ: 0,    duration: 14, opacity: 0.78, dotSize: 11 },
  { size: 470, inclineZ: 58,   duration: 21, opacity: 0.62, dotSize: 8,  reverse: true },
  { size: 400, inclineZ: -38,  duration: 17, opacity: 0.50, dotSize: 7 },
  { size: 330, inclineZ: 98,   duration: 26, opacity: 0.40, dotSize: 5,  reverse: true },
]

interface HeroOrbitProps {
  className?: string
  primaryRgb?: string
  accentRgb?: string
}

export function HeroOrbit({
  className,
  primaryRgb = "244,63,94",
  accentRgb = "99,102,241",
}: HeroOrbitProps) {
  return (
    <div className={`flex items-center justify-center ${className ?? ""}`}>
      {/* Nebula aurora — blurred radial, sits furthest back */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center,
            rgba(${primaryRgb},0.24) 0%,
            rgba(${accentRgb},0.11) 44%,
            transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* 3D ring system */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ perspective: "900px" }}
      >
        {/*
          Zero-size anchor at center with preserve-3d.
          Each ring is positioned relative to this anchor so all rings
          share the same 3D origin.
        */}
        <div
          style={{
            position: "relative",
            transformStyle: "preserve-3d",
            width: 0,
            height: 0,
          }}
        >
          {RINGS.map((ring, i) => (
            /*
              Inclination wrapper — static 3D tilt.
              rotateX(72deg) tips the ring away from the viewer so
              it reads as an orbital plane, not a flat circle.
              rotateZ offsets each ring to a different orbital inclination.
            */
            <div
              key={i}
              style={{
                position: "absolute",
                width: ring.size,
                height: ring.size,
                top: -ring.size / 2,
                left: -ring.size / 2,
                transform: `rotateX(72deg) rotateZ(${ring.inclineZ}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              {/*
                Spinning layer — owns the animation.
                Keyframe only sets rotateY so it never overrides the parent
                inclination (parent and child transforms compose in preserve-3d).
              */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  animation: `hero-orbit-spin ${ring.duration}s linear infinite ${
                    ring.reverse ? "reverse" : ""
                  }`,
                  willChange: "transform",
                }}
              >
                {/* Ring band */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: `1px solid rgba(${primaryRgb},${ring.opacity * 0.65})`,
                    boxShadow: [
                      `0 0 10px rgba(${primaryRgb},${ring.opacity * 0.38})`,
                      `0 0 22px rgba(${primaryRgb},${ring.opacity * 0.15})`,
                      `inset 0 0 8px rgba(${accentRgb},${ring.opacity * 0.08})`,
                    ].join(", "),
                  }}
                />

                {/*
                  Traveling dot — sits at 12 o'clock of the spinning div.
                  As the div rotates the dot orbits the ring.
                */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: ring.dotSize,
                    height: ring.dotSize,
                    borderRadius: "50%",
                    background: `rgba(${primaryRgb},1)`,
                    boxShadow: [
                      `0 0 6px  rgba(${primaryRgb},0.95)`,
                      `0 0 14px rgba(${primaryRgb},0.55)`,
                      `0 0 24px rgba(${accentRgb},0.30)`,
                    ].join(", "),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframes — ring spin + reduced-motion override */}
      <style jsx global>{`
        @keyframes hero-orbit-spin {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }

        /*
          prefers-reduced-motion: freeze all hero-orbit animations.
          Rings stay visible and orbital as static shapes — no motion.
        */
        @media (prefers-reduced-motion: reduce) {
          [class*="hero-orbit"],
          [style*="hero-orbit-spin"] {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  )
}
