'use client'

import { motion } from 'framer-motion'
import { SensorStatus } from '@/hooks/useLidAngle'

interface Props {
  status: SensorStatus
  onRequest: () => void
}

export default function PermissionGate({ status, onRequest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-screen px-6 text-center relative z-10"
    >
      {/* Decorative top border */}
      <div className="mb-8 flex items-center gap-3 w-full max-w-sm">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--brass))' }} />
        <span style={{ color: 'var(--brass)', fontSize: 18 }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, var(--brass), transparent)' }} />
      </div>

      {/* Instrument icon */}
      <motion.div
        animate={{ rotate: [0, 1, -1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-6"
      >
        <svg width="80" height="80" viewBox="0 0 80 80">
          <rect x="8" y="35" width="64" height="30" rx="3"
            fill="none" stroke="var(--brass)" strokeWidth="1.5" />
          {/* Keys */}
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x={12 + i * 7.5} y={40} width={5.5} height={18} rx="1"
              fill="rgba(245, 234, 216, 0.2)" stroke="rgba(181,136,42,0.4)" strokeWidth="0.5" />
          ))}
          {/* Lid */}
          <motion.path
            d="M 8 35 L 8 15 L 72 15 L 72 35"
            fill="none"
            stroke="var(--brass)"
            strokeWidth="1.5"
            animate={{ d: ['M 8 35 L 8 15 L 72 15 L 72 35', 'M 8 35 L 12 8 L 68 8 L 72 35'] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
          <circle cx="40" cy="12" r="3" fill="var(--brass)" opacity="0.6" />
        </svg>
      </motion.div>

      <h1
        className="text-4xl mb-2"
        style={{ fontFamily: 'var(--font-playfair)', color: 'var(--brass-light)' }}
      >
        Hinge Harmonium
      </h1>

      <p className="text-sm mb-1 italic" style={{ color: 'var(--parchment)', opacity: 0.7, fontFamily: 'var(--font-crimson)' }}>
        Your MacBook lid is an instrument
      </p>

      <div className="my-6 flex items-center gap-3 w-full max-w-sm">
        <div className="flex-1 h-px" style={{ background: 'rgba(181,136,42,0.3)' }} />
        <span style={{ color: 'var(--brass)', opacity: 0.5, fontSize: 12 }}>❧</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(181,136,42,0.3)' }} />
      </div>

      <p className="text-base mb-8 max-w-xs leading-relaxed" style={{ color: 'var(--parchment)', fontFamily: 'var(--font-crimson)' }}>
        Open and close your laptop lid to play pentatonic drone notes — the further you open it, the higher the pitch.
      </p>

      {status === 'denied' ? (
        <div className="inset-panel px-6 py-4 max-w-xs">
          <p style={{ color: '#e88', fontFamily: 'var(--font-crimson)', fontSize: 14 }}>
            Sensor access was denied. Please reset permissions in your browser settings and reload.
          </p>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRequest}
          disabled={status === 'requesting'}
          className="px-8 py-3 text-base uppercase tracking-widest relative"
          style={{
            fontFamily: 'var(--font-crimson)',
            background: 'linear-gradient(180deg, var(--brass) 0%, var(--brass-dark) 100%)',
            color: 'var(--mahogany)',
            border: '1px solid var(--brass-light)',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            cursor: status === 'requesting' ? 'wait' : 'pointer',
            letterSpacing: '0.15em',
          }}
        >
          {status === 'requesting' ? 'Tuning...' : 'Open the Bellows'}
        </motion.button>
      )}

      <p className="mt-6 text-xs opacity-40" style={{ color: 'var(--parchment)', fontFamily: 'var(--font-crimson)' }}>
        {status === 'idle' && 'Requires sensor access · Works best on MacBook'}
      </p>

      {/* Decorative bottom */}
      <div className="mt-8 flex items-center gap-3 w-full max-w-sm">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--brass))' }} />
        <span style={{ color: 'var(--brass)', fontSize: 18 }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, var(--brass), transparent)' }} />
      </div>

      <p className="mt-4 text-xs opacity-30" style={{ color: 'var(--brass)', fontFamily: 'var(--font-crimson)', letterSpacing: '0.08em' }}>
        Developed by Rajyavardhan Bhandari
      </p>
      <a
        href="https://rzp.io/rzp/m799Lku6"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 text-xs px-4 py-1.5 opacity-60 hover:opacity-100 transition-opacity"
        style={{
          fontFamily: 'var(--font-crimson)',
          color: 'var(--brass-light)',
          border: '1px solid rgba(181,136,42,0.25)',
          borderRadius: 3,
          textDecoration: 'none',
          letterSpacing: '0.08em',
        }}
      >
        ☕ Buy me a chai · from ₹10
      </a>
    </motion.div>
  )
}