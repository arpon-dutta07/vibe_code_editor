"use client"

import { useEffect, useState } from "react"

// Braille spinner frames — same as Claude CLI
const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]

// Cycling words that swap out like Claude CLI
const CYCLING_WORDS = [
  "Thinking",
  "Analyzing",
  "Planning layout",
  "Writing HTML",
  "Styling",
  "Adding logic",
  "Optimizing",
  "Refining code",
  "Building",
  "Generating",
  "Structuring",
  "Crafting",
]

export function CliGenerating() {
  const [spinnerIdx, setSpinnerIdx] = useState(0)
  const [wordIdx, setWordIdx] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    // Fast spinner — ~80ms like Claude CLI
    const spinnerInterval = setInterval(() => {
      setSpinnerIdx((i) => (i + 1) % SPINNER_FRAMES.length)
    }, 80)

    // Word cycle — fade out → swap → fade in
    const wordInterval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % CYCLING_WORDS.length)
        setFade(true)
      }, 200)
    }, 1600)

    return () => {
      clearInterval(spinnerInterval)
      clearInterval(wordInterval)
    }
  }, [])

  return (
    <div className="flex items-center gap-2.5 py-1.5 px-0.5 font-mono select-none">
      {/* Spinning braille character */}
      <span
        className="text-[#FF2D78] font-bold text-[15px] leading-none w-4 text-center shrink-0"
        aria-hidden
      >
        {SPINNER_FRAMES[spinnerIdx]}
      </span>

      {/* Cycling word with fade transition */}
      <span
        className="text-[13px] font-medium tracking-wide transition-opacity duration-200"
        style={{ opacity: fade ? 1 : 0 }}
      >
        <span className="text-zinc-200">{CYCLING_WORDS[wordIdx]}</span>
        <span className="text-[#FF2D78]">...</span>
      </span>
    </div>
  )
}
