import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { StatusBar, NavBar, PrimaryButton } from '../components/ui.jsx'
import { CYCLES } from '../data/ifs.js'

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
        {optional && (
          <span className="absolute -top-2 right-3 text-[10px] font-bold text-[#CF5C5C] bg-[#1a1518] px-1">选填</span>
        )}
      </div>
    </div>
  )
}

export default function IfEdit({ go, back, params, store }) {
  const editing = params?.id ? store.ifs.find((i) => i.id === params.id) : null
  const [ifPart, setIfPart] = useState(editing?.ifText || '')
  const [wantPart, setWantPart] = useState(editing?.want || '')
  const [cycle, setCycle] = useState(editing?.cycle || CYCLES[0])
  const [confirmDel, setConfirmDel] = useState(false)

  const submit = () => {
    if (!ifPart.trim()) return
    const payload = { ifText: ifPart.trim(), want: wantPart.trim(), cycle }
    if (editing) {
      store.ifActions.update(editing.id, payload)
      back()
    } else {
      const today = new Date().toISOString().slice(0, 10)
      store.ifActions.add({ ...payload, createdAt: today })
      back()
    }
  }

  const remove = () => {
    store.ifActions.remove(editing.id)
    // 跳出两层：详情页 + 编辑页
    back()
    setTimeout(back, 60)
  }

  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col overflow-hidden">
      <StatusBar />
      <NavBar
        title={editing ? '编辑 IF' : '新的 IF'}
        onBack={back}
        right={
          editing ? (
            <button onClick={() => setConfirmDel(true)} className="pressable p-1">
              <Trash2 size={17} color="#8B96A8" />
            </button>
          ) : null
        }
      />

      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-25 bg-[radial-gradient(circle,#D43C33,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mx-5 mt-6 rounded-2xl border border-[#FF7F8A]/30 p-5 overflow-hidden
          bg-[linear-gradient(180deg,rgba(37,40,48,0.97),rgba(25,28,34,0.98)_52%,rgba(18,21,25,0.99))]"
      >
        <div className="pointer-events-none absolute -bottom-10 -left-3 w-[344px] h-[122px] rounded-full opacity-25 blur-2xl
          bg-[radial-gradient(circle,#FB5A5535,#D43C3325_45%,transparent)]" />

        <p className="text-[#C9D1DE] text-[12px] font-semibold">
          {editing ? '调整你的目标表述' : '你经常说的那句如果是什么？'}
        </p>

        <div className="mt-4 flex flex-col gap-3.5">
          <InputRow badge="如果" placeholder="请输入你的“如果”..." value={ifPart} onChange={setIfPart} />
          <InputRow badge="我要" placeholder="请输入你的目标..." value={wantPart} onChange={setWantPart} optional />
        </div>

        {/* 目标周期 */}
        <div className="mt-5">
          <div className="text-white/50 text-[10px] font-bold mb-2">目标周期</div>
          <div className="flex gap-2">
            {CYCLES.map((c) => {
              const on = cycle === c
              return (
                <button
                  key={c}
                  onClick={() => setCycle(c)}
                  className={`pressable flex-1 h-8 rounded-full border text-[11px] font-bold transition-all
                    ${on ? 'border-[#c1352d] text-[#ff6b62] bg-[#D43C33]/15' : 'border-white/20 text-white/60'}`}
                >
                  {c}
                </button>
              )
            })}
          </div>
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

      <div className="mt-auto px-5 pb-10">
        <PrimaryButton className="w-full h-[46px]" onClick={submit} disabled={!ifPart.trim()}>
          {editing ? '保存修改' : '就这样'}
        </PrimaryButton>
      </div>

      {/* 删除确认 */}
      <AnimatePresence>
        {confirmDel && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setConfirmDel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="mx-10 w-full rounded-2xl bg-[#22252d] border border-white/15 p-5"
            >
              <div className="text-white text-[14px] font-black">删除这个 IF？</div>
              <p className="text-white/50 text-[11px] mt-1.5 leading-relaxed">
                删除后将无法恢复，相关的进度记录也会被清空。
              </p>
              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={() => setConfirmDel(false)}
                  className="pressable flex-1 h-10 rounded-full bg-white/[0.08] border border-white/15 text-white/80 text-[12px] font-bold"
                >
                  取消
                </button>
                <button
                  onClick={remove}
                  className="pressable flex-1 h-10 rounded-full bg-[#D43C33] text-white text-[12px] font-black"
                >
                  确认删除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
