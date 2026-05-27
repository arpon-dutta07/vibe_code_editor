"use client"

import { useEffect, useRef } from "react"

interface Rotating3DObjectProps {
  isHovered?: boolean
}

export function Rotating3DObject({ isHovered = false }: Rotating3DObjectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const speedRef = useRef(1.0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = canvas.width
    let height = canvas.height

    const handleResize = () => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * (window.devicePixelRatio || 1)
      canvas.height = rect.height * (window.devicePixelRatio || 1)
      width = canvas.width
      height = canvas.height
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // Generate 3D sphere points
    const points: { x: number; y: number; z: number }[] = []
    const numLat = 12
    const numLon = 20
    const radius = 120 // Larger, more impressive sphere matching the original layout

    for (let i = 0; i <= numLat; i++) {
      const lat = (i * Math.PI) / numLat - Math.PI / 2
      for (let j = 0; j < numLon; j++) {
        const lon = (j * 2 * Math.PI) / numLon
        const x = radius * Math.cos(lat) * Math.cos(lon)
        const y = radius * Math.cos(lat) * Math.sin(lon)
        const z = radius * Math.sin(lat)
        points.push({ x, y, z })
      }
    }

    let rx = 0
    let ry = 0
    let rz = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const cx = canvas.width / (2 * (window.devicePixelRatio || 1))
      const cy = canvas.height / (2 * (window.devicePixelRatio || 1))

      // Smoothly interpolate rotation speed based on hover state
      const targetSpeed = isHovered ? 2.5 : 1.0
      speedRef.current += (targetSpeed - speedRef.current) * 0.05
      
      const speedMultiplier = speedRef.current

      // Adjust rotation angles dynamically
      rx += 0.002 * speedMultiplier
      ry += 0.0035 * speedMultiplier
      rz += 0.0015 * speedMultiplier

      const cosX = Math.cos(rx)
      const sinX = Math.sin(rx)
      const cosY = Math.cos(ry)
      const sinY = Math.sin(ry)
      const cosZ = Math.cos(rz)
      const sinZ = Math.sin(rz)

      // Project and rotate points
      const rotatedPoints = points.map((p) => {
        // Rotate X
        const y1 = p.y * cosX - p.z * sinX
        const z1 = p.y * sinX + p.z * cosX

        // Rotate Y
        const x2 = p.x * cosY + z1 * sinY
        const z2 = -p.x * sinY + z1 * cosY

        // Rotate Z
        const x3 = x2 * cosZ - y1 * sinZ
        const y3 = x2 * sinZ + y1 * cosZ

        // 3D perspective projection
        const fov = 450
        const distance = 280
        const scale = fov / (distance + z2)
        const projX = cx + x3 * scale
        const projY = cy + y3 * scale

        return { x: projX, y: projY, z: z2 }
      })

      // Draw latitude lines
      ctx.lineWidth = 0.55
      for (let i = 0; i <= numLat; i++) {
        ctx.beginPath()
        for (let j = 0; j < numLon; j++) {
          const idx = i * numLon + j
          const nextIdx = i * numLon + ((j + 1) % numLon)
          const p1 = rotatedPoints[idx]
          const p2 = rotatedPoints[nextIdx]
          
          if (p1 && p2) {
            // Fades out lines on the backside (Z-depth)
            const alpha = Math.max(0.02, Math.min(0.22, (p1.z + radius) / (2 * radius)))
            // Create vibrant cyber color blending (rose to violet on hover)
            const red = isHovered ? 251 : 244
            const green = isHovered ? 113 : 63
            const blue = isHovered ? 133 : 94
            ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${alpha * (isHovered ? 1.8 : 1.2)})`
            
            if (j === 0) ctx.moveTo(p1.x, p1.y)
            else ctx.lineTo(p1.x, p1.y)
          }
        }
        ctx.closePath()
        ctx.stroke()
      }

      // Draw longitude lines
      ctx.lineWidth = 0.35
      for (let j = 0; j < numLon; j++) {
        ctx.beginPath()
        for (let i = 0; i <= numLat; i++) {
          const idx = i * numLon + j
          const p = rotatedPoints[idx]
          if (p) {
            if (i === 0) ctx.moveTo(p.x, p.y)
            else ctx.lineTo(p.x, p.y)
          }
        }
        ctx.strokeStyle = isHovered 
          ? "rgba(16, 185, 129, 0.12)" 
          : "rgba(16, 185, 129, 0.06)"
        ctx.stroke()
      }

      // Draw vertex glow points
      rotatedPoints.forEach((p, idx) => {
        if (idx % 5 === 0) {
          const alpha = Math.max(0.08, Math.min(0.65, (p.z + radius) / (2 * radius)))
          ctx.fillStyle = isHovered 
            ? `rgba(244, 63, 94, ${alpha * 1.3})`
            : `rgba(244, 63, 94, ${alpha * 0.8})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, isHovered ? 2.0 : 1.4, 0, 2 * Math.PI)
          ctx.fill()
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isHovered])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full absolute inset-0 pointer-events-none mix-blend-screen z-0"
    />
  )
}
