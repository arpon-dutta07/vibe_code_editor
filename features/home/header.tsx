"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import UserButton from "../auth/components/user-button";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/market", label: "Market" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    /* Fixed so the hero WebGL canvas goes full-viewport behind the floating pill */
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-4 pt-3">
      <motion.div
        animate={{ maxWidth: scrolled ? 840 : 1180 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "mx-auto rounded-2xl pointer-events-auto",
          "flex items-center justify-between",
          "px-4 py-2.5",
          "transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300",
          scrolled
            ? [
                "bg-background/92",
                "backdrop-blur-2xl",
                "border border-zinc-200/70 dark:border-zinc-800/60",
                "shadow-[0_8px_40px_-4px_rgba(0,0,0,0.10),0_1px_0_rgba(0,0,0,0.04)]",
                "dark:shadow-[0_8px_40px_-4px_rgba(0,0,0,0.40)]",
              ].join(" ")
            : [
                "bg-white/12 dark:bg-white/5",
                "backdrop-blur-md",
                "border border-white/30 dark:border-white/10",
                "shadow-[0_2px_20px_rgba(0,0,0,0.04)]",
              ].join(" ")
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <Image
            src="/logo.svg"
            alt="VibeCode"
            height={28}
            width={28}
            className="shrink-0 transition-transform duration-300 group-hover:rotate-12"
          />
          <span className="font-bold text-[14px] tracking-[-0.01em] text-zinc-900 dark:text-white hidden sm:block">
            VibeCode
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={cn(
                "relative px-4 py-2 rounded-xl text-[13px] font-medium tracking-[0.005em] transition-colors duration-200",
                pathname === href
                  ? "text-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              )}
            >
              {label}
              {pathname === href && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-x-3 bottom-1.5 h-[1.5px] rounded-full bg-primary"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-0.5 mr-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors duration-200",
                  pathname === href
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400"
                )}
              >
                {label}
              </Link>
            ))}
          </div>
          <ThemeToggle />
          <UserButton />
        </div>
      </motion.div>
    </div>
  );
}
