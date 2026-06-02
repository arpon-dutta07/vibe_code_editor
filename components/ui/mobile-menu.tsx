"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Menu slide-in animation
const menuSlide = {
  initial: { x: "calc(100% + 100px)" },
  enter: { x: "0", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: { x: "calc(100% + 100px)", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
};

// Staggered slide-in animation for links
const slide = {
  initial: { x: 80 },
  enter: (i: number) => ({
    x: 0,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i },
  }),
  exit: (i: number) => ({
    x: 80,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i },
  }),
};

// Active dot indicator scale animation
const scale = {
  open: { scale: 1, transition: { duration: 0.3 } },
  closed: { scale: 0, transition: { duration: 0.4 } },
};

interface MobileMenuProps {
  onClose: () => void;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/market", label: "Market" },
  { href: "/systems", label: "Systems" },
  { href: "/pricing", label: "Pricing" },
];

const footerLinks = [
  { label: "Docs", href: "/docs" },
  { label: "Github", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export function MobileMenu({ onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Safe window size detection to prevent SSR hydration errors
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const height = dimensions.height || 800; // default height fallback
  const initialPath = `M100 0 L100 ${height} Q-100 ${height / 2} 100 0`;
  const targetPath = `M100 0 L100 ${height} Q100 ${height / 2} 100 0`;

  const curve = {
    initial: { d: initialPath },
    enter: { d: targetPath, transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } },
    exit: { d: initialPath, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  };

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className="fixed right-0 top-0 h-screen w-full sm:max-w-[420px] bg-zinc-950 text-white z-[90] flex flex-col justify-between select-none shadow-2xl pointer-events-auto"
    >
      {/* Curve SVG boundary on the left edge */}
      <div className="absolute top-0 left-[-99px] w-[100px] h-full overflow-visible pointer-events-none">
        <svg className="w-full h-full fill-zinc-950 stroke-none">
          <motion.path
            variants={curve}
            initial="initial"
            animate="enter"
            exit="exit"
          />
        </svg>
      </div>

      <div className="box-border h-full px-[48px] py-[80px] sm:px-[80px] sm:py-[100px] flex flex-col justify-between">
        {/* Header / Nav Section */}
        <div
          onMouseLeave={() => setSelectedIndicator(pathname)}
          className="flex flex-col gap-3 mt-[40px] sm:mt-[60px]"
        >
          <div className="text-zinc-500 border-b border-zinc-900 pb-3 text-xs uppercase tracking-widest font-semibold">
            Navigation
          </div>
          <div className="flex flex-col gap-6 mt-4">
            {navLinks.map((link, idx) => {
              const isActive = link.href === "/"
                ? selectedIndicator === "/"
                : selectedIndicator.startsWith(link.href);
              const isPathActive = link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
              return (
                <motion.div
                  key={link.href}
                  custom={idx}
                  variants={slide}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  className="relative flex items-center"
                  onMouseEnter={() => setSelectedIndicator(link.href)}
                >
                  {/* Scale active dot indicator */}
                  <motion.div
                    variants={scale}
                    animate={isActive ? "open" : "closed"}
                    className="w-2 h-2 bg-rose-500 rounded-full absolute left-[-20px]"
                  />
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "text-3xl sm:text-4xl font-light transition-colors hover:text-rose-400",
                      isPathActive ? "text-rose-500 font-medium" : "text-zinc-300"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer links */}
        <div className="flex w-full justify-between text-xs gap-6 text-zinc-500 border-t border-zinc-900 pt-6">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
