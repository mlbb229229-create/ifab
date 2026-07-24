import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { StatusBar, PrimaryButton } from '../components/ui.jsx'

const GENDERS = ['女', '男', '保密']
const ITEM_H = 36

function Wheel({ values, value, onChange, suffix = '' }) {
  const ref = useRef(null)
  const timer = useRef(null)

  useEffect(() => {
    const idx = values.indexOf(value)
    if (ref.current && idx >= 0) ref.current.scrollTop = idx * ITEM_H
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleScroll = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      if (!ref.current) return
      const idx = Math.max(0, Math.min(values.length - 1, Math.round(ref.current.scrollTop / ITEM_H)))
      ref.current.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' })
      if (values[idx] !== value) onChange(values[idx])
    }, 90)
  }

  return (
    <div className="relative h-[180px] flex-1">
      <div ref={ref} onScroll={handleScroll}
        className="h-full overflow-y-auto no-scrollbar snap-y snap-mandatory relative z-10"
        style={{ paddingTop: ITEM_H * 2, paddingBottom: ITEM_H * 2 }}>
        {values.map((v) => (
          <div key={v}
            className={`flex items-center justify-center snap-center font-mono transition-colors
              ${v === value ? 'text-white text-[16px] font-bold' : 'text-white/30 text-[14px]'}`}
            style={{ height: ITEM_H }}>
            {v}{suffix}
          </div>
        ))}
      </div>
      {/* center highlight */}
      <div className="pointer-events-none absolute inset-x-1 top-1/2 -translate-y-1/2 rounded-lg bg-white/[0.08] border border-white/15"
        style={{ height: ITEM_H }} />
      {/* fade edges */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-[linear-gradient(180deg,#23262e,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(0deg,#23262e,transparent)]" />
    </div>
  )
}

function DatePickerSheet({ initial, onConfirm, onClose }) {
  const [y, m, d] = initial.split('-').map(Number)
  const [year, setYear] = useState(y)
  const [month, setMonth] = useState(m)
  const [day, setDay] = useState(d)

  const years = Array.from({ length: 61 }, (_, i) => 1955 + i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const maxDay = new Date(year, month, 0).getDate()
  const days = Array.from({ length: maxDay }, (_, i) => i + 1)
  const safeDay = Math.min(day, maxDay)

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 z-40 bg-black/55" onClick={onClose} />
      <motion.div
        initial={{ y: 320 }} animate={{ y: 0 }} exit={{ y: 320 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 z-50 rounded-t-[24px] bg-[#23262e] border-t border-white/15 px-5 pt-4 pb-8"
      >
        <div className="flex items-center justify-between mb-3">
          <button onClick={onClose} className="pressable text-white/50 text-[13px]">取消</button>
          <span className="text-white text-[14px] font-black">选择出生日期</span>
          <button
            onClick={() => onConfirm(`${year}-${String(month).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`)}
            className="pressable text-[#FF8A80] text-[13px] font-bold">
            确定
          </button>
        </div>
        <div className="flex gap-2">
          <Wheel values={years} value={year} onChange={setYear} suffix="年" />
          <Wheel values={months} value={month} onChange={setMonth} suffix="月" />
          <Wheel values={days} value={safeDay} onChange={setDay} suffix="日" />
        </div>
      </motion.div>
    </>
  )
}

export default function ProfileSetup({ go, store }) {
  const [nick, setNick] = useState('')
  const [gender, setGender] = useState('女')
  const [date, setDate] = useState('1998-04-12')
  const [showPicker, setShowPicker] = useState(false)

  const next = () => {
    store.set({ nickname: nick || '小星', gender, birthday: date })
    go('create-persona')
  }

  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col">
      <StatusBar />
      <div className="px-5 pt-5 flex flex-col gap-5 flex-1 overflow-y-auto no-scrollbar">
        {/* progress */}
        <div className="flex items-center gap-2">
          <div className="w-40 h-[3px] rounded bg-[#D43C33]" />
          <div className="w-20 h-[3px] rounded bg-[#242a34]" />
          <div className="w-20 h-[3px] rounded bg-[#242a34]" />
        </div>

        <div>
          <h1 className="font-mono text-[22px] font-extrabold text-white tracking-wide">欢迎进入IF星球</h1>
          <p className="mt-1.5 text-white/55 text-[13px]">收集信息，为你打造专属IF星球</p>
        </div>

        {/* nickname */}
        <div className="flex flex-col gap-2.5">
          <label className="font-mono text-[10px] font-bold tracking-[2px] text-white/70">昵称</label>
          <div className="h-12 rounded-[14px] bg-[#2a2929] border border-white/40 px-3.5 flex items-center focus-within:border-[#FF8A80] transition-colors">
            <input
              value={nick}
              onChange={(e) => setNick(e.target.value.slice(0, 12))}
              placeholder="例如：小星"
              className="w-full bg-transparent outline-none text-white text-[14px] font-medium placeholder:text-white/30"
            />
          </div>
        </div>

        {/* gender segmented */}
        <div className="flex flex-col gap-2.5">
          <label className="font-mono text-[10px] font-bold tracking-[2px] text-white/70">性别</label>
          <div className="flex gap-2">
            {GENDERS.map((g) => {
              const on = gender === g
              return (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`pressable flex-1 h-11 rounded-xl border text-[14px] transition-all
                    ${on
                      ? 'bg-[#D43C33] border-[#F0B0A8] text-white font-extrabold shadow-[0_6px_20px_rgba(212,60,51,0.35)]'
                      : 'bg-[#2a2929] border-white/40 text-white/75 font-normal'}`}
                >
                  {g}
                </button>
              )
            })}
          </div>
        </div>

        {/* birthday */}
        <div className="flex flex-col gap-2.5">
          <label className="font-mono text-[10px] font-bold tracking-[2px] text-white/70">出生日期</label>
          <button
            onClick={() => setShowPicker(true)}
            className="pressable h-12 rounded-[14px] bg-[#2a2929] border border-white/40 px-3.5 flex items-center justify-between"
          >
            <span className="font-mono text-white text-[14px]">{date}</span>
            <Calendar size={18} color="#AEB5C2" />
          </button>
        </div>
      </div>

      <div className="p-5 pb-8">
        <PrimaryButton className="w-full h-[50px] rounded-[10px]" onClick={next}>
          下一步：关键记忆
        </PrimaryButton>
      </div>

      <AnimatePresence>
        {showPicker && (
          <DatePickerSheet
            initial={date}
            onClose={() => setShowPicker(false)}
            onConfirm={(d) => { setDate(d); setShowPicker(false) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
