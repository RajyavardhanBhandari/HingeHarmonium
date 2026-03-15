'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const steps = [
  {
    icon: '🎹',
    title: 'Hold a Key',
    desc: 'Press and hold any key from A to N on your keyboard. Each key opens a different reed — just like pressing a key on a real harmonium.',
    visual: 'keys',
  },
  {
    icon: '💨',
    title: 'Pump the Bellows',
    desc: 'Open and close your MacBook lid to push air through the instrument. No movement = no air = no sound. Keep pumping!',
    visual: 'lid',
  },
  {
    icon: '🎵',
    title: 'Make Music',
    desc: 'Hold multiple keys, change notes mid-breath, pump faster for louder sound. The bellows pressure fades naturally — just like a real harmonium.',
    visual: 'notes',
  },
]

const KEY_ROW = ['a','s','d','f','g','h','j','k','l']
const KEY_ROW2 = ['z','x','c','v','b','n']

export default function HowToPlay({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const current = steps[step]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: 'rgba(10,4,2,0.85)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-md rounded-lg p-6"
          style={{
            background: 'linear-gradient(180deg, #2a0e04 0%, #1a0802 100%)',
            border: '2px solid var(--brass-dark)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(181,136,42,0.3)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Brass corners */}
          {['top-0 left-0','top-0 right-0','bottom-0 left-0','bottom-0 right-0'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-4 h-4`}
              style={{ background: 'radial-gradient(circle at center, var(--brass) 0%, transparent 70%)', opacity: 0.6 }} />
          ))}

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 style={{ fontFamily: 'var(--font-playfair)', color: 'var(--brass-light)', fontSize: 20 }}>
              How to Play
            </h2>
            <button
              onClick={onClose}
              style={{ color: 'var(--brass)', opacity: 0.6, fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
            >✕</button>
          </div>

          {/* Step indicators */}
          <div className="flex gap-2 mb-5 justify-center">
            {steps.map((_, i) => (
              <button key={i} onClick={() => setStep(i)}
                style={{
                  width: i === step ? 24 : 8, height: 8,
                  borderRadius: 4,
                  background: i === step ? 'var(--brass-light)' : 'rgba(181,136,42,0.25)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Visual */}
              <div className="flex justify-center mb-4">
                {current.visual === 'keys' && (
                  <div className="flex flex-col gap-1.5 items-center">
                    <div className="flex gap-1">
                      {KEY_ROW.map((k, i) => (
                        <motion.div key={k}
                          animate={{ y: [0, -3, 0], backgroundColor: ['#b8a888', '#faf3e0', '#b8a888'] }}
                          transition={{ delay: i * 0.08, duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                          style={{
                            width: 28, height: 32, borderRadius: '3px 3px 4px 4px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontFamily: 'var(--font-crimson)',
                            color: 'var(--mahogany)', fontWeight: 600,
                            border: '1px solid rgba(181,136,42,0.4)',
                            boxShadow: '0 3px 0 rgba(0,0,0,0.4)',
                          }}
                        >{k.toUpperCase()}</motion.div>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      {KEY_ROW2.map((k, i) => (
                        <motion.div key={k}
                          animate={{ y: [0, -3, 0], backgroundColor: ['#b8a888', '#faf3e0', '#b8a888'] }}
                          transition={{ delay: 0.7 + i * 0.08, duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                          style={{
                            width: 28, height: 32, borderRadius: '3px 3px 4px 4px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontFamily: 'var(--font-crimson)',
                            color: 'var(--mahogany)', fontWeight: 600,
                            border: '1px solid rgba(181,136,42,0.4)',
                            boxShadow: '0 3px 0 rgba(0,0,0,0.4)',
                          }}
                        >{k.toUpperCase()}</motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {current.visual === 'lid' && (
                  <motion.svg width="120" height="90" viewBox="0 0 120 90">
                    {/* Base */}
                    <rect x="10" y="65" width="100" height="20" rx="3" fill="#3a1508" stroke="var(--brass)" strokeWidth="1" />
                    {/* Lid animating */}
                    <motion.g
                      transform="translate(60,65)"
                      animate={{ rotate: [-40, -5, -40] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ originX: '0px', originY: '0px' }}
                    >
                      <g transform="translate(-50,-55)">
                        <rect x="0" y="0" width="100" height="55" rx="3" fill="#2a0e04" stroke="var(--brass)" strokeWidth="1" />
                        <rect x="4" y="4" width="92" height="44" rx="2" fill="rgba(10,4,2,0.9)" stroke="rgba(181,136,42,0.2)" strokeWidth="0.5" />
                      </g>
                    </motion.g>
                    {/* Arrow hint */}
                    <motion.text x="95" y="45" fontSize="16" fill="var(--brass)"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >↕</motion.text>
                  </motion.svg>
                )}

                {current.visual === 'notes' && (
                  <div className="flex gap-2 items-end">
                    {['C3','E3','G3','A3','C4'].map((note, i) => (
                      <motion.div key={note}
                        animate={{ height: [30, 50 + i * 8, 30], opacity: [0.4, 1, 0.4] }}
                        transition={{ delay: i * 0.2, duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          width: 28, borderRadius: '4px 4px 2px 2px',
                          background: 'linear-gradient(180deg, var(--brass-light), var(--brass-dark))',
                          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                          paddingTop: 4, fontSize: 8,
                          color: 'var(--mahogany)', fontFamily: 'var(--font-crimson)',
                          boxShadow: '0 0 8px rgba(212,168,67,0.4)',
                        }}
                      >{note}</motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="text-center mb-5">
                <div className="text-2xl mb-2">{current.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-playfair)', color: 'var(--brass-light)', fontSize: 16, marginBottom: 8 }}>
                  {current.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-crimson)', color: 'var(--parchment)', opacity: 0.75, fontSize: 14, lineHeight: 1.6 }}>
                  {current.desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              style={{
                fontFamily: 'var(--font-crimson)', color: 'var(--brass)', opacity: step === 0 ? 0.2 : 0.7,
                background: 'none', border: 'none', cursor: step === 0 ? 'default' : 'pointer', fontSize: 13,
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}
            >← Back</button>

            {step < steps.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setStep(s => s + 1)}
                style={{
                  fontFamily: 'var(--font-crimson)',
                  background: 'linear-gradient(180deg, var(--brass), var(--brass-dark))',
                  color: 'var(--mahogany)', border: '1px solid var(--brass-light)',
                  borderRadius: 3, padding: '6px 20px', cursor: 'pointer',
                  fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
                }}
              >Next →</motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={onClose}
                style={{
                  fontFamily: 'var(--font-crimson)',
                  background: 'linear-gradient(180deg, var(--brass), var(--brass-dark))',
                  color: 'var(--mahogany)', border: '1px solid var(--brass-light)',
                  borderRadius: 3, padding: '6px 20px', cursor: 'pointer',
                  fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
                }}
              >Let&apos;s Play 🎹</motion.button>
            )}
          </div>

          {/* Skip */}
          <p className="text-center mt-3" style={{ fontFamily: 'var(--font-crimson)', fontSize: 11, opacity: 0.3, color: 'var(--parchment)' }}>
            Press Esc to skip
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
