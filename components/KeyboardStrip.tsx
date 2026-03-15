'use client'

import { motion } from 'framer-motion'
import { NOTES } from '@/hooks/useHarmonium'

interface Props {
  activeIndex: number
  isPlaying: boolean
  pressedKeys?: Set<string>
}

export default function KeyboardStrip({ activeIndex, isPlaying, pressedKeys = new Set() }: Props) {
  return (
    <div className="w-full px-4">
      {/* Key hints */}
      <div className="flex justify-center gap-1 mb-1 px-3">
        {NOTES.map((note) => (
          <div
            key={note.key}
            style={{
              width: 28,
              textAlign: 'center',
              fontSize: 8,
              color: pressedKeys.has(note.key) ? 'var(--brass-light)' : 'rgba(181,136,42,0.25)',
              fontFamily: 'var(--font-crimson)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'color 0.1s',
            }}
          >
            {note.key}
          </div>
        ))}
      </div>

      <div
        className="relative flex items-end justify-center gap-1 p-3 rounded"
        style={{
          background: 'linear-gradient(180deg, #2a0e04 0%, #1a0802 100%)',
          border: '2px solid var(--brass-dark)',
          boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.6), 0 2px 0 var(--brass)',
        }}
      >
        {/* Brass rail top */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t"
          style={{ background: 'linear-gradient(180deg, var(--brass-light), var(--brass-dark))' }}
        />

        {NOTES.map((note, i) => {
          const isKeyPressed = pressedKeys.has(note.key)
          const isActive = (i === activeIndex && isPlaying) || isKeyPressed
          const isNear = isPlaying && Math.abs(i - activeIndex) <= 1 && !isKeyPressed

          return (
            <div key={note.name} className="flex flex-col items-center gap-0.5">
              <motion.div
                animate={isActive ? {
                  y: [0, 4, 0],
                  transition: { duration: 0.12, repeat: Infinity, repeatDelay: 0.35 }
                } : { y: 0 }}
                style={{
                  width: 28,
                  height: isActive ? 58 : 50,
                  borderRadius: '2px 2px 4px 4px',
                  background: isKeyPressed
                    ? 'linear-gradient(180deg, #fff8e8, #f0d890)'
                    : isActive
                    ? 'linear-gradient(180deg, #faf3e0, #e8d5b0)'
                    : isNear
                    ? 'linear-gradient(180deg, #c8b898, #a89070)'
                    : 'linear-gradient(180deg, #b8a888, #988060)',
                  border: isActive
                    ? '1px solid var(--brass-light)'
                    : '1px solid rgba(181,136,42,0.3)',
                  boxShadow: isKeyPressed
                    ? '0 2px 4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.8), 0 0 16px rgba(212,168,67,0.6)'
                    : isActive
                    ? '0 4px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.6), 0 0 12px rgba(212,168,67,0.4)'
                    : '0 3px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  transition: 'all 0.08s ease',
                  cursor: 'default',
                }}
              />
              <span
                style={{
                  fontSize: 7,
                  color: isActive ? 'var(--brass-light)' : 'rgba(181,136,42,0.4)',
                  fontFamily: 'var(--font-crimson)',
                  letterSpacing: '0.05em',
                  transition: 'color 0.1s',
                  whiteSpace: 'nowrap',
                }}
              >
                {note.name}
              </span>
            </div>
          )
        })}
      </div>

      {isPlaying && (
        <p className="text-center mt-2 text-xs opacity-40" style={{ color: 'var(--parchment)', fontFamily: 'var(--font-crimson)' }}>
          keys A–N to select note · move lid to pump air
        </p>
      )}
    </div>
  )
}
