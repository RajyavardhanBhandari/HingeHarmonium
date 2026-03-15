'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export type SensorStatus = 'idle' | 'requesting' | 'active' | 'fallback' | 'denied'

interface LidAngleResult {
  angle: number          // 0–180 degrees
  rawBeta: number | null // raw sensor beta value
  status: SensorStatus
  requestPermission: () => Promise<void>
}

// Low-pass filter for smoothing
function lowPass(current: number, next: number, alpha = 0.15): number {
  return current + alpha * (next - current)
}

// Clamp angle to 0–180
function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val))
}

export function useLidAngle(): LidAngleResult {
  const [angle, setAngle] = useState(90)
  const [rawBeta, setRawBeta] = useState<number | null>(null)
  const [status, setStatus] = useState<SensorStatus>('idle')
  const smoothedAngle = useRef(90)
  const mouseY = useRef<number>(0.5)

  // Mouse fallback
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

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.beta === null) return
    const beta = e.beta // -180 to 180
    setRawBeta(beta)

    // On a MacBook lying flat = ~0°, opened upright = ~90°, folded back = ~180°
    // beta when lid open varies: roughly maps 0–90 open angle to beta 80–0
    // We invert and remap to 0–180 range
    let mapped = clamp(90 - beta, 0, 180)
    smoothedAngle.current = lowPass(smoothedAngle.current, mapped, 0.12)
    setAngle(Math.round(smoothedAngle.current))
  }, [])

  const requestPermission = useCallback(async () => {
    setStatus('requesting')

    // iOS 13+ requires explicit permission
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation)
          setStatus('active')
        } else {
          setStatus('denied')
        }
      } catch {
        setStatus('fallback')
      }
    } else if (typeof DeviceOrientationEvent !== 'undefined') {
      // Non-iOS: just add listener and hope
      let fired = false
      const testHandler = (e: DeviceOrientationEvent) => {
        if (e.beta !== null) {
          fired = true
          setStatus('active')
          window.removeEventListener('deviceorientation', testHandler)
          window.addEventListener('deviceorientation', handleOrientation)
        }
      }
      window.addEventListener('deviceorientation', testHandler)
      // If no event fires in 1.5s, fall back to mouse
      setTimeout(() => {
        if (!fired) {
          window.removeEventListener('deviceorientation', testHandler)
          setStatus('fallback')
        }
      }, 1500)
    } else {
      setStatus('fallback')
    }
  }, [handleOrientation])

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [handleOrientation])

  return { angle, rawBeta, status, requestPermission }
}
