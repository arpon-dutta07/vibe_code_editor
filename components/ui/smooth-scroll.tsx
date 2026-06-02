"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const scrollRef = React.useRef<any>(null);

  const isExcluded = React.useMemo(() => {
    if (!pathname) return false;
    return (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/project") ||
      pathname.startsWith("/users")
    );
  }, [pathname]);

  React.useEffect(() => {
    let scrollInstance: any = null;

    if (isExcluded) {
      if (scrollRef.current) {
        scrollRef.current.destroy();
        scrollRef.current = null;
      }
      return;
    }

    // Dynamic import of LocomotiveScroll to prevent server-side rendering errors
    const initLocomotive = async () => {
      try {
        const LocomotiveScroll = (await import("locomotive-scroll")).default;
        scrollInstance = new LocomotiveScroll({
          lenisOptions: {
            wrapper: window,
            content: document.documentElement,
            lerp: 0.08, // Subtle, premium feeling lag
            duration: 1.2, // Smooth duration
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
          } as any,
        });
        scrollRef.current = scrollInstance;
      } catch (err) {
        console.error("Locomotive scroll initialization failed:", err);
      }
    };

    initLocomotive();

    return () => {
      if (scrollInstance) {
        scrollInstance.destroy();
      }
      if (scrollRef.current) {
        scrollRef.current.destroy();
        scrollRef.current = null;
      }
    };
  }, [isExcluded]);

  return <>{children}</>;
}

export default SmoothScroll;
