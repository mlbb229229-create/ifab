import React from 'react'
import { Signal, Wifi, BatteryFull, Sparkles, LayoutGrid, MessageCircle, User } from 'lucide-react'

/* ---------------- Status Bar ---------------- */
export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-3 h-8 shrink-0 select-none relative z-30">
      <span className="text-[12px] font-semibold text-white tracking-wide">16:36</span>
      <div className="flex items-center gap-2 text-white">
        <Signal size={15} strokeWidth={2.4} />
        <span className="text-[11px] font-bold">5G</span>
        <Wifi size={15} strokeWidth={2.4} />
        <BatteryFull size={17} strokeWidth={2} />
      </div>
    </div>
  )
}

/* ---------------- Bottom Nav ---------------- */
const TABS = [
  { id: 'home', label: '星海', Icon: Sparkles },
  { id: 'square', label: '广场', Icon: LayoutGrid },
  { id: 'messages', label: '消息', Icon: MessageCircle },
  { id: 'me', label: '我的', Icon: User },
]

export function BottomNav({ active = 'home', onTab }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 bg-[#202329]/95 backdrop-blur border-t border-white/10">
      <div className="flex items-center justify-between px-8 py-2.5">
        {TABS.map(({ id, label, Icon }) => {
          const on = active === id
          return (
            <button
              key={id}
              onClick={() => onTab?.(id)}
              className="flex flex-col items-center gap-1 w-14 pressable"
            >
              <Icon size={20} color={on ? '#D43C33' : '#E7EDF7'} strokeWidth={on ? 2.4 : 2} />
              <span
                className={`text-[11px] ${on ? 'text-[#D43C33] font-extrabold' : 'text-[#E7EDF7] font-medium'}`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
      <div className="h-4" />
    </div>
  )
}

/* ---------------- Buttons ---------------- */
export function PrimaryButton({ children, onClick, className = '', disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`pressable flex items-center justify-center rounded-full text-white font-extrabold text-[15px]
        bg-[#D43C33] border border-white/30 shadow-[0_8px_28px_rgba(212,60,51,0.4)]
        disabled:opacity-40 disabled:shadow-none ${className}`}
    >
      {children}
    </button>
  )
}

export function GradientButton({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`pressable flex items-center justify-center rounded-full text-white font-black text-[14px] tracking-[1.5px]
        border-[1.5px] border-[#FF9090]/70
        bg-[linear-gradient(95deg,#FF4B4B_0%,#C40000_55%,#7A0000_100%)]
        shadow-[0_10px_36px_rgba(255,60,60,0.35)] ${className}`}
    >
      {children}
    </button>
  )
}

/* ---------------- Cards ---------------- */
export function GlassCard({ children, className = '', style }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[#242a34] border border-white/30 ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

export function SectionLabel({ children, className = '' }) {
  return (
    <div className={`font-mono text-[10px] font-extrabold tracking-[2px] text-white/85 ${className}`}>
      {children}
    </div>
  )
}

/* ---------------- Checkbox ---------------- */
export function Checkbox({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-4 h-4 rounded-[5px] border flex-none flex items-center justify-center transition-colors
        ${checked ? 'bg-[#D43C33] border-[#D43C33]' : 'bg-white/10 border-white/40'}`}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.6 6.6L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}

/* ---------------- Unread badge ---------------- */
const BADGE = {
  red: 'bg-[linear-gradient(112deg,#7a1022,#9f1239_56%,#5b1b42)]',
  blue: 'bg-[linear-gradient(112deg,#2a4f7d,#2b6390_56%,#2a547e)]',
  green: 'bg-[linear-gradient(112deg,#1b6a3d,#1f7a48_56%,#116450)]',
}
export function Badge({ n, color = 'red' }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-[10px] border border-white/30 font-mono text-[10px] font-black text-white ${BADGE[color]}`}
    >
      {n}
    </span>
  )
}

/* ---------------- Back header ---------------- */
export function NavBar({ title, sub, onBack, right, center = true }) {
  return (
    <div className="relative flex items-center justify-between h-12 px-3 shrink-0 z-20">
      <button onClick={onBack} className="pressable p-1 -ml-1 text-white w-8">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {center && (
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-[16px] font-black text-white">{title}</span>
          {sub && <span className="text-[10px] font-bold text-white/55">{sub}</span>}
        </div>
      )}
      <div className="w-8 flex justify-end">{right}</div>
    </div>
  )
}
