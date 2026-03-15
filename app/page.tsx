'use client'

import { LidAngleProvider, useLidAngleContext } from '@/lib/LidAngleContext'
import PermissionGate from '@/components/PermissionGate'
import HarmoniumPlayer from '@/components/HarmoniumPlayer'

function Inner() {
  const { status, requestPermission } = useLidAngleContext()
  const showPlayer = status === 'active' || status === 'fallback'

  return (
    <main>
      {showPlayer ? (
        <HarmoniumPlayer />
      ) : (
        <PermissionGate status={status} onRequest={requestPermission} />
      )}
    </main>
  )
}

export default function Home() {
  return (
    <LidAngleProvider>
      <Inner />
    </LidAngleProvider>
  )
}
