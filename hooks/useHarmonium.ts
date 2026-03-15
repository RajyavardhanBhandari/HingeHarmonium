'use client'

import { useRef, useCallback, useEffect, useState } from 'react'

export const NOTES = [
  { name: 'C2',  freq: 65.41,  key: 'a' },
  { name: 'D2',  freq: 73.42,  key: 's' },
  { name: 'E2',  freq: 82.41,  key: 'd' },
  { name: 'G2',  freq: 98.00,  key: 'f' },
  { name: 'A2',  freq: 110.00, key: 'g' },
  { name: 'C3',  freq: 130.81, key: 'h' },
  { name: 'D3',  freq: 146.83, key: 'j' },
  { name: 'E3',  freq: 164.81, key: 'k' },
  { name: 'G3',  freq: 196.00, key: 'l' },
  { name: 'A3',  freq: 220.00, key: 'z' },
  { name: 'C4',  freq: 261.63, key: 'x' },
  { name: 'D4',  freq: 293.66, key: 'c' },
  { name: 'E4',  freq: 329.63, key: 'v' },
  { name: 'G4',  freq: 392.00, key: 'b' },
  { name: 'A4',  freq: 440.00, key: 'n' },
]

interface HarmoniumState {
  isPlaying: boolean
  currentNote: string
  noteIndex: number
  bellowsPressure: number
  pressedKeys: Set<string>
  start: () => void
  stop: () => void
  setAngle: (angle: number) => void
}

