import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Sparkles, Music, MessageCircle, Heart, PenLine, Feather, CalendarCheck } from 'lucide-react'
import { StatusBar, NavBar, SectionLabel } from '../components/ui.jsx'
import { IMG, Avatar } from '../assets.jsx'

const ACHIEVEMENTS = [
  { icon: Sparkles, title: '心动初见', desc: '第一次互相说早安', tag: '限定', progress: 1, total: 1, done: true },
  { icon: Music, title: '一起听歌', desc: '分享 3 首歌给对方', tag: '进行中', progress: 2, total: 3 },
]

const TASKS = [
  { icon: MessageCircle, title: '发起一次对话', desc: '一句‘在吗’也算。', pts: 10, done: false },
  { icon: Heart, title: '分享今日心情', desc: '选一个表情 + 一句话', pts: 20, done: false },
  { icon: PenLine, title: '完成二次共创', desc: '一起写一段设定 / 计划 / 备忘', pts: 30, done: false },
  { icon: Feather, title: '完成一次共创', desc: '一起写一段设定 / 计划 / 备忘', pts: 30, done: false },
  { icon: CalendarCheck, title: '今日任务已完成', desc: '保持节奏，明天继续。', pts: 30, done: true },
]

export default function Intimacy({ go, back, store }) {
  const personaName = store.data.personaName || 'W'
  const [tasks, setTasks] = useState(TASKS)
  const [points, setPoints] = useState(2380)
  const goal = 5000
  const pct = Math.min(100, Math.round((points / goal) * 100))

  const doTask = (i) => {
    setTasks((ts) => ts.map((t, k) => (k === i ? { ...t, done: true } : t)))
    setPoints((p) => p + tasks[i].pts)
    setTimeout(() => back(), 500)
  }

  return (
    <div className="absolute inset-0 bg-black flex flex-col">
      <StatusBar />
      <NavBar title="亲密度" onBack={back} />

      <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-2 flex flex-col gap-3 pb-8">
        {/* relation card */}
        <div className="rounded-[22px] border border-[#FF3B5C]/25 p-4 flex items-center justify-between
          bg-[linear-gradient(170deg,#25272C,#1D1F24_58%,#17191D)]">
          <div className="flex flex-col items-center gap-2 w-[110px]">
            <Avatar src={IMG.me} size={64} ring />
            <span className="text-white text-[13px] font-extrabold">{store.data.nickname || '我'}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Activity size={20} color="#FF3B5C" />
            <div className="flex items-baseline gap-1">
              <span className="text-white text-[17px] font-black">Lv.8</span>
              <span className="text-[#999] text-[11px] font-semibold"> / 40</span>
            </div>
            <div className="w-[110px] h-[6px] rounded-full bg-[#1C1012] border border-[#D43C33]/80 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="h-full rounded-full bg-[#D43C33]"
              />
            </div>
            <span className="text-[#999] text-[8px] font-semibold">亲密度 {points.toLocaleString()} / {goal.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center gap-2 w-[110px]">
            <Avatar src={IMG.persona} size={64} ring />
            <span className="text-white text-[13px] font-extrabold">互补人格{personaName}</span>
          </div>
        </div>

        {/* achievements */}
        <div className="flex flex-col gap-2.5">
          <SectionLabel>已解锁成就</SectionLabel>
          <div className="flex gap-2.5">
            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.title}
                className="relative flex-1 rounded-2xl border border-[#40454E] p-3 overflow-hidden flex flex-col gap-2
                  bg-[linear-gradient(170deg,#2D3036,#24272D_50%,#1E2127)]"
              >
                <div className="pointer-events-none absolute -right-4 -top-4 w-[52px] h-[52px] rounded-full blur-xl
                  bg-[radial-gradient(circle,rgba(251,113,133,0.5),transparent_70%)]" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <a.icon size={15} color="#B8C0CC" />
                    <span className="text-white text-[12px] font-black">{a.title}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#32363E] border border-[#D43C33] text-[#ff6b62] text-[8px] font-extrabold">
                    {a.tag}
                  </span>
                </div>
                <span className="text-[#D6DCE6] text-[10px] font-semibold">{a.desc}</span>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[#F4F7FB] text-[11px] font-black">
                    {a.done ? '已完成' : `${a.progress}/${a.total}`}
                  </span>
                  <div className="w-16 h-[6px] rounded-full bg-white/10 border border-white/25 overflow-hidden">
                    <div className="h-full rounded-full bg-[#D43C33]" style={{ width: `${(a.progress / a.total) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* tasks */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <SectionLabel>提升亲密度任务</SectionLabel>
            <span className="px-2.5 py-1 rounded-full border border-[#D43C33] text-[#ff6b62] font-mono text-[8px] font-black">
              今日 +60
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {tasks.map((t, i) => (
              <motion.div
                key={t.title + i}
                layout
                className={`rounded-[18px] border p-3.5 flex items-center justify-between gap-3
                  ${t.done ? 'bg-[#181C23] border-[#3A4250]' : 'bg-[#181c23] border-[#2C333E]'}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 rounded-full flex-none flex items-center justify-center border
                    ${t.done ? 'bg-[#1A1E26] border-[#4A5260]/60' : 'bg-[#1C1419] border-[#D43C33]'}`}>
                    <t.icon size={14} color={t.done ? '#8B96A8' : '#D43C33'} />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className={`text-[13px] font-bold ${t.done ? 'text-white/55' : 'text-white'}`}>{t.title}</span>
                    <span className="text-[#AEB7C4] text-[11px] font-medium truncate">{t.desc}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-none">
                  <span className="font-mono text-white text-[12px] font-black">+{t.pts}</span>
                  <Heart size={13} color={t.done ? '#878F9F' : '#E85D5D'} fill={t.done ? '#878F9F' : '#E85D5D'} />
                  {t.done ? (
                    <span className="w-[54px] h-7 rounded-full bg-[#242933] border border-[#4A5260] flex items-center justify-center text-[#8B96A8] text-[10px] font-bold">
                      已完成
                    </span>
                  ) : (
                    <button
                      onClick={() => doTask(i)}
                      className="pressable w-[54px] h-7 rounded-full bg-[#D43C33] border border-[#E65B53] flex items-center justify-center text-white text-[10px] font-black"
                    >
                      去完成
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
