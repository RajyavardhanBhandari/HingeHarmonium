'use client'

import { motion } from 'framer-motion'

interface Props {
  isPlaying: boolean
  angle: number
  bellowsPressure?: number  // 0–1 real pressure from audio engine
}

export default function BellowsIndicator({ isPlaying, angle, bellowsPressure = 0 }: Props) {
  // Map pressure to visual expansion (more air = more open)
  const expansion = isPlaying ? bellowsPressure : 0
  const foldCount = 7
  const baseHeight = 80
  const expandedHeight = baseHeight + expansion * 50

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        style={{
          fontSize: 8,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--brass)',
          opacity: 0.5,
          fontFamily: 'var(--font-crimson)',
        }}
      >
        Bellows
      </span>

      <div
        style={{
          width: 44,
          height: expandedHeight,
          transition: 'height 0.05s ease-out',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top plate */}
        <div style={{
          height: 6,
          background: 'linear-gradient(180deg, var(--brass-light), var(--brass-dark))',
          borderRadius: '2px 2px 0 0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
        }} />

        {/* Folds */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {Array.from({ length: foldCount }).map((_, i) => {
            const isOdd = i % 2 === 0
            const pressureColor = expansion > 0.5
              ? `rgba(181,136,42,${0.4 + expansion * 0.4})`
              : 'rgba(80,30,10,0.8)'
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Ridge */}
                <div style={{
                  height: 3,
                  background: isOdd
                    ? `linear-gradient(180deg, ${pressureColor}, rgba(30,10,2,0.9))`
                    : `linear-gradient(180deg, rgba(30,10,2,0.9), ${pressureColor})`,
                  transition: 'background 0.1s',
                }} />
                {/* Valley */}
                <div style={{
                  flex: 1,
                  background: isOdd
                    ? 'rgba(15,5,1,0.95)'
                    : 'rgba(40,15,5,0.7)',
                  borderLeft: '1px solid rgba(181,136,42,0.15)',
                  borderRight: '1px solid rgba(181,136,42,0.15)',
                }} />
              </div>
            )
          })}
        </div>

        {/* Bottom plate */}
        <div style={{
          height: 6,
          background: 'linear-gradient(180deg, var(--brass-dark), var(--brass))',
          borderRadius: '0 0 2px 2px',
          boxShadow: '0 -2px 4px rgba(0,0,0,0.4)',
        }} />

        {/* Glow when pressurized */}
        {expansion > 0.3 && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 2,
              background: `rgba(181,136,42,${expansion * 0.12})`,
              boxShadow: `0 0 ${expansion * 20}px rgba(181,136,42,${expansion * 0.4})`,
              pointerEvents: 'none',
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>

      {/* Pressure gauge dots */}
      <div style={{ display: 'flex', gap: 3, marginTop: 2 }}>
        {[0.25, 0.5, 0.75, 1.0].map((threshold) => (
          <div
            key={threshold}
            style={{
              width: 5, height: 5,
              borderRadius: '50%',
              background: expansion >= threshold ? 'var(--brass-light)' : 'rgba(181,136,42,0.15)',
              boxShadow: expansion >= threshold ? '0 0 4px var(--brass)' : 'none',
              transition: 'all 0.1s',
            }}
          />
        ))}
      </div>
    </div>
  )
}
