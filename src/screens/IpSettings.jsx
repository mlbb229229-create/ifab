import React, { useState } from 'react'
import { MoreHorizontal, Dices, RotateCcw, Check } from 'lucide-react'
import { StatusBar, NavBar } from '../components/ui.jsx'
import { IMG } from '../assets.jsx'

const STYLES = ['温柔', '科技感', '可爱', '成熟']
const DEFAULT_PARAMS = { 温柔度: 62, 科技感: 42, 活力: 55 }

export default function IpSettings({ go, back }) {
  const [style, setStyle] = useState('温柔')
  const [params, setParams] = useState(DEFAULT_PARAMS)
  const [saved, setSaved] = useState(false)

  const randomize = () => {
    const r = () => 20 + Math.round(Math.random() * 75)
    setParams({ 温柔度: r(), 科技感: r(), 活力: r() })
    setStyle(STYLES[Math.floor(Math.random() * STYLES.length)])
    setSaved(false)
  }
  const reset = () => { setParams(DEFAULT_PARAMS); setStyle('温柔'); setSaved(false) }
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 1600) }

  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col">
      <StatusBar />
      <NavBar
        title="IF"
        onBack={back}
        right={<button className="pressable"><MoreHorizontal size={22} color="#fff" /></button>}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6 flex flex-col items-center gap-4">
        {/* stage */}
        <div className="relative w-[280px] h-[360px] rounded-[18px] overflow-hidden border border-white/30 mt-1">
          <img src={IMG.ipWaist} alt="IF 人格" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
          <div className="absolute left-2.5 top-2.5 w-[40px] h-[40px] rounded-[10px] border-[1.2px] border-white/40 border-b-0 border-r-0" />
          <div className="absolute right-2.5 bottom-2.5 w-[40px] h-[40px] rounded-[10px] border-[1.2px] border-white/40 border-t-0 border-l-0" />
          <div className="absolute left-3.5 bottom-3.5 font-mono text-[10px] font-extrabold tracking-[2px] text-white">SYNC · IF</div>
          <div className="absolute right-3.5 top-3.5 w-2 h-2 rounded-full bg-[#54e92c] shadow-[0_0_8px_#54e92c]" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(10,10,14,0.6))]" />
          {/* style tint overlay */}
          <div className={`absolute inset-0 mix-blend-overlay transition-opacity duration-500 ${style === '科技感' ? 'opacity-40 bg-cyan-400' : style === '可爱' ? 'opacity-30 bg-pink-300' : style === '成熟' ? 'opacity-30 bg-amber-200' : 'opacity-25 bg-rose-300'}`} />
        </div>

        {/* style chips */}
        <div className="w-full max-w-[330px] flex flex-col gap-2.5">
          <span className="text-white text-[12px] font-black">风格</span>
          <div className="flex gap-2">
            {STYLES.map((s) => {
              const on = style === s
              return (
                <button
                  key={s}
                  onClick={() => { setStyle(s); setSaved(false) }}
                  className={`pressable px-2.5 py-1.5 rounded-[14px] border text-[10px] transition-all
                    ${on ? 'bg-[#D43C33] border-white/50 text-white font-black' : 'bg-[#D43C33]/10 border-[#D43C33]/60 text-white/85 font-bold'}`}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>

        {/* sliders */}
        <div className="w-full max-w-[330px] flex flex-col gap-3.5">
          <span className="text-white text-[12px] font-black">参数</span>
          {Object.entries(params).map(([k, v]) => (
            <div key={k} className="flex items-center gap-3">
              <span className="text-white/90 text-[11px] font-extrabold w-12 flex-none">{k}</span>
              <input
                type="range"
                min="0" max="100" value={v}
                onChange={(e) => { setParams((p) => ({ ...p, [k]: +e.target.value })); setSaved(false) }}
                className="if-range flex-1"
                style={{ '--val': `${v}%` }}
              />
              <span className="font-mono text-[10px] text-white/50 w-7 text-right flex-none">{v}</span>
            </div>
          ))}
        </div>

        {/* actions */}
        <div className="w-full max-w-[330px] flex gap-2.5 mt-1">
          <button onClick={randomize} className="pressable flex-1 h-[41px] rounded-[18px] bg-[#D43C33]/15 border border-[#D43C33]/70 text-white text-[12px] font-black flex items-center justify-center gap-1.5">
            <Dices size={14} /> 随机
          </button>
          <button onClick={reset} className="pressable flex-1 h-[41px] rounded-[18px] bg-[#D43C33]/15 border border-[#D43C33]/70 text-white text-[12px] font-black flex items-center justify-center gap-1.5">
            <RotateCcw size={14} /> 重置
          </button>
          <button onClick={save} className={`pressable flex-1 h-[41px] rounded-[18px] border text-[12px] font-black flex items-center justify-center gap-1.5 transition-colors
            ${saved ? 'bg-[#1f7a48] border-[#3fd08a]/50' : 'bg-[#D43C33] border-white/40'} text-white`}>
            {saved ? <><Check size={14} /> 已保存</> : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}
