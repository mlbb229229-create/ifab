import React, { useState } from 'react'
import { Pencil, Type, Check } from 'lucide-react'
import { StatusBar, NavBar, PrimaryButton, SectionLabel } from '../components/ui.jsx'
import { IMG } from '../assets.jsx'

const DEFAULT_TRAITS = ['冷静', '毒舌', '温柔', '理性', '反差萌']

export default function CreatePersona({ go, back, store }) {
  const [name, setName] = useState('')
  const [traits, setTraits] = useState(['温柔'])
  const [custom, setCustom] = useState('')
  const [customTraits, setCustomTraits] = useState([])
  const [editingCustom, setEditingCustom] = useState(false)

  const toggle = (t) =>
    setTraits((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))

  const addCustom = () => {
    const v = custom.trim()
    if (v && !traits.includes(v)) {
      setCustomTraits((p) => [...p, v])
      setTraits((p) => [...p, v])
    }
    setCustom('')
    setEditingCustom(false)
  }

  const next = () => {
    store.set({ personaName: name || 'W', traits })
    go('first-if')
  }

  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col">
      <StatusBar />
      <NavBar title="IF人格形象" onBack={back} />

      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-4">
        <div className="flex flex-col gap-3 pt-2">
          <SectionLabel>为你生成初始第二人格</SectionLabel>

          {/* IP Preview */}
          <div className="rounded-[22px] border border-white/10 bg-[#101216] p-3.5 flex flex-col items-center gap-2.5">
            <div className="relative w-[300px] h-[400px] rounded-[18px] overflow-hidden border border-white/30">
              <img src={IMG.ipWaist} alt="IF 人格" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
              {/* HUD corners */}
              <div className="absolute left-2.5 top-2.5 w-[46px] h-[46px] rounded-[10px] border-[1.2px] border-white/40 border-b-0 border-r-0 rounded-br-none" />
              <div className="absolute right-2.5 bottom-2.5 w-[46px] h-[46px] rounded-[10px] border-[1.2px] border-white/40 border-t-0 border-l-0 rounded-tl-none" />
              <div className="absolute left-4 bottom-4 font-mono text-[10px] font-extrabold tracking-[2px] text-white">
                SYNC · IF
              </div>
              <div className="absolute right-4 top-4 w-2 h-2 rounded-full bg-[#D43C33] shadow-[0_0_8px_#D43C33]" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(10,10,14,0.65))]" />
            </div>
          </div>

          {/* name */}
          <div className="flex flex-col gap-2">
            <SectionLabel>你的互补人格叫</SectionLabel>
            <div className="h-12 rounded-2xl bg-[#323A48] border border-white/35 px-4 flex items-center justify-between focus-within:border-[#FF8A80] transition-colors">
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 10))}
                placeholder="给TA取个名字…"
                className="w-full bg-transparent outline-none text-[#C9D6E8] text-[13px] font-semibold placeholder:text-[#C9D6E8]/50"
              />
              <Pencil size={16} color="#8B96A8" />
            </div>
          </div>

          {/* traits */}
          <div className="flex flex-col gap-2.5">
            <SectionLabel>性格标签（可多选）</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {[...DEFAULT_TRAITS, ...customTraits].map((t) => {
                const on = traits.includes(t)
                return (
                  <button
                    key={t}
                    onClick={() => toggle(t)}
                    className={`pressable flex items-center gap-1 px-3 py-[7px] rounded-full border text-[12px] transition-all
                      ${on
                        ? 'bg-[linear-gradient(135deg,rgba(212,60,51,0.55),rgba(122,20,20,0.55))] border-[#FF8A80]/70 text-white font-black'
                        : 'bg-[linear-gradient(135deg,rgba(47,19,24,0.8),rgba(36,16,21,0.8))] border-white/40 text-white/80 font-semibold'}`}
                  >
                    {on && <Check size={12} strokeWidth={3.2} />}
                    {t}
                  </button>
                )
              })}
              {editingCustom ? (
                <input
                  autoFocus
                  value={custom}
                  onChange={(e) => setCustom(e.target.value.slice(0, 6))}
                  onBlur={addCustom}
                  onKeyDown={(e) => e.key === 'Enter' && addCustom()}
                  placeholder="输入标签"
                  className="w-[110px] px-3 py-[7px] rounded-full border border-[#FF8A80]/70 bg-[#2f1318]/80 text-white text-[12px] outline-none placeholder:text-white/40"
                />
              ) : (
                <button
                  onClick={() => setEditingCustom(true)}
                  className="pressable flex items-center gap-2 px-3 py-2 rounded-full border border-white/40 bg-[linear-gradient(135deg,rgba(47,19,24,0.8),rgba(36,16,21,0.8))] text-white/90 text-[12px] font-semibold"
                >
                  <Type size={14} color="#AEB5C2" />
                  自定义标签（打字）
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 pb-7 pt-2">
        <PrimaryButton className="w-full h-[50px]" onClick={next}>
          完成并进入星球
        </PrimaryButton>
      </div>
    </div>
  )
}
