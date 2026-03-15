'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export type SensorStatus = 'idle' | 'requesting' | 'active' | 'tilt' | 'fallback' | 'denied'

interface LidAngleResult {
  angle: number
  rawBeta: number | null
  status: SensorStatus
  requestPermission: () => Promise<void>
}

function lowPass(current: number, next: number, alpha = 0.15): number {
  return current + alpha * (next - current)
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val))
}

function isMacLike(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Macintosh|MacIntel/i.test(navigator.userAgent) && !/iPhone|iPad/i.test(navigator.userAgent)
}

export function useLidAngle(): LidAngleResult {
  const [angle, setAngle] = useState(90)
  const [rawBeta, setRawBeta] = useState<number | null>(null)
  const [status, setStatus] = useState<SensorStatus>('idle')
  const smoothedAngle = useRef(90)
  const mouseY = useRef<number>(0.5)
  const statusRef = useRef<SensorStatus>('idle')

  // Keep ref in sync so callbacks can read current status
  useEffect(() => { statusRef.current = status }, [status])

  // ── Tier 3: Mouse fallback ─────────────────────────────────────
  useEffect(() => {
    if (status !== 'fallback') return
    const handleMouse = (e: MouseEvent) => {
      mouseY.current = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', handleMouse)
    const interval = setInterval(() => {
      const target = (1 - mouseY.current) * 160 + 10
      smoothedAngle.current = lowPass(smoothedAngle.current, target, 0.1)
      setAngle(Math.round(smoothedAngle.current))
    }, 50)
    return () => {
      window.removeEventListener('mousemove', handleMouse)
      clearInterval(interval)
    }
  }, [status])

  // ── Tier 1: MacBook lid (beta axis) ───────────────────────────
  const handleMacOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.beta === null) return
    setRawBeta(e.beta)
    // MacBook flat/closed ≈ beta 80, upright ≈ beta 0, folded back = negative
    const mapped = clamp(90 - e.beta, 0, 180)
    smoothedAngle.current = lowPass(smoothedAngle.current, mapped, 0.15)
    setAngle(Math.round(smoothedAngle.current))
  }, [])

  // ── Tier 2: Windows convertible tilt ──────────────────────────
  const handleTiltOrientation = useCallback((e: DeviceOrientationEvent) => {
    const beta = e.beta ?? 0
    setRawBeta(beta)
    const mapped = clamp(beta + 90, 0, 180)
    smoothedAngle.current = lowPass(smoothedAngle.current, mapped, 0.15)
    setAngle(Math.round(smoothedAngle.current))
  }, [])

  const requestPermission = useCallback(async () => {
    setStatus('requesting')

    // ── iOS 13+: needs explicit permission ────────────────────────
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const result = await (DeviceOrientationEvent as any).requestPermission()
        if (result === 'granted') {
          window.addEventListener('deviceorientation', handleMacOrientation)
          setStatus('active')
        } else {
          setStatus('denied')
        }
      } catch {
        setStatus('fallback')
      }
      return
    }

    // ── macOS / Windows: test both event types ────────────────────
    if (typeof DeviceOrientationEvent === 'undefined') {
      setStatus('fallback')
      return
    }

    let fired = false
    let timeoutId: ReturnType<typeof setTimeout>

    const activate = (e: DeviceOrientationEvent) => {
      if (fired) return
      // Ignore if beta and gamma are both null or zero (sensor not ready)
      if (e.beta === null && e.gamma === null) return

      fired = true
      clearTimeout(timeoutId)
      window.removeEventListener('deviceorientation', testHandler)
      window.removeEventListener('deviceorientationabsolute', testHandlerAbs as any)

      if (isMacLike()) {
        window.addEventListener('deviceorientation', handleMacOrientation)
        setStatus('active')
      } else {
        window.addEventListener('deviceorientation', handleTiltOrientation)
        setStatus('tilt')
      }
    }

    // Some browsers (Chrome on Mac) fire deviceorientationabsolute instead
    const testHandler = (e: DeviceOrientationEvent) => activate(e)
    const testHandlerAbs = (e: DeviceOrientationEvent) => activate(e)

    window.addEventListener('deviceorientation', testHandler)
    window.addEventListener('deviceorientationabsolute', testHandlerAbs as any)

    // Give it 3s before falling back (Mac sensors can be slow to start)
    timeoutId = setTimeout(() => {
      if (!fired) {
        window.removeEventListener('deviceorientation', testHandler)
        window.removeEventListener('deviceorientationabsolute', testHandlerAbs as any)
        setStatus('fallback')
      }
    }, 3000)

  }, [handleMacOrientation, handleTiltOrientation])

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleMacOrientation)
      window.removeEventListener('deviceorientation', handleTiltOrientation)
    }
  }, [handleMacOrientation, handleTiltOrientation])

  return { angle, rawBeta, status, requestPermission }
}