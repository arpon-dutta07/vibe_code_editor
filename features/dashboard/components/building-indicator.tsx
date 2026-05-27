"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"

interface BuildingIndicatorProps {
  isVisible: boolean
  onComplete: () => void
}

const STEPS = [
  {
    label: "Analysing your prompt...",
    code: "parsing user intent → layout: hero + features + cta"
  },
  {
    label: "Writing HTML...",
    code: "creating section hero, nav, div features"
  },
  {
    label: "Styling with CSS...",
    code: "applying dark theme, glassmorphism, responsive grid"
  },
  {
    label: "Adding interactivity...",
    code: "wiring onClick handlers, scroll animations, toggles"
  }
]

export function BuildingIndicator({ isVisible, onComplete }: BuildingIndicatorProps) {
  const [progresses, setProgresses] = useState<number[]>([0, 0, 0, 0])
  const [currentStep, setCurrentStep] = useState<number>(0)

  useEffect(() => {
    if (!isVisible) return

    setProgresses([0, 0, 0, 0])
    setCurrentStep(0)

    let stepIdx = 0
    let currentProgress = 0

    const timer = setInterval(() => {
      if (stepIdx >= 4) {
        clearInterval(timer)
        setTimeout(() => {
          onComplete()
        }, 500)
        return
      }

      const increment = Math.random() * 4 + 1
      currentProgress += increment

      if (currentProgress >= 100) {
        currentProgress = 100
        setProgresses((prev) => {
          const next = [...prev]
          next[stepIdx] = 100
          return next
        })
        stepIdx += 1
        setCurrentStep(stepIdx)
        currentProgress = 0
      } else {
        const current = stepIdx
        const prog = currentProgress
        setProgresses((prev) => {
          const next = [...prev]
          next[current] = Math.round(prog)
          return next
        })
      }
    }, 60)

    return () => clearInterval(timer)
  }, [isVisible, onComplete])

  if (!isVisible) return null

  const isFinished = currentStep >= 4
  const activeStep = Math.min(currentStep, 3)
  const statusText = isFinished ? "Build complete" : STEPS[activeStep].label

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl w-full max-w-[480px] font-sans animate-slide-in relative overflow-hidden select-none">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.15); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes step-done {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s infinite ease-in-out;
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out forwards;
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        .animate-step-done {
          animation: step-done 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}} />

      {/* Top Header Row */}
      <div className="flex items-center justify-between w-full pb-4 border-b border-[#2a2a2a] mb-6">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isFinished ? 'bg-emerald-400 animate-pulse-ring' : 'bg-[#FF2D78] animate-pulse-ring'}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isFinished ? 'bg-emerald-500' : 'bg-[#FF2D78]'}`} />
          </div>
          <span className={`text-xs font-bold font-mono tracking-wider uppercase ${isFinished ? 'text-emerald-500' : 'text-zinc-400'}`}>
            {statusText}
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/30 border border-red-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30 border border-yellow-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 border border-emerald-500/20" />
        </div>
      </div>

      {/* Steps List */}
      <div className="flex flex-col gap-5 w-full">
        {STEPS.map((step, idx) => {
          const isDone = progresses[idx] === 100
          const isActive = idx === currentStep
          const notStarted = idx > currentStep
          const progress = progresses[idx]

          return (
            <div 
              key={idx} 
              className="flex items-center gap-4 transition-opacity duration-300 w-full"
              style={{ opacity: notStarted ? 0.35 : 1 }}
            >
              {/* Step circle icon */}
              <div className="flex-shrink-0">
                {isDone ? (
                  <div className="w-6 h-6 rounded-full bg-[#FF2D78] flex items-center justify-center text-white animate-step-done shadow-[0_0_12px_rgba(255,45,120,0.4)]">
                    <Check className="w-3.5 h-3.5" strokeWidth={3.5} />
                  </div>
                ) : (
                  <div className={`w-6 h-6 rounded-full bg-[#262626] border border-[#2a2a2a] flex items-center justify-center text-[10px] font-mono font-bold ${isActive ? 'text-[#FF2D78] border-[#FF2D78]/40' : 'text-zinc-500'}`}>
                    {idx + 1}
                  </div>
                )}
              </div>

              {/* Progress and labels */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`text-[13px] font-bold ${isActive ? 'text-zinc-200' : isDone ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] font-mono text-[#555]">
                    {progress}%
                  </span>
                </div>
                <div className="w-full h-[3px] bg-[#222] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#FF2D78] rounded-full transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Terminal Footer block */}
      <div className="w-full mt-6 p-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl font-mono text-[11px] text-zinc-400 flex items-center gap-1.5 overflow-hidden min-h-[40px]">
        <span className="text-[#FF2D78] select-none font-bold shrink-0">&gt;</span>
        <span className="truncate flex-1 select-all">
          {isFinished ? "ready" : STEPS[activeStep].code}
        </span>
        <span className="w-[7px] h-[13px] bg-[#FF2D78] inline-block shrink-0 animate-blink shadow-[0_0_8px_rgba(255,45,120,0.6)]" />
      </div>
    </div>
  )
}