export function useHarmonium(): HarmoniumState {
  const ctxRef = useRef<AudioContext | null>(null)
  const noteNodesRef = useRef<Map<string, { oscs: OscillatorNode[], gainNode: GainNode }>>(new Map())
  const masterGainRef = useRef<GainNode | null>(null)
  const bellowsGainRef = useRef<GainNode | null>(null)
  const prevAngleRef = useRef<number>(90)
  const bellowsPressureRef = useRef<number>(0)
  const animFrameRef = useRef<number>(0)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentNote, setCurrentNote] = useState('E3')
  const [noteIndex, setNoteIndex] = useState(7)
  const [bellowsPressure, setBellowsPressure] = useState(0)
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const pressedKeysRef = useRef<Set<string>>(new Set())

  const keyMap = useRef<Map<string, number>>(new Map(
    NOTES.map((n, i) => [n.key, i])
  ))

  const createReverb = useCallback(async (ctx: AudioContext) => {
    const convolver = ctx.createConvolver()
    const sampleRate = ctx.sampleRate
    const length = sampleRate * 2.5
    const impulse = ctx.createBuffer(2, length, sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch)
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5)
      }
    }
    convolver.buffer = impulse
    return convolver
  }, [])

  const buildNoteOscillators = useCallback((
    ctx: AudioContext,
    freq: number,
    destination: AudioNode
  ): { oscs: OscillatorNode[], gainNode: GainNode } => {
    const gainNode = ctx.createGain()
    gainNode.gain.value = 0
    gainNode.connect(destination)

    const configs = [
      { type: 'sawtooth' as OscillatorType, detune: 0,  gain: 0.50 },
      { type: 'square'   as OscillatorType, detune: -8, gain: 0.20 },
      { type: 'square'   as OscillatorType, detune: +8, gain: 0.20 },
    ]

    const oscs = configs.map(({ type, detune, gain: g }) => {
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()
      osc.type = type
      osc.frequency.value = freq
      osc.detune.value = detune
      oscGain.gain.value = g
      osc.connect(oscGain)
      oscGain.connect(gainNode)
      osc.start()
      return osc
    })

    return { oscs, gainNode }
  }, [])

  const start = useCallback(async () => {
    if (isPlaying) return
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    ctxRef.current = ctx

    const masterGain = ctx.createGain()
    masterGain.gain.value = 1.0
    masterGainRef.current = masterGain

    const bellowsGain = ctx.createGain()
    bellowsGain.gain.value = 0
    bellowsGainRef.current = bellowsGain
    masterGain.connect(bellowsGain)

    const reverb = await createReverb(ctx)
    const dryGain = ctx.createGain()
    dryGain.gain.value = 0.72
    const wetGain = ctx.createGain()
    wetGain.gain.value = 0.28
    bellowsGain.connect(dryGain)
    bellowsGain.connect(reverb)
    reverb.connect(wetGain)
    dryGain.connect(ctx.destination)
    wetGain.connect(ctx.destination)

    for (const note of NOTES) {
      const nodes = buildNoteOscillators(ctx, note.freq, masterGain)
      noteNodesRef.current.set(note.key, nodes)
    }

    const tick = () => {
      bellowsPressureRef.current *= 0.94
      const p = Math.min(bellowsPressureRef.current, 1.0)
      if (bellowsGainRef.current && ctxRef.current) {
        const now = ctxRef.current.currentTime
        bellowsGainRef.current.gain.linearRampToValueAtTime(p, now + 0.04)
      }
      setBellowsPressure(p)
      animFrameRef.current = requestAnimationFrame(tick)
    }
    animFrameRef.current = requestAnimationFrame(tick)

    setIsPlaying(true)
  }, [isPlaying, createReverb, buildNoteOscillators])

  const stop = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current)
    const ctx = ctxRef.current
    const bellowsGain = bellowsGainRef.current
    if (!ctx || !bellowsGain) return

    bellowsGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5)

    setTimeout(() => {
      noteNodesRef.current.forEach(({ oscs }) => {
        oscs.forEach(osc => { try { osc.stop() } catch {} })
      })
      noteNodesRef.current.clear()
      ctx.close()
      ctxRef.current = null
      bellowsPressureRef.current = 0
      setBellowsPressure(0)
      pressedKeysRef.current = new Set()
      setPressedKeys(new Set())
      setIsPlaying(false)
    }, 600)
  }, [])

  // Lid movement = pumping bellows air = volume
  const setAngle = useCallback((angle: number) => {
    const delta = Math.abs(angle - prevAngleRef.current)
    prevAngleRef.current = angle
    const pump = Math.min(delta * 0.06, 0.5)
    if (pump > 0.005) {
      bellowsPressureRef.current = Math.min(bellowsPressureRef.current + pump, 1.0)
    }
  }, [])

  // Keys = select which reed/note sounds
  useEffect(() => {
    if (!isPlaying) return

    const openNote = (key: string) => {
      const idx = keyMap.current.get(key)
      if (idx === undefined) return

      // Mute all other notes
      noteNodesRef.current.forEach((nodes, k) => {
        if (k !== key) {
          const now = ctxRef.current?.currentTime ?? 0
          nodes.gainNode.gain.linearRampToValueAtTime(0, now + 0.06)
        }
      })

      // Open this reed
      const nodes = noteNodesRef.current.get(key)
      if (nodes && ctxRef.current) {
        const now = ctxRef.current.currentTime
        nodes.gainNode.gain.linearRampToValueAtTime(1.0, now + 0.04)
      }

      setCurrentNote(NOTES[idx].name)
      setNoteIndex(idx)
    }

    const closeNote = (key: string) => {
      const nodes = noteNodesRef.current.get(key)
      if (nodes && ctxRef.current) {
        const now = ctxRef.current.currentTime
        nodes.gainNode.gain.linearRampToValueAtTime(0, now + 0.08)
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const key = e.key.toLowerCase()
      if (!keyMap.current.has(key)) return

      pressedKeysRef.current = new Set([...pressedKeysRef.current, key])
      setPressedKeys(new Set(pressedKeysRef.current))
      openNote(key)
      // Pressing a key adds a little air burst
      bellowsPressureRef.current = Math.min(bellowsPressureRef.current + 0.12, 1.0)
    }

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (!keyMap.current.has(key)) return

      pressedKeysRef.current = new Set([...pressedKeysRef.current].filter(k => k !== key))
      setPressedKeys(new Set(pressedKeysRef.current))
      closeNote(key)

      // Fall back to last remaining held key if any
      const remaining = [...pressedKeysRef.current]
      if (remaining.length > 0) {
        openNote(remaining[remaining.length - 1])
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [isPlaying])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      noteNodesRef.current.forEach(({ oscs }) => {
        oscs.forEach(osc => { try { osc.stop() } catch {} })
      })
      ctxRef.current?.close()
    }
  }, [])

  return { isPlaying, currentNote, noteIndex, bellowsPressure, pressedKeys, start, stop, setAngle }
}
