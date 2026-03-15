'use client'

import { motion } from 'framer-motion'

interface Props {
  angle: number // 0–180
}

export default function LaptopVisualizer({ angle }: Props) {
  // Map 0–180 to lid rotation: 0° = closed, 180° = fully open/back
  // Visually: 10° = barely open, 90° = upright, 135° = comfortable viewing
  const lidRotation = -(angle * 0.85)

  return (
    <div className="flex flex-col items-center justify-center" style={{ height: 180 }}>
      <svg
        width="200"
        height="160"
        viewBox="0 0 200 160"
        style={{ overflow: 'visible' }}
      >
        {/* Base / keyboard unit */}
        <g transform="translate(20, 110)">
          {/* Base body */}
          <rect
            x="0" y="0"
            width="160" height="30"
            rx="4"
            fill="url(#baseGrad)"
            stroke="var(--brass)"
            strokeWidth="1.5"
          />
          {/* Keyboard keys suggestion */}
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x={10 + i * 12}
              y={8}
              width={9}
              height={14}
              rx="1"
              fill="rgba(245, 234, 216, 0.15)"
              stroke="rgba(181, 136, 42, 0.3)"
              strokeWidth="0.5"
            />
          ))}
          {/* Trackpad */}
          <rect x="55" y="5" width="50" height="18" rx="2"
            fill="rgba(245, 234, 216, 0.08)"
            stroke="rgba(181, 136, 42, 0.2)"
            strokeWidth="0.5"
          />
          {/* Hinge detail */}
          <rect x="70" y="-3" width="20" height="5" rx="2"
            fill="var(--brass-dark)"
            stroke="var(--brass)"
            strokeWidth="1"
          />
        </g>

        {/* Lid — pivots from hinge point */}
        <motion.g
          transform="translate(100, 110)"
          animate={{ rotate: lidRotation }}
          transition={{ type: 'spring', stiffness: 60, damping: 20 }}
          style={{ originX: '0px', originY: '0px' }}
        >
          <g transform="translate(-80, -92)">
            {/* Screen body */}
            <rect
              x="0" y="0"
              width="160" height="88"
              rx="4"
              fill="url(#lidGrad)"
              stroke="var(--brass)"
              strokeWidth="1.5"
            />
            {/* Screen bezel */}
            <rect x="6" y="6" width="148" height="70" rx="2"
              fill="rgba(10, 4, 2, 0.85)"
              stroke="rgba(181, 136, 42, 0.2)"
              strokeWidth="0.5"
            />
            {/* Screen glow */}
            <motion.rect
              x="6" y="6" width="148" height="70" rx="2"
              fill="url(#screenGlow)"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Logo placeholder */}
            <circle cx="80" cy="38" r="6"
              fill="rgba(181, 136, 42, 0.15)"
              stroke="rgba(181, 136, 42, 0.4)"
              strokeWidth="1"
            />
            {/* Bottom hinge bar */}
            <rect x="60" y="85" width="40" height="5" rx="2"
              fill="var(--brass-dark)"
              stroke="var(--brass)"
              strokeWidth="1"
            />
          </g>
        </motion.g>

        <defs>
          <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a2510" />
            <stop offset="100%" stopColor="#3a1508" />
          </linearGradient>
          <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a1c0a" />
            <stop offset="100%" stopColor="#2a0e04" />
          </linearGradient>
          <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212, 168, 67, 0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>

      {/* Angle readout */}
      <div className="mt-2 text-center" style={{ fontFamily: 'var(--font-crimson)' }}>
        <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--brass)', opacity: 0.7 }}>
          Lid Angle
        </span>
        <div className="text-2xl font-semibold" style={{ color: 'var(--brass-light)' }}>
          {angle}°
        </div>
      </div>
    </div>
  )
}
