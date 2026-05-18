"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
}

export const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 30,
  staticity = 50,
  ease = 50,
  refresh = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const particles = useRef<any[]>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, [resolvedTheme]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const onMouseMove = (e: MouseEvent) => {
    if (canvasContainerRef.current) {
      const rect = canvasContainerRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      mouse.current.x = x * dpr;
      mouse.current.y = y * dpr;
    }
  };

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      particles.current = [];
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  type Particle = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
  };

  const circleParams = (): Particle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const size = Math.floor(Math.random() * 2) + 0.1;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.2;
    const dy = (Math.random() - 0.5) * 0.2;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const drawCircle = (circle: Particle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = resolvedTheme === "dark" 
        ? `rgba(255, 255, 255, ${alpha})` 
        : `rgba(0, 0, 0, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        particles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h
      );
    }
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    stop1: number,
    start2: number,
    stop2: number
  ): number => {
    const rel = (value - start1) / (stop1 - start1);
    return start2 + rel * (stop2 - start2);
  };

  const animate = () => {
    clearContext();
    particles.current.forEach((particle: Particle, i: number) => {
      // Handle the alpha
      const edge = [
        particle.x + particle.translateX - particle.size, // left
        canvasSize.current.w - particle.x - particle.translateX - particle.size, // right
        particle.y + particle.translateY - particle.size, // top
        canvasSize.current.h - particle.y - particle.translateY - particle.size, // bottom
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
      );
      if (remapClosestEdge > 1) {
        particle.alpha += 0.02;
        if (particle.alpha > particle.targetAlpha) {
          particle.alpha = particle.targetAlpha;
        }
      } else {
        particle.alpha = particle.targetAlpha * remapClosestEdge;
      }

      particle.x += particle.dx;
      particle.y += particle.dy;
      particle.translateX +=
        (mouse.current.x / (staticity / particle.magnetism) -
          particle.translateX) /
        ease;
      particle.translateY +=
        (mouse.current.y / (staticity / particle.magnetism) -
          particle.translateY) /
        ease;

      // circle gets out of the canvas
      if (
        particle.x < -particle.size ||
        particle.x > canvasSize.current.w + particle.size ||
        particle.y < -particle.size ||
        particle.y > canvasSize.current.h + particle.size
      ) {
        // remove the particle from the array
        particles.current.splice(i, 1);
        // add a new particle
        const newParticle = circleParams();
        drawCircle(newParticle);
      } else {
        drawCircle(
          {
            ...particle,
            x: particle.x,
            y: particle.y,
            translateX: particle.translateX,
            translateY: particle.translateY,
            alpha: particle.alpha,
          },
          true
        );
      }
    });
    window.requestAnimationFrame(animate);
  };

  return (
    <div
      className={className}
      ref={canvasContainerRef}
      onMouseMove={() => onMouseMove}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};
