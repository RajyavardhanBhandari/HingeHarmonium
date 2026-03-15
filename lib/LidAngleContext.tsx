'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useLidAngle, SensorStatus } from '@/hooks/useLidAngle'

interface LidAngleContextType {
  angle: number
  rawBeta: number | null
  status: SensorStatus
  requestPermission: () => Promise<void>
}

const LidAngleContext = createContext<LidAngleContextType | null>(null)

export function LidAngleProvider({ children }: { children: ReactNode }) {
  const value = useLidAngle()
  return <LidAngleContext.Provider value={value}>{children}</LidAngleContext.Provider>
}

export function useLidAngleContext() {
  const ctx = useContext(LidAngleContext)
  if (!ctx) throw new Error('useLidAngleContext must be used inside LidAngleProvider')
  return ctx
}
