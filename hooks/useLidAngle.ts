'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// idle     → not started yet
// requesting → asking for permission
// active   → MacBook lid / iOS tilt working
// tilt     → Windows convertible tilt working (whole device moves)
// fallback → mouse Y-axis
// denied   → permission rejected
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

// Detect if we're likely on a Mac (lid angle) vs a tilt device (convertible/phone)
function isMacLike(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /Macintosh|MacIntel/i.test(ua) && !/iPhone|iPad/i.test(ua)
}

export function useLidAngle(): LidAngleResult {
  const [angle, setAngle] = useState(90)
  const [rawBeta, setRawBeta] = useState<number | null>(null)
  const [status, setStatus] = useState<SensorStatus>('idle')
  const smoothedAngle = useRef(90)
  const mouseY = useRef<number>(0.5)

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

  // ── Tier 1: MacBook lid angle (beta axis, lid hinge) ──────────
  const handleMacOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.beta === null) return
    setRawBeta(e.beta)
    // MacBook: beta ~80 when closed, ~0 when fully open, negative when folded back
    // Remap to 0–180: 0° = closed, 90° = upright, 180° = folded back
    const mapped = clamp(90 - e.beta, 0, 180)
    smoothedAngle.current = lowPass(smoothedAngle.current, mapped, 0.12)
    setAngle(Math.round(smoothedAngle.current))
  }, [])

  // ── Tier 2: Windows convertible / tablet tilt (gamma axis) ────
  // On a 360° laptop or tablet held in hand, gamma (left-right tilt) or
  // beta (forward-back tilt) maps nicely to "how open" the device feels
  const handleTiltOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.beta === null && e.gamma === null) return

    const beta = e.beta ?? 0    // forward/back tilt: -180 to 180
    const gamma = e.gamma ?? 0  // left/right tilt: -90 to 90

    setRawBeta(beta)

    // Use beta (forward tilt) as primary control
    // Remap: device flat on table = 0°, held upright = ~90°, tilted back = ~150°
    const mapped = clamp(beta + 90, 0, 180)
    smoothedAngle.current = lowPass(smoothedAngle.current, mapped, 0.12)
    setAngle(Math.round(smoothedAngle.current))
  }, [])

  const requestPermission = useCallback(async () => {
    setStatus('requesting')

    // ── iOS 13+: requires explicit permission prompt ───────────────
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        if (permission === 'granted') {
          // iOS uses lid-style mapping (same as Mac)
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

    // ── Non-iOS: test if sensor fires at all ──────────────────────
    if (typeof DeviceOrientationEvent !== 'undefined') {
      let fired = false

      const testHandler = (e: DeviceOrientationEvent) => {
        if (e.beta === null && e.gamma === null) return
        fired = true
        window.removeEventListener('deviceorientation', testHandler)

        if (isMacLike()) {
          // Tier 1: MacBook — use lid angle (beta inversion)
          window.addEventListener('deviceorientation', handleMacOrientation)
          setStatus('active')
        } else {
          // Tier 2: Windows convertible / Android tablet — use tilt
          window.addEventListener('deviceorientation', handleTiltOrientation)
          setStatus('tilt')
        }
      }

      window.addEventListener('deviceorientation', testHandler)

      // If nothing fires in 1.5s → mouse fallback
      setTimeout(() => {
        if (!fired) {
          window.removeEventListener('deviceorientation', testHandler)
          setStatus('fallback')
        }
      }, 1500)
    } else {
      // No DeviceOrientationEvent support at all → mouse
      setStatus('fallback')
    }
  }, [handleMacOrientation, handleTiltOrientation])

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleMacOrientation)
      window.removeEventListener('deviceorientation', handleTiltOrientation)
    }
  }, [handleMacOrientation, handleTiltOrientation])

  return { angle, rawBeta, status, requestPermission }
}