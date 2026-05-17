"use client"

import { useEffect, useRef, useState } from "react"

const WORD_POOL = [
  // HTML/CSS
  "<!DOCTYPE html>", "<div>", "<section>", "<header>", "<main>", "<footer>",
  "flex", "grid", "border-radius", "background:", "color:", "padding:", "margin:",
  "position: absolute", "display: flex", "z-index:", "overflow: hidden",
  "font-family:", "font-size:", "transition:", "animation:", "transform:",
  // JS
  "const ", "function ", "return ", "async/await", "Promise.resolve()",
  "addEventListener", "querySelector", "useState()", "useEffect()",
  "Array.map()", ".filter()", ".reduce()", "JSON.parse()", "fetch()",
  "classList.add()", "innerHTML =", "appendChild()", "createElement()",
  // Gen phrases
  "analyzing structure...", "resolving deps...", "building layout...",
  "wiring logic...", "styling components...", "injecting scripts...",
  "optimizing output...", "writing index.html", "scanning files...",
  "applying styles...", "generating markup...", "compiling...",
]

interface Line {
  id: number
  text: string
  opacity: number
}

export function CliGenerating() {
  const [lines, setLines] = useState<Line[]>([])
  const [cursor, setCursor] = useState(true)
  const counterRef = useRef(0)

  useEffect(() => {
    const wordInterval = setInterval(() => {
      const word = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]
      const id = ++counterRef.current
      setLines((prev) => {
        const next = [...prev, { id, text: word, opacity: 1 }]
        return next.slice(-8)
      })
    }, 120)

    const cursorInterval = setInterval(() => {
      setCursor((c) => !c)
    }, 500)

    return () => {
      clearInterval(wordInterval)
      clearInterval(cursorInterval)
    }
  }, [])

  return (
    <div className="font-mono text-xs leading-5 py-2 px-1 min-w-[220px]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-emerald-400 font-bold">▶</span>
        <span className="text-emerald-400">generating</span>
        <span className={`text-emerald-300 ${cursor ? "opacity-100" : "opacity-0"} transition-opacity`}>█</span>
      </div>
      <div className="flex flex-col gap-0.5 overflow-hidden">
        {lines.map((line, i) => {
          const age = lines.length - 1 - i
          const opacity = age === 0 ? 1 : age < 3 ? 0.7 : age < 6 ? 0.35 : 0.15
          const color =
            line.text.startsWith("<") ? "text-sky-400" :
            line.text.includes(":") ? "text-violet-400" :
            line.text.includes("(") ? "text-amber-400" :
            line.text.includes("...") ? "text-emerald-400" :
            "text-slate-300"
          return (
            <div
              key={line.id}
              className={`${color} truncate transition-opacity duration-300`}
              style={{ opacity }}
            >
              <span className="text-slate-600 mr-1.5 select-none">
                {String(line.id).padStart(3, "0")}
              </span>
              {line.text}
            </div>
          )
        })}
      </div>
    </div>
  )
}
