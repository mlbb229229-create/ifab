import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronDown, Check, Sparkles, Users } from 'lucide-react'
import { StatusBar, NavBar } from '../components/ui.jsx'
import { groupsFor } from '../data/ifs.js'

/* 单条 IF 卡片 */
function IfCard({ item, go, store, ping }) {
  const groups = useMemo(() => groupsFor(item), [item.ifText, item.want])
  const done = item.status === 'done'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`rounded-[18px] border p-4 relative overflow-hidden
        ${done ? 'bg-[#16181d] border-white/[0.08]' : 'bg-[#1b1e26] border-white/12'}`}
    >
      {!done && (
        <div className="pointer-events-none absolute -right-10 -top-12 w-32 h-32 rounded-full blur-3xl opacity-25
          bg-[radial-gradient(circle,#D43C33,transparent_70%)]" />
      )}

      {/* 宣言 + 完成勾选 */}
      <div className="relative flex items-start gap-3">
        <button
          onClick={() => { store.ifActions.toggleDone(item.id); ping(done ? '已恢复为进行中' : '太棒了，已标记完成！') }}
          className={`pressable mt-0.5 w-[22px] h-[22px] rounded-full flex-none flex items-center justify-center border-2 transition-colors
            ${done ? 'bg-[#54e92c] border-[#54e92c]' : 'border-[#FF8A80]/60 bg-transparent'}`}
        >
          {done && <Check size={13} color="#0d1a0d" strokeWidth={3.4} />}
        </button>
        <button onClick={() => go('if-detail', { id: item.id })} className="pressable flex-1 min-w-0 text-left">
          <div className={`text-[13px] leading-relaxed ${done ? 'text-white/40 line-through decoration-white/30' : 'text-white/90'}`}>
            如果<span className={`font-bold ${done ? 'text-white/40' : 'text-[#FF8A80]'}`}>{item.ifText}</span>，
            我就<span className={`font-bold ${done ? 'text-white/40' : 'text-[#FF8A80]'}`}>{item.want || '……'}</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 font-mono text-[9px] text-white/40 font-semibold">
            <span>目标周期 {item.cycle}</span>
            <span>·</span>
            <span>始于 {item.createdAt}</span>
            {done && item.finishedAt && <><span>·</span><span className="text-[#54e92c]/80">完成于 {item.finishedAt}</span></>}
          </div>
        </button>
      </div>

      {/* 进度条 */}
      <div className="relative mt-3 flex items-center gap-2.5">
        <div className="flex-1 h-[5px] rounded-full bg-white/[0.08] overflow-hidden">
          <motion.div
            initial={false}
            animate={{ width: `${item.progress}%` }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className={`h-full rounded-full ${done ? 'bg-[#54e92c]/70' : 'bg-[linear-gradient(90deg,#FF6B62,#D43C33)]'}`}
          />
        </div>
        <span className={`font-mono text-[10px] font-black flex-none ${done ? 'text-[#54e92c]/80' : 'text-[#FF8A80]'}`}>
          {item.progress}%
        </span>
      </div>

      {/* 推荐群聊 */}
      <div className="relative mt-3 pt-3 border-t border-white/[0.07]">
        <div className="flex items-center gap-1 mb-2">
          <Users size={11} color="#8B96A8" />
          <span className="text-white/45 text-[10px] font-bold">同频群聊推荐</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {groups.map((g) => (
            <button
              key={g.name}
              onClick={() => go('group-chat', { title: g.name.split(' · ')[0] })}
              className="pressable flex-none px-2.5 py-1.5 rounded-full bg-[#D43C33]/10 border border-[#c1352d]/40 text-[#ff8a80] text-[10px] font-semibold whitespace-nowrap"
            >
              {g.name.split(' · ')[0]}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function IfList({ go, back, store }) {
  const [toast, setToast] = useState('')
  const [showDone, setShowDone] = useState(false)

  const ping = (m) => { setToast(m); clearTimeout(ping.t); ping.t = setTimeout(() => setToast(''), 1600) }

  const active = store.ifs.filter((i) => i.status !== 'done')
  const finished = store.ifs.filter((i) => i.status === 'done')
  const avg = active.length ? Math.round(active.reduce((s, i) => s + i.progress, 0) / active.length) : 0

  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col overflow-hidden">
      <StatusBar />
      <NavBar
        title="我的 IF"
        onBack={back}
        right={
          <button onClick={() => go('if-edit')} className="pressable p-1">
            <Plus size={20} color="#FF8A80" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto no-scrollbar pb-8 px-4">
        {/* 统计头 */}
        <div className="mt-1 rounded-[18px] border border-white/10 p-4 relative overflow-hidden
          bg-[linear-gradient(160deg,#262a33,#1b1e26_60%,#171a21)]">
          <div className="pointer-events-none absolute -left-10 -top-12 w-36 h-36 rounded-full blur-3xl opacity-25
            bg-[radial-gradient(circle,#D43C33,transparent_70%)]" />
          <div className="relative flex">
            {[
              { label: '进行中', value: active.length, color: 'text-white' },
              { label: '已完成', value: finished.length, color: 'text-[#54e92c]' },
              { label: '平均进度', value: `${avg}%`, color: 'text-[#FF8A80]' },
            ].map((s, i) => (
              <div key={s.label} className={`flex-1 flex flex-col items-center gap-0.5 ${i > 0 ? 'border-l border-white/10' : ''}`}>
                <span className={`text-[18px] font-black font-mono ${s.color}`}>{s.value}</span>
                <span className="text-white/40 text-[10px]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 新建按钮 */}
        <button
          onClick={() => go('if-edit')}
          className="pressable mt-3 w-full h-12 rounded-[18px] border border-dashed border-[#FF7F8A]/40 bg-[#D43C33]/[0.06]
            flex items-center justify-center gap-2 text-[#FF8A80] text-[13px] font-black"
        >
          <Plus size={16} /> 写下一个新的 IF
        </button>

        {/* 进行中列表 */}
        <div className="flex items-center gap-1.5 mt-5 mb-2.5">
          <Sparkles size={12} color="#FF8A80" />
          <span className="text-white/80 text-[11px] font-bold tracking-wide">进行中 · {active.length}</span>
        </div>
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {active.map((item) => (
              <IfCard key={item.id} item={item} go={go} store={store} ping={ping} />
            ))}
          </AnimatePresence>
          {!active.length && (
            <div className="py-8 text-center text-white/30 text-[11px] font-semibold">
              还没有进行中的 IF，写下第一个目标吧
            </div>
          )}
        </div>

        {/* 已完成折叠区 */}
        {finished.length > 0 && (
          <>
            <button
              onClick={() => setShowDone(!showDone)}
              className="pressable flex items-center gap-1.5 mt-6 mb-2.5"
            >
              <Check size={12} color="#54e92c" />
              <span className="text-white/80 text-[11px] font-bold tracking-wide">已完成 · {finished.length}</span>
              <motion.span animate={{ rotate: showDone ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={13} color="#8B96A8" />
              </motion.span>
            </button>
            <AnimatePresence>
              {showDone && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-3 overflow-hidden"
                >
                  {finished.map((item) => (
                    <IfCard key={item.id} item={item} go={go} store={store} ping={ping} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-10 z-50 px-4 py-2 rounded-full bg-[#2a2e38]/95 border border-white/20 text-white text-[11px] font-semibold shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
