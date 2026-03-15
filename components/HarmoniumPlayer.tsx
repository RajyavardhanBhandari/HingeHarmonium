'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLidAngleContext } from '@/lib/LidAngleContext'
import { useHarmonium } from '@/hooks/useHarmonium'
import LaptopVisualizer from './LaptopVisualizer'
import KeyboardStrip from './KeyboardStrip'
import BellowsIndicator from './BellowsIndicator'
import HowToPlay from './HowToPlay'
import KeyboardVisualizer from './KeyboardVisualizer'

export default function HarmoniumPlayer() {
  const { angle, status } = useLidAngleContext()
  const { isPlaying, currentNote, noteIndex, bellowsPressure, pressedKeys, start, stop, setAngle } = useHarmonium()
  const [showGuide, setShowGuide] = useState(true)

  useEffect(() => {
    setAngle(angle)
  }, [angle, setAngle])

  const isFallback = status === 'fallback'
  const isTilt = status === 'tilt'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-between py-6 px-4 relative z-10"
    >
      {/* How to Play modal */}
      {showGuide && <HowToPlay onClose={() => setShowGuide(false)} />}
      {/* Header */}
      <div className="w-full max-w-lg text-center">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--brass))' }} />
          <h1 className="text-2xl px-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--brass-light)' }}>
            Hinge Harmonium
          </h1>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, var(--brass), transparent)' }} />
          {/* Guide button */}
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowGuide(true)}
            title="How to play"
            style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'rgba(181,136,42,0.15)',
              border: '1px solid rgba(181,136,42,0.35)',
              color: 'var(--brass)', fontSize: 12,
              fontFamily: 'var(--font-crimson)',
              cursor: 'pointer', flexShrink: 0,
            }}
          >?</motion.button>
        </div>
        {(isFallback || isTilt) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs italic py-1 px-3 rounded inline-block"
            style={{
              color: 'var(--brass)',
              background: 'rgba(181,136,42,0.1)',
              border: '1px solid rgba(181,136,42,0.2)',
              fontFamily: 'var(--font-crimson)',
            }}
          >
            isTilt ? 'Tilt mode · Hold a key + tilt your device to pump air' : 'Mouse mode · Hold a key + move cursor up/down to pump air'
          </motion.p>
        )}
      </div>

      {/* Main instrument panel */}
      <div
        className="w-full max-w-lg rounded-lg p-4 relative"
        style={{
          background: 'linear-gradient(180deg, rgba(30,10,2,0.8) 0%, rgba(20,6,1,0.9) 100%)',
          border: '2px solid var(--brass-dark)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(181,136,42,0.3)',
        }}
      >
        {/* Brass corner decorations */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-4 h-4`}
            style={{
              background: 'radial-gradient(circle at center, var(--brass) 0%, transparent 70%)',
              opacity: 0.6,
            }}
          />
        ))}

        <div className="flex items-start justify-between gap-4">
          {/* Left: laptop visualizer */}
          <div className="flex-1">
            <LaptopVisualizer angle={angle} />
          </div>

          {/* Right: bellows + note display */}
          <div className="flex flex-col items-center gap-4 pt-2">
            <BellowsIndicator isPlaying={isPlaying} angle={angle} bellowsPressure={bellowsPressure} />

            {/* Note display */}
            <div className="inset-panel px-4 py-3 text-center" style={{ minWidth: 80 }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--brass)', opacity: 0.6, fontFamily: 'var(--font-crimson)' }}>
                Note
              </div>
              <motion.div
                key={currentNote}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-semibold"
                style={{ fontFamily: 'var(--font-playfair)', color: 'var(--brass-light)' }}
              >
                {currentNote}
              </motion.div>
              {isPlaying && (
                <motion.div
                  className="mt-1 mx-auto rounded-full"
                  style={{
                    width: 6, height: 6,
                    background: bellowsPressure > 0.1 ? 'var(--brass-light)' : 'rgba(181,136,42,0.3)',
                    boxShadow: bellowsPressure > 0.1 ? '0 0 6px var(--brass-light)' : 'none',
                    transition: 'all 0.1s',
                  }}
                  animate={bellowsPressure > 0.1 ? { opacity: [1, 0.4, 1] } : { opacity: 0.3 }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard */}
      <KeyboardStrip activeIndex={noteIndex} isPlaying={isPlaying} pressedKeys={pressedKeys} />

      {/* Play/Stop button */}
      <div className="flex flex-col items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={isPlaying ? stop : start}
          className="px-10 py-3 text-sm uppercase tracking-widest"
          style={{
            fontFamily: 'var(--font-crimson)',
            background: isPlaying
              ? 'linear-gradient(180deg, #5a1a0a, #3a0e04)'
              : 'linear-gradient(180deg, var(--brass), var(--brass-dark))',
            color: isPlaying ? 'var(--brass-light)' : 'var(--mahogany)',
            border: `1px solid ${isPlaying ? 'var(--brass-dark)' : 'var(--brass-light)'}`,
            borderRadius: 3,
            boxShadow: isPlaying
              ? 'inset 0 2px 8px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)'
              : '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            letterSpacing: '0.15em',
            transition: 'all 0.15s ease',
          }}
        >
          {isPlaying ? '◼ Close Bellows' : '▶ Open Bellows'}
        </motion.button>

        <p className="text-xs opacity-30" style={{ color: 'var(--parchment)', fontFamily: 'var(--font-crimson)' }}>
          {isPlaying ? (status === 'active' ? 'Hold A–N · open/close lid to pump air' : status === 'tilt' ? 'Hold A–N · tilt device to pump air' : 'Hold A–N · move mouse up/down to pump air') : 'Press to begin playing'}
        </p>
      </div>

      {/* Keyboard visualizer */}
      <KeyboardVisualizer pressedKeys={pressedKeys} isPlaying={isPlaying} />

      {/* Donate */}
      <div className="flex flex-col items-center gap-2 w-full max-w-lg">
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-px" style={{ background: 'rgba(181,136,42,0.15)' }} />
          <span style={{ color: 'var(--brass)', opacity: 0.4, fontSize: 10 }}>☕</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(181,136,42,0.15)' }} />
        </div>
        <p style={{ fontFamily: 'var(--font-crimson)', color: 'var(--parchment)', opacity: 0.6, fontSize: 13, textAlign: 'center' }}>
          This tool is free. If it made you smile, buy me a chai ☕
        </p>
        <motion.a
          href="https://rzp.io/rzp/B3xdWkCX"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(212,168,67,0.3)' }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-6 py-2.5"
          style={{
            fontFamily: 'var(--font-crimson)',
            background: 'linear-gradient(180deg, rgba(181,136,42,0.25), rgba(181,136,42,0.12))',
            color: 'var(--brass-light)',
            border: '1px solid rgba(181,136,42,0.5)',
            borderRadius: 4,
            letterSpacing: '0.1em',
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          ☕ &nbsp;Buy me a chai &nbsp;·&nbsp; Pay what you feel
        </motion.a>
        <p style={{ fontFamily: 'var(--font-crimson)', color: 'var(--parchment)', opacity: 0.35, fontSize: 11, fontStyle: 'italic' }}>
          Built by one person. Fuelled by chai. Support if you can 🫖
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 w-full max-w-lg">
        <div className="flex-1 h-px" style={{ background: 'rgba(181,136,42,0.2)' }} />
        <span className="text-xs opacity-30" style={{ color: 'var(--brass)', fontFamily: 'var(--font-crimson)' }}>
          ✦ Developed by Rajyavardhan Bhandari ✦
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(181,136,42,0.2)' }} />
      </div>
    </motion.div>
  )
}