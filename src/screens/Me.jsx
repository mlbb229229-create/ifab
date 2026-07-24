import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, SlidersHorizontal, Heart, LayoutDashboard, MessageCircle,
  Bookmark, Moon, Settings, Info, Pencil, Sparkles, QrCode, Users,
} from 'lucide-react'
import { StatusBar, BottomNav } from '../components/ui.jsx'
import { IMG, Avatar } from '../assets.jsx'

function MenuRow({ icon: Icon, tint = '#D43C33', label, desc, onClick, right }) {
  return (
    <button onClick={onClick} className="pressable w-full flex items-center gap-3 px-4 py-3.5 text-left">
      <div className="w-9 h-9 rounded-xl flex-none flex items-center justify-center"
        style={{ background: `${tint}1f`, border: `1px solid ${tint}55` }}>
        <Icon size={17} color={tint} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-[13px] font-bold">{label}</div>
        {desc && <div className="text-white/40 text-[11px] mt-0.5 truncate">{desc}</div>}
      </div>
      {right || <ChevronRight size={16} color="#5b6370" />}
    </button>
  )
}

export default function Me({ go, store }) {
  const [darkMode, setDarkMode] = useState(true)
  const [toast, setToast] = useState('')
  const nick = store.data.nickname || '小星'
  const personaName = store.data.personaName || 'W'
  const activeIfs = store.ifs.filter((i) => i.status !== 'done')
  const latestIf = activeIfs[0] || store.ifs[0]

  const ping = (m) => { setToast(m); clearTimeout(ping.t); ping.t = setTimeout(() => setToast(''), 1600) }

  const stats = [
    { label: '我的 IF', value: store.ifs.length },
    { label: '加入的群聊', value: 5 },
    { label: '同频好友', value: 23 },
  ]

  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col overflow-hidden">
      <StatusBar />
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* header */}
        <div className="flex items-center justify-between px-5 pt-1 pb-3">
          <h1 className="text-white text-[20px] font-black">我的</h1>
          <button onClick={() => ping('二维码名片已生成')} className="pressable p-1">
            <QrCode size={20} color="#AEB5C2" />
          </button>
        </div>

        {/* profile card */}
        <div className="mx-4 rounded-[20px] border border-white/15 p-4 relative overflow-hidden
          bg-[linear-gradient(160deg,#262a33,#1b1e26_60%,#171a21)]">
          <div className="pointer-events-none absolute -right-10 -top-12 w-40 h-40 rounded-full blur-3xl opacity-30
            bg-[radial-gradient(circle,#D43C33,transparent_70%)]" />
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <Avatar src={IMG.me} size={60} ring />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#54e92c] border-2 border-[#1b1e26]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white text-[17px] font-black">{nick}</span>
                <button onClick={() => ping('编辑资料')} className="pressable"><Pencil size={13} color="#8B96A8" /></button>
              </div>
              <div className="font-mono text-white/40 text-[10px] mt-0.5">IF ID · NO.20260724</div>
              <div className="flex gap-1.5 mt-1.5">
                <span className="px-2 py-0.5 rounded-full bg-[#D43C33]/15 border border-[#D43C33]/50 text-[#FF8A80] text-[9px] font-bold">
                  {store.data.gender || '女'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/[0.07] border border-white/15 text-white/60 text-[9px] font-bold">
                  {store.data.birthday || '1998-04-12'}
                </span>
              </div>
            </div>
          </div>

          {/* my IF */}
          <button
            onClick={() => go('ifs')}
            className="pressable mt-3.5 w-full rounded-xl bg-[#0B0E14]/70 border border-[#FF7F8A]/25 px-3.5 py-2.5 text-left"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Sparkles size={12} color="#FF8A80" />
                <span className="text-[#FF8A80] text-[10px] font-black tracking-wider">我的 IF</span>
              </div>
              <span className="font-mono text-[9px] font-bold text-white/40">{activeIfs.length} 进行中 · 查看全部 →</span>
            </div>
            <div className="text-white/85 text-[12px] leading-relaxed">
              {latestIf
                ? <>如果<span className="text-[#FF8A80] font-bold">{latestIf.ifText}</span>，我就<span className="text-[#FF8A80] font-bold">{latestIf.want || '……'}</span></>
                : '写下你的第一个 IF 目标 →'}
            </div>
            {latestIf && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-[4px] rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${latestIf.status === 'done' ? 'bg-[#54e92c]/70' : 'bg-[linear-gradient(90deg,#FF6B62,#D43C33)]'}`}
                    style={{ width: `${latestIf.progress}%` }}
                  />
                </div>
                <span className="font-mono text-[9px] font-black text-[#FF8A80]">{latestIf.progress}%</span>
              </div>
            )}
          </button>

          {/* stats */}
          <div className="flex mt-3.5">
            {stats.map((s, i) => (
              <div key={s.label} className={`flex-1 flex flex-col items-center gap-0.5 ${i > 0 ? 'border-l border-white/10' : ''}`}>
                <span className="text-white text-[16px] font-black font-mono">{s.value}</span>
                <span className="text-white/40 text-[10px]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* persona card */}
        <div className="mx-4 mt-3 rounded-[20px] border border-[#D43C33]/30 p-4 relative overflow-hidden
          bg-[linear-gradient(165deg,rgba(58,10,13,0.75),rgba(30,12,15,0.85)_60%,rgba(20,16,20,0.9))]">
          <div className="flex items-center gap-3">
            <Avatar src={IMG.persona} size={48} ring />
            <div className="flex-1 min-w-0">
              <div className="text-white text-[14px] font-black">第二人格 · {personaName}</div>
              <div className="text-white/50 text-[11px] mt-0.5">
                {(store.data.traits || []).length ? store.data.traits.join(' / ') : '温柔 / 理性'} · 亲密度 Lv.8
              </div>
            </div>
            <button onClick={() => go('persona-chat')} className="pressable px-3 py-1.5 rounded-full bg-[#D43C33] text-white text-[11px] font-black">
              聊天
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => go('ip-settings')} className="pressable flex-1 h-9 rounded-xl bg-white/[0.07] border border-white/15 text-white/85 text-[11px] font-bold flex items-center justify-center gap-1.5">
              <SlidersHorizontal size={13} /> 调试 IF 参数
            </button>
            <button onClick={() => go('intimacy')} className="pressable flex-1 h-9 rounded-xl bg-white/[0.07] border border-white/15 text-white/85 text-[11px] font-bold flex items-center justify-center gap-1.5">
              <Heart size={13} /> 亲密度
            </button>
          </div>
        </div>

        {/* menu */}
        <div className="mx-4 mt-3 rounded-[20px] border border-white/10 bg-[#1b1e26] overflow-hidden divide-y divide-white/[0.06]">
          <MenuRow icon={LayoutDashboard} tint="#e2703a" label="决策台" desc="让第二人格帮你做选择" onClick={() => go('decision')} />
          <MenuRow icon={MessageCircle} tint="#4a8fe2" label="我的群聊" desc="5 个群有新消息" onClick={() => go('messages')} />
          <MenuRow icon={Users} tint="#3fbf8f" label="同频好友" desc="23 位 · 本周新增 3 位" onClick={() => ping('好友列表开发中')} />
          <MenuRow icon={Bookmark} tint="#c9a93b" label="收藏的话题" desc="12 个话题标签" onClick={() => ping('收藏夹开发中')} />
        </div>

        <div className="mx-4 mt-3 rounded-[20px] border border-white/10 bg-[#1b1e26] overflow-hidden divide-y divide-white/[0.06]">
          <MenuRow
            icon={Moon} tint="#7a6fe2" label="深色模式"
            onClick={() => setDarkMode(!darkMode)}
            right={
              <div className={`w-10 h-[22px] rounded-full p-[3px] transition-colors ${darkMode ? 'bg-[#D43C33]' : 'bg-white/15'}`}>
                <motion.div
                  animate={{ x: darkMode ? 18 : 0 }}
                  transition={{ type: 'spring', damping: 22, stiffness: 350 }}
                  className="w-4 h-4 rounded-full bg-white shadow"
                />
              </div>
            }
          />
          <MenuRow icon={Settings} tint="#8B96A8" label="设置" onClick={() => ping('设置页开发中')} />
          <MenuRow icon={Info} tint="#5b8fb9" label="关于 IF" desc="v0.1.0 · 构建你的第二人格模型" onClick={() => ping('IF · 如果我就')} />
        </div>

        <div className="text-center text-white/25 text-[10px] mt-5 font-mono tracking-widest">IF COSMOS</div>
      </div>

      <BottomNav active="me" onTab={(t) => go(t)} />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-24 z-50 px-4 py-2 rounded-full bg-[#2a2e38]/95 border border-white/20 text-white text-[11px] font-semibold shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
