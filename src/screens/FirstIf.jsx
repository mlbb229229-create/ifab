import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { StatusBar, PrimaryButton } from '../components/ui.jsx'

function InputRow({ badge, placeholder, value, onChange, optional }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-10 h-10 rounded-full flex-none flex items-center justify-center
        bg-[#721d1d] border border-[#ff0000]/35 shadow-[0_0_18px_rgba(255,60,60,0.35)]">
        <span className="text-white text-[12px] font-black">{badge}</span>
      </div>
      <div className="relative flex-1 h-10 rounded-xl bg-[#0B0E14]/95 border border-white/20 px-3.5 flex items-center focus-within:border-[#FF8A80]/70 transition-colors">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, 24))}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-white text-[12px] font-medium placeholder:text-[#8B929E]"
        />
        {!value && <span className="anim-caret absolute right-3 w-[2px] h-4 bg-[#D43C33] rounded" />}
        {optional && (
          <span className="absolute -top-2 right-3 text-[10px] font-bold text-[#CF5C5C] bg-[#1a1518] px-1">选填</span>
        )}
      </div>
    </div>
  )
}

export default function FirstIf({ go, replace, store }) {
  const [ifPart, setIfPart] = useState('')
  const [wantPart, setWantPart] = useState('')

  const submit = () => {
    if (ifPart.trim()) {
      const item = { ifText: ifPart.trim(), want: wantPart.trim() }
      store.set({ firstIf: item, isNewUser: false })
      store.ifActions.add({
        ...item,
        cycle: '30 天',
        createdAt: new Date().toISOString().slice(0, 10),
      })
    }
    replace('home')
  }

  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col overflow-hidden">
      <StatusBar />

      {/* background glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-25 bg-[radial-gradient(circle,#D43C33,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-6 mt-24 rounded-2xl border border-[#FF7F8A]/30 p-5 overflow-hidden
          bg-[linear-gradient(180deg,rgba(37,40,48,0.97),rgba(25,28,34,0.98)_52%,rgba(18,21,25,0.99))]"
      >
        <div className="pointer-events-none absolute -bottom-10 -left-3 w-[344px] h-[122px] rounded-full opacity-25 blur-2xl
          bg-[radial-gradient(circle,#FB5A5535,#D43C3325_45%,transparent)]" />

        <h2 className="text-white text-[19px] font-black">写下一个IF想法</h2>
        <p className="mt-1 text-[#C9D1DE] text-[12px] font-semibold">你经常说的那句如果是什么？</p>

        <div className="mt-5 flex flex-col gap-3.5">
          <InputRow badge="如果" placeholder="请输入你的“如果”..." value={ifPart} onChange={setIfPart} />
          <InputRow badge="我要" placeholder="请输入你的目标..." value={wantPart} onChange={setWantPart} optional />
        </div>

        {/* live preview */}
        {(ifPart || wantPart) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-3 border-t border-white/10"
          >
            <div className="text-[12px] leading-relaxed text-white/80">
              如果<span className="text-[#FF8A80] font-bold">{ifPart || '……'}</span>，
              我就<span className="text-[#FF8A80] font-bold">{wantPart || '……'}</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="mt-auto px-5 pb-10 flex flex-col gap-3">
        <PrimaryButton className="w-full h-[46px]" onClick={submit} disabled={!ifPart.trim()}>
          就这样
        </PrimaryButton>
        <button onClick={() => replace('home')} className="pressable text-white/40 text-[11px]">
          先逛逛，稍后再写
        </button>
      </div>
    </div>
  )
}
