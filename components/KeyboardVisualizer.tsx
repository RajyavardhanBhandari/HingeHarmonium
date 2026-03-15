'use client'

import { motion } from 'framer-motion'
import { NOTES } from '@/hooks/useHarmonium'

// Map note keys to QWERTY rows for visual layout
const ROW1 = ['a','s','d','f','g','h','j','k','l']
const ROW2 = ['z','x','c','v','b','n']
const ALL_KEYS = new Set(NOTES.map(n => n.key))

interface Props {
  pressedKeys: Set<string>
  isPlaying: boolean
}

export default function KeyboardVisualizer({ pressedKeys, isPlaying }: Props) {
  if (!isPlaying) return null

  const renderKey = (k: string) => {
    const isNote = ALL_KEYS.has(k)
    const isPressed = pressedKeys.has(k)
    const note = NOTES.find(n => n.key === k)

    return (
      <motion.div
        key={k}
        animate={isPressed ? { y: 2, scale: 0.95 } : { y: 0, scale: 1 }}
        transition={{ duration: 0.06 }}
        style={{
          width: 32,
          height: 32,
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          fontFamily: 'var(--font-crimson)',
          fontWeight: 600,
          cursor: 'default',
          position: 'relative',
          background: isPressed
            ? 'linear-gradient(180deg, var(--brass-light), var(--brass))'
            : isNote
            ? 'rgba(181,136,42,0.12)'
            : 'rgba(255,255,255,0.04)',
          border: isPressed
            ? '1px solid var(--brass-light)'
            : isNote
            ? '1px solid rgba(181,136,42,0.3)'
            : '1px solid rgba(255,255,255,0.06)',
          color: isPressed
            ? 'var(--mahogany)'
            : isNote
            ? 'var(--brass-light)'
            : 'rgba(255,255,255,0.2)',
          boxShadow: isPressed
            ? '0 0 12px rgba(212,168,67,0.6), inset 0 1px 0 rgba(255,255,255,0.3)'
            : isNote
            ? '0 2px 0 rgba(0,0,0,0.4)'
            : '0 2px 0 rgba(0,0,0,0.3)',
          transition: 'background 0.06s, border 0.06s, color 0.06s, box-shadow 0.06s',
        }}
      >
        <span>{k.toUpperCase()}</span>
        {isNote && (
          <span style={{ fontSize: 6, opacity: isPressed ? 0.8 : 0.5, letterSpacing: 0 }}>
            {note?.name}
          </span>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="w-full max-w-lg"
    >
      {/* Label */}
      <p className="text-center mb-2" style={{
        fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em',
        color: 'var(--brass)', opacity: 0.5, fontFamily: 'var(--font-crimson)',
      }}>
        Keyboard · highlighted keys play notes
      </p>

      <div
        className="rounded p-3 flex flex-col items-center gap-1.5"
        style={{
          background: 'rgba(10,4,2,0.6)',
          border: '1px solid rgba(181,136,42,0.15)',
        }}
      >
        {/* Row 1: A–L */}
        <div className="flex gap-1">
          {ROW1.map(renderKey)}
        </div>

        {/* Row 2: Z–N */}
        <div className="flex gap-1" style={{ marginLeft: 20 }}>
          {ROW2.map(renderKey)}
        </div>
      </div>
    </motion.div>
  )
}
