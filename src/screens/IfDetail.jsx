import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Check, RotateCcw, Users, Zap } from 'lucide-react'
import { StatusBar, NavBar } from '../components/ui.jsx'
import MatchOverlay from '../components/MatchOverlay.jsx'
import { IMG, Avatar } from '../assets.jsx'
import { groupsFor } from '../data/ifs.js'

const AVATAR_POOL = [IMG.luna, IMG.mika, IMG.nono, IMG.chen, IMG.rita, IMG.jay]

/* 同频用户池（头像映射到本地资源） */
const PEER_POOL = [
  { name: 'Luna', av: IMG.luna, fit: 96 },
  { name: 'Mika', av: IMG.mika, fit: 92 },
  { name: 'Nono', av: IMG.nono, fit: 88 },
  { name: 'Chen', av: IMG.chen, fit: 85 },
  { name: 'Rita', av: IMG.rita, fit: 81 },
  { name: 'Jay', av: IMG.jay, fit: 79 },
]

export default function IfDetail({ go, back, params, store }) {
  const item = store.ifs.find((i) => i.id === params?.id)
  const [matching, setMatching] = useState(false)
  const [toast, setToast] = useState('')

  const ping = (m) => { setToast(m); clearTimeout(ping.t); ping.t = setTimeout(() => setToast(''), 1600) }

  const groups = useMemo(() => (item ? groupsFor(item) : []), [item?.ifText, item?.want])

  if (!item) {
    return (
      <div className="absolute inset-0 bg-[#141416] flex flex-col">
        <StatusBar />
        <NavBar title="IF 详情" onBack={back} />
        <div className="flex-1 flex items-center justify-center text-white/40 text-[12px]">该 IF 已被删除</div>
      </div>
    )
  }

  const done = item.status === 'done'
  const setP = (p) => store.ifActions.setProgress(item.id, p)

  const matchDone = (u) => {
    setMatching(false)
    go('user-chat', { name: u.name, av: u.av, fit: u.fit })
  }

  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col overflow-hidden">
      <StatusBar />
      <NavBar
        title="IF 详情"
        onBack={back}
        right={
          <button onClick={() => go('if-edit', { id: item.id })} className="pressable p-1">
            <Pencil size={16} color="#FF8A80" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto no-scrollbar pb-8 px-4">
        {/* 宣言卡 */}
        <div className={`mt-1 rounded-[20px] border p-5 relative overflow-hidden
          ${done
            ? 'bg-[#16181d] border-white/[0.08]'
            : 'bg-[linear-gradient(165deg,rgba(58,10,13,0.7),rgba(30,12,15,0.8)_60%,rgba(20,16,20,0.9))] border-[#D43C33]/35'}`}
        >
          {!done && (
            <div className="pointer-events-none absolute -right-12 -top-14 w-44 h-44 rounded-full blur-3xl opacity-30
              bg-[radial-gradient(circle,#D43C33,transparent_70%)]" />
          )}
          <div className="relative flex items-center gap-2 mb-2.5">
            <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-black
              ${done ? 'bg-[#54e92c]/15 text-[#54e92c] border border-[#54e92c]/40' : 'bg-[#D43C33] text-white'}`}>
              {done ? '已完成' : '进行中'}
            </span>
            <span className="font-mono text-white/40 text-[9px] font-semibold">
              {item.cycle} · 始于 {item.createdAt}
            </span>
          </div>
          <div className={`relative text-[17px] leading-relaxed font-medium ${done ? 'text-white/50' : 'text-white'}`}>
            如果<span className={`font-black ${done ? 'text-white/50' : 'text-[#FF8A80]'}`}>{item.ifText}</span>，
            我就<span className={`font-black ${done ? 'text-white/50' : 'text-[#FF8A80]'}`}>{item.want || '……'}</span>
          </div>
        </div>

        {/* 进度管理 */}
        <div className="mt-3 rounded-[20px] bg-[#1b1e26] border border-white/12 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-[12px] font-black">当前进度</span>
            <span className={`font-mono text-[16px] font-black ${done ? 'text-[#54e92c]' : 'text-[#FF8A80]'}`}>
              {item.progress}%
            </span>
          </div>

          {/* 大进度条 */}
          <div className="h-[8px] rounded-full bg-white/[0.08] overflow-hidden">
            <motion.div
              initial={false}
              animate={{ width: `${item.progress}%` }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className={`h-full rounded-full ${done ? 'bg-[#54e92c]/80' : 'bg-[linear-gradient(90deg,#FF6B62,#D43C33)]'}`}
            />
          </div>

          {/* 滑杆 */}
          <input
            type="range" min="0" max="100" step="5"
            value={item.progress}
            onChange={(e) => setP(Number(e.target.value))}
            className="if-range w-full mt-4"
            style={{ '--val': `${item.progress}%` }}
          />
          <div className="flex justify-between font-mono text-[8px] text-white/30 font-bold mt-1">
            <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
          </div>

          {/* 快捷步进 + 完成切换 */}
          <div className="flex gap-2 mt-3.5">
            {[-10, +10].map((d) => (
              <button
                key={d}
                onClick={() => setP(Math.max(0, Math.min(100, item.progress + d)))}
                className="pressable flex-none h-9 px-3.5 rounded-xl bg-white/[0.07] border border-white/15 text-white/85 text-[12px] font-black font-mono"
              >
                {d > 0 ? '+10' : '-10'}
              </button>
            ))}
            <button
              onClick={() => { store.ifActions.toggleDone(item.id); ping(done ? '已恢复为进行中' : '太棒了，目标达成！') }}
              className={`pressable flex-1 h-9 rounded-xl text-[12px] font-black flex items-center justify-center gap-1.5
                ${done
                  ? 'bg-white/[0.07] border border-white/15 text-white/85'
                  : 'bg-[#54e92c]/15 border border-[#54e92c]/50 text-[#54e92c]'}`}
            >
              {done ? <><RotateCcw size={13} /> 恢复进行中</> : <><Check size={13} /> 标记为已完成</>}
            </button>
          </div>
        </div>

        {/* 推荐群聊 */}
        <div className="mt-3 rounded-[20px] bg-[#1b1e26] border border-white/12 p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Users size={13} color="#FF8A80" />
            <span className="text-white/80 text-[12px] font-black">同频群聊</span>
            <span className="text-white/35 text-[10px] font-semibold">· 基于这条 IF 推荐</span>
          </div>
          <div className="flex flex-col gap-2">
            {groups.map((g, i) => (
              <button
                key={g.name}
                onClick={() => go('group-chat', { title: g.name.split(' · ')[0] })}
                className="pressable w-full rounded-[16px] bg-[#181c23] border border-white/20 px-3.5 py-2.5 flex items-center justify-between text-left"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-white text-[12px] font-black truncate">{g.name}</span>
                  <div className="flex items-center gap-1 font-mono text-[9px]">
                    <span className="text-[#bb332b] font-bold">匹配度 {g.match}%</span>
                    <span className="text-white/70 font-semibold"> · {g.tags}</span>
                  </div>
                  <div className="flex items-center">
                    {[0, 1, 2].map((k) => (
                      <Avatar
                        key={k}
                        src={AVATAR_POOL[(i * 3 + k) % AVATAR_POOL.length]}
                        size={14}
                        className={k > 0 ? '-ml-1.5 border border-[#181c23]' : ''}
                      />
                    ))}
                    <span className="ml-2 font-mono text-[8px] font-bold text-white/60">{g.online}人在线热聊中</span>
                  </div>
                </div>
                <span className="flex-none ml-2 px-3.5 py-2 rounded-lg text-white text-[13px]
                  bg-[linear-gradient(135deg,rgba(255,22,42,0.7),rgba(250,46,107,0.65))] border border-white/25">
                  加入
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 匹配同频的人 */}
        <button
          onClick={() => setMatching(true)}
          className="pressable mt-3 w-full h-12 rounded-[20px] flex items-center justify-center gap-2
            bg-[linear-gradient(95deg,#FF4B4B_0%,#C40000_55%,#7A0000_100%)]
            border-[1.5px] border-[#FF9090]/70 text-white text-[13px] font-black tracking-wide
            shadow-[0_10px_30px_rgba(255,60,60,0.35)]"
        >
          <Zap size={15} /> 为这条 IF 匹配同频的人
        </button>
      </div>

      {/* toast */}
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

      {/* 匹配动画 */}
      <AnimatePresence>
        {matching && (
          <MatchOverlay pool={PEER_POOL} onDone={matchDone} onClose={() => setMatching(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
