"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}`;

const FRAG = `precision mediump float;
uniform vec2 res;
uniform float t;
uniform vec2 mouse;
uniform float dark;

float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

void main(){
  vec2 uv=vec2(gl_FragCoord.x,res.y-gl_FragCoord.y)/res;
  vec2 sv=uv+vec2(mouse.x,-mouse.y)*0.042;

  float cs=44.0;
  vec2 cUV=sv*res/cs;
  vec2 g=fract(cUV);
  vec2 id=floor(cUV+0.5);

  float lw=0.025;
  float lines=max(step(1.0-lw,g.x),step(1.0-lw,g.y));

  vec2 toC=min(g,1.0-g);
  float corner=smoothstep(0.13,0.0,length(toC));

  float hv=h21(id);
  float pulse=0.4+0.6*sin(t*(0.3+hv*0.5)+hv*6.28318);

  vec2 ctr=uv-0.5;
  float fade=1.0-smoothstep(0.18,0.72,length(ctr));

  float lc=dark>0.5?0.22:0.07;
  vec3 lCol=vec3(lc);
  vec3 dCol=vec3(0.957,0.247,0.369);

  vec3 col=mix(lCol,dCol,corner);
  float lineA=lines*(1.0-corner)*0.18;
  float dotA=corner*(0.12+0.28*pulse);
  float alpha=max(lineA,dotA)*fade;

  gl_FragColor=vec4(col,alpha);
}`;

export interface GridShaderProps {
  className?: string;
  mouseRef?: React.RefObject<{ x: number; y: number }>;
}

export function GridShader({ className, mouseRef }: GridShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const startRef = useRef(Date.now());
  const visibleRef = useRef(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isDark = resolvedTheme === "dark";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const mkShader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vs = mkShader(gl.VERTEX_SHADER, VERT);
    const fs = mkShader(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aLoc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "res");
    const uT = gl.getUniformLocation(prog, "t");
    const uMouse = gl.getUniformLocation(prog, "mouse");
    const uDark = gl.getUniformLocation(prog, "dark");

    let lastWidth = 0;
    let lastHeight = 0;

    const resize = () => {
      const w = canvas.clientWidth || canvas.offsetWidth;
      const h = canvas.clientHeight || canvas.offsetHeight;
      if (w === lastWidth && h === lastHeight && w > 0 && h > 0) return;
      lastWidth = w;
      lastHeight = h;

      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([e]) => { visibleRef.current = e.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas);

    const drawFrame = (time: number, mx: number, my: number, dark: boolean) => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, time);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uDark, dark ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    if (reduced) {
      drawFrame(0, 0, 0, isDark);
    } else {
      const loop = () => {
        rafRef.current = requestAnimationFrame(loop);
        if (!visibleRef.current) return;
        drawFrame(
          (Date.now() - startRef.current) / 1000,
          mouseRef?.current?.x ?? 0,
          mouseRef?.current?.y ?? 0,
          isDark
        );
      };
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(prog);
    };
  }, [resolvedTheme, mouseRef]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
