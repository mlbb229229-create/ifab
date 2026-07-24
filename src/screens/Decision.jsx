import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Pencil, SendHorizonal } from 'lucide-react'
import { StatusBar, NavBar } from '../components/ui.jsx'
import { IMG, Avatar } from '../assets.jsx'

const PRESET = {
  q: 'offer A 钱少但成长快；offer B 钱多但重复。你选哪个？',
  pick: 'B',
  verdict: '选 B：先拿钱换稳定，再偷时间升级。',
  reason: '理由：风险厌恶更低。',
  chips: ['稳健型', '社交型', '自律型'],
  bullet: '先拿确定性，再偷时间升级。',
}

export default function Decision({ go, back, store }) {
  const [q, setQ] = useState('')
  const [result, setResult] = useState(PRESET)
  const [thinking, setThinking] = useState(false)
  const personaName = store.data.personaName || 'W'

  const ask = () => {
    if (!q.trim()) return
    setThinking(true)
    setTimeout(() => {
      setResult({
        q: q.trim(),
        pick: 'A',
        verdict: '选 A：成长复利 > 短期差价，三年后差距会反转。',
        reason: '理由：你的 IF 目标更偏长期主义。',
        chips: ['成长型', '长期主义', '抗风险'],
        bullet: '把“成长速度”换成可量化指标再比较。',
      })
      setThinking(false)
      setQ('')
    }, 1600)
  }

  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col">
      <StatusBar />
      <NavBar title="决策台" onBack={back} />
      <div className="h-px bg-white/10" />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 flex flex-col gap-4">
        {/* question card */}
        <div className="relative rounded-xl border border-white/25 p-4 pt-6 overflow-hidden
          bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.08)_45%,rgba(201,215,241,0.05))]">
          <div className="absolute left-4 top-3.5 flex items-center gap-2">
            <Sparkles size={15} color="#fff" />
            <span className="font-mono text-[10px] font-bold tracking-[2px] text-white/85">你的提问</span>
          </div>
          <p className="text-white text-[15px] font-bold leading-relaxed pr-12">{result.q}</p>
          <button className="pressable absolute right-4 bottom-4 w-9 h-9 rounded-full bg-[#D43C33] flex items-center justify-center shadow-[0_4px_16px_rgba(212,60,51,0.5)]">
            <Pencil size={15} color="#fff" />
          </button>
        </div>

        {/* persona answer */}
        <motion.div
          key={result.q}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-xl border border-[#2E3440] p-4 overflow-hidden
            bg-[linear-gradient(170deg,#1B171AFC,#16181EFC_56%,#13161CFC)]"
        >
          <div className="pointer-events-none absolute -right-2 -top-4 font-mono text-[72px] font-bold text-[#D43C33]/20 select-none">
            {result.pick}
          </div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Avatar src={IMG.persona} size={27} ring />
            <span className="font-mono text-[10px] font-black tracking-[1.4px] text-[#F5F7FB]">
              第二人格{personaName}
            </span>
          </div>
          {thinking ? (
            <div className="py-4"><div className="typing-dot inline-block w-2 h-2 rounded-full bg-white/70 mr-1" /><div className="typing-dot inline-block w-2 h-2 rounded-full bg-white/70 mr-1" style={{ animationDelay: '.18s' }} /><div className="typing-dot inline-block w-2 h-2 rounded-full bg-white/70" style={{ animationDelay: '.36s' }} /></div>
          ) : (
            <>
              <p className="text-[#F5F7FB] text-[14px] font-bold leading-relaxed">{result.verdict}</p>
              <p className="mt-1.5 text-[#B7C2D3] text-[11px] font-semibold">{result.reason}</p>
              <div className="flex gap-2 mt-3">
                {result.chips.map((c, i) => (
                  <span
                    key={c}
                    className={`px-2 py-1 rounded-full font-mono text-[8px] font-extrabold tracking-wider
                      ${i === 0 ? 'bg-[#D43C33] text-white' : 'bg-[#202734] border border-[#3D4B61] text-[#D5DEEC]'}`}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="flex items-start gap-2 mt-3">
                <span className="w-[5px] h-[5px] rounded-full bg-[#D43C33] mt-1.5 flex-none" />
                <span className="text-white/85 text-[11px] font-semibold">{result.bullet}</span>
              </div>
            </>
          )}
        </motion.div>

        <button
          onClick={back}
          className="pressable h-[46px] rounded-[23px] bg-[#D43C33] border border-white/30 text-white text-[15px] font-extrabold shadow-[0_8px_28px_rgba(212,60,51,0.35)]"
        >
          去聊聊这个
        </button>
      </div>

      {/* ask input */}
      <div className="px-5 pb-7">
        <div className="flex items-center gap-2 rounded-2xl bg-[#242a34] border border-white/30 px-3.5 py-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ask()}
            placeholder="向第二人格提问…"
            className="w-full bg-transparent outline-none text-white text-[13px] placeholder:text-white/40"
          />
          <button
            onClick={ask}
            disabled={!q.trim()}
            className="pressable w-9 h-9 rounded-full bg-[#D43C33] flex items-center justify-center flex-none disabled:opacity-40"
          >
            <SendHorizonal size={15} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  )
}
