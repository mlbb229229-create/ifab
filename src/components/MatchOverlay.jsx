import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, MessageCircle, X } from 'lucide-react'
import { Avatar } from '../assets.jsx'

const SEARCH_LINES = ['正在解析你的 IF 设定…', '检索同频信号…', '计算性格默契度…']
const BURST_COLORS = ['#ff6b62', '#e8bf3a', '#ffffff', '#ff9d9d', '#4fd8e0']

/* 粒子爆发 */
function Burst() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const angle = (i / 28) * Math.PI * 2 + Math.random() * 0.4
        const dist = 90 + Math.random() * 130
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          size: 3 + Math.random() * 5,
          color: BURST_COLORS[i % BURST_COLORS.length],
          delay: Math.random() * 0.15,
        }
      }),
    []
  )
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
          transition={{ duration: 1.1, delay: p.delay, ease: 'easeOut' }}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, background: p.color, boxShadow: `0 0 8px ${p.color}` }}
        />
      ))}
    </div>
  )
}

/* 雷达扫描环 */
function Radar() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.45, opacity: 0.7 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.65, ease: 'easeOut' }}
          className="absolute w-[220px] h-[220px] rounded-full border border-[#ff6b62]/40"
        />
      ))}
      {/* scanning wedge */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[220px] h-[220px] rounded-full"
        style={{ background: 'conic-gradient(from 0deg, rgba(255,107,98,0.35), transparent 70deg, transparent 360deg)' }}
      />
    </div>
  )
}

export default function MatchOverlay({ pool, onDone, onClose }) {
  const [phase, setPhase] = useState('search')
  const [cycle, setCycle] = useState(0)
  const [line, setLine] = useState(0)
  const target = useMemo(() => pool[Math.floor(Math.random() * pool.length)], [pool])

  useEffect(() => {
    const cycler = setInterval(() => setCycle((c) => c + 1), 130)
    const liner = setInterval(() => setLine((l) => (l + 1) % SEARCH_LINES.length), 800)
    const done = setTimeout(() => {
      clearInterval(cycler)
      clearInterval(liner)
      setPhase('found')
    }, 2600)
    return () => { clearInterval(cycler); clearInterval(liner); clearTimeout(done) }
  }, [])

  const shown = phase === 'search' ? pool[cycle % pool.length] : target

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-[999] bg-[#0a0b10]/95 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden"
    >
      <button onClick={onClose} className="pressable absolute right-4 top-10 p-2 text-white/40 z-10">
        <X size={20} />
      </button>

      <AnimatePresence mode="wait">
        {phase === 'search' ? (
          <motion.div key="search" exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center">
            <div className="relative w-[220px] h-[220px] flex items-center justify-center">
              <Radar />
              {/* cycling candidate avatar */}
              <motion.div
                key={cycle}
                initial={{ scale: 0.85, opacity: 0.4 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.12 }}
              >
                <Avatar src={shown.av} size={76} ring />
              </motion.div>
            </div>
            <div className="mt-8 h-5">
              <AnimatePresence mode="wait">
                <motion.p
                  key={line}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="font-mono text-[12px] font-bold text-white/80 tracking-widest"
                >
                  {SEARCH_LINES[line]}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="mt-2 text-white/35 text-[10px] font-mono">SCANNING · {(cycle * 7) % 97 + 3}%</p>
          </motion.div>
        ) : (
          <motion.div key="found" className="flex flex-col items-center relative">
            <Burst />
            {/* glow ring behind avatar */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1.35, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute w-[120px] h-[120px] rounded-full blur-2xl -z-10"
              style={{ background: 'radial-gradient(circle, rgba(255,107,98,0.55), rgba(212,60,51,0.2) 60%, transparent)' }}
            />
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            >
              <Avatar src={target.av} size={96} ring />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="mt-5 flex items-center gap-1.5"
            >
              <Sparkles size={15} color="#e8bf3a" />
              <span className="text-[#e8bf3a] font-black text-[15px] tracking-[3px]">精准匹配成功</span>
              <Sparkles size={15} color="#e8bf3a" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="mt-2 text-white text-[20px] font-black"
            >
              {target.name}
            </motion.div>

            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.55, type: 'spring', damping: 10, stiffness: 220 }}
              className="mt-3 px-4 py-1.5 rounded-full bg-[#D43C33]/20 border border-[#ff6b62]/50"
            >
              <span className="font-mono text-[#ff8a80] text-[12px] font-black">默契度 {target.fit}%</span>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
              onClick={() => onDone(target)}
              className="pressable mt-8 flex items-center gap-2 px-6 py-3 rounded-full bg-[#D43C33] text-white text-[14px] font-black
                shadow-[0_8px_30px_rgba(212,60,51,0.5)]"
            >
              <MessageCircle size={16} /> 打个招呼
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              onClick={onClose}
              className="pressable mt-3 text-white/40 text-[11px]"
            >
              稍后再聊
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
