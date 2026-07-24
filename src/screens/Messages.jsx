import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, UserPlus, Bell, ChevronRight } from 'lucide-react'
import { StatusBar, BottomNav, Badge } from '../components/ui.jsx'
import { IMG, Avatar } from '../assets.jsx'

const RECENTS = [
  { name: '阿楠', av: IMG.anan, unread: true },
  { name: '米粒', av: IMG.mili, unread: true },
  { name: '小鹿', av: IMG.xiaolu, active: true },
  { name: 'Jason', av: IMG.jason, active: true },
]

const RECENT_TAGS = ['学习成长', '情绪复盘', '职业发展', '时间管理办法', '吵架', '人际沟通', '健康', '沟通表达', '睡眠改善', '预算规划']
const HISTORY_TAGS = ['财务规划', '关系修复', '升职', '家庭关系', '面试准备', '成都旅行计划']

function MsgRow({ icon, title, preview, time, badge, badgeColor, onClick, chevron }) {
  return (
    <button onClick={onClick} className="pressable w-full rounded-[18px] bg-[#242a34] border border-white/30 px-3.5 py-3 flex items-center justify-between text-left">
      <div className="flex items-center gap-2.5 min-w-0">
        {icon}
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-white text-[14px] font-extrabold truncate">{title}</span>
          <span className="text-white/60 text-[11px] font-semibold truncate">{preview}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-none ml-2">
        {time && <span className="font-mono text-white/45 text-[10px] font-bold">{time}</span>}
        <div className="flex items-center gap-1.5">
          {badge && <Badge n={badge} color={badgeColor} />}
          {chevron && <ChevronRight size={16} color="#AEB5C2" />}
        </div>
      </div>
    </button>
  )
}

export default function Messages({ go }) {
  const [filter, setFilter] = useState('全部')
  const [showTags, setShowTags] = useState(false)
  const [pickedTags, setPickedTags] = useState([])

  const toggleTag = (t) =>
    setPickedTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))

  const rows = useMemo(() => {
    const all = [
      { key: 'friend', type: 'sys', icon: (
          <div className="w-[34px] h-[34px] rounded-[10px] flex-none flex items-center justify-center border border-white/25
            bg-[linear-gradient(135deg,#4a5564f0,#384251f4)]">
            <UserPlus size={17} color="#E7EDF7" />
          </div>
        ), title: '好友申请', preview: '3 条新申请 · 1 条待你通过', badge: '3', badgeColor: 'blue', chevron: true },
      { key: 'product', type: 'group', icon: <Avatar src={IMG.groupProduct} size={34} rounded="sq" />, title: '产品设计组（8）', preview: '@你：PRD 已更新，今晚走查一下', time: '15:32' },
      { key: 'sys', type: 'sys', icon: (
          <div className="w-[34px] h-[34px] rounded-[10px] flex-none flex items-center justify-center border border-white/25
            bg-[linear-gradient(135deg,#4a5550f0,#37423df4)]">
            <Bell size={17} color="#E7EDF7" />
          </div>
        ), title: '系统通知', preview: '你加入的群有 2 条新公告。', time: '16:10', badge: '1', badgeColor: 'green' },
      { key: 'wang', type: 'dm', icon: <Avatar src={IMG.wang} size={34} />, title: '小王', preview: '你：OK，那我周末先去看两套。', time: '15:58', badge: '5' },
      { key: 'move', type: 'group', icon: <Avatar src={IMG.groupMove} size={34} rounded="sq" />, title: '北迁互助（52）', preview: '小组长：今晚 8 点语音，记得来。', time: '昨天', badge: '12' },
    ]
    let list = all
    if (filter === '未读') list = all.filter((r) => r.badge)
    if (filter === '群聊') list = all.filter((r) => r.type === 'group')
    return list
  }, [filter])

  const openRow = (key) => {
    if (key === 'product' || key === 'move') go('group-chat', { title: key === 'move' ? '北迁互助' : '产品设计组' })
    else if (key === 'wang') go('user-chat', { name: '小王', av: IMG.wang, fit: 82 })
  }

  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col overflow-hidden">
      <StatusBar />
      <div className="flex items-center justify-between px-4 h-12">
        <h1 className="text-white text-[18px] font-black">消息</h1>
        <button className="pressable"><Search size={20} color="#AEB5C2" /></button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-2 pb-24">
        {/* filters */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1.5">
            {['全部', '未读', '群聊'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`pressable px-3 py-1 rounded-full border text-[10px] font-black transition-colors
                  ${filter === f ? 'border-[#D43C33] text-white bg-[#D43C33]/15' : 'border-white/40 text-white/70'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowTags(true)}
            className={`pressable text-[11px] font-medium ${pickedTags.length ? 'text-[#FF8A80]' : 'text-white/70'}`}
          >
            标签筛选{pickedTags.length ? ` · ${pickedTags.length}` : ''}
          </button>
        </div>

        {/* recents */}
        <div className="mb-1 font-mono text-[10px] font-extrabold tracking-[2px] text-white/80">最近联系人</div>
        <div className="flex gap-3 mb-4 overflow-x-auto no-scrollbar pt-2">
          {RECENTS.map((r) => (
            <button key={r.name} onClick={() => go('user-chat', { name: r.name, av: r.av, fit: 88 })} className="pressable relative flex flex-col items-center gap-1.5 w-[62px] flex-none">
              <Avatar src={r.av} size={44} ring />
              {r.unread && <span className="absolute right-2 top-1 w-[7px] h-[7px] rounded-full bg-[#D43C33]" />}
              {r.active && <span className="absolute right-2 top-1 w-[7px] h-[7px] rounded-full bg-[#54e92c]" />}
              <span className="text-white text-[11px] font-extrabold">{r.name}</span>
            </button>
          ))}
          <button className="pressable flex flex-col items-center gap-1.5 w-[62px] flex-none">
            <div className="w-[44px] h-[44px] rounded-full bg-white/10 border border-white/30 flex items-center justify-center">
              <span className="font-mono text-white font-black text-[10px]">...</span>
            </div>
            <span className="text-white text-[11px] font-extrabold">更多</span>
          </button>
        </div>

        {/* pinned */}
        <div className="mb-1 font-mono text-[10px] font-extrabold tracking-[2px] text-white/80">置顶</div>
        <button onClick={() => go('persona-chat')} className="pressable w-full mb-4 rounded-[18px] bg-[#242a34] border border-white/30 px-3.5 py-3 flex items-center justify-between text-left">
          <div className="flex items-center gap-2.5">
            <Avatar src={IMG.persona} size={34} />
            <div className="flex flex-col gap-0.5">
              <span className="text-white text-[14px] font-extrabold">第二人格 · 置顶</span>
              <span className="text-white/60 text-[11px] font-semibold">我帮你把今天的情绪复盘一下。</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="font-mono text-white/45 text-[10px] font-bold">16:36</span>
            <Badge n="2" />
          </div>
        </button>

        {/* message list */}
        <div className="mb-2 font-mono text-[10px] font-extrabold tracking-[2px] text-white/80">消息</div>
        <div className="flex flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {rows.map((r) => (
              <motion.div
                key={r.key}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18 }}
              >
                <MsgRow {...r} onClick={() => openRow(r.key)} />
              </motion.div>
            ))}
          </AnimatePresence>
          {rows.length === 0 && (
            <div className="py-10 text-center text-white/35 text-[12px]">暂无相关消息</div>
          )}
        </div>
      </div>

      <BottomNav active="messages" onTab={(t) => go(t)} />

      {/* tag filter popover */}
      <AnimatePresence>
        {showTags && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/45"
              onClick={() => setShowTags(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              className="absolute left-9 right-9 top-[132px] z-50 rounded-2xl border border-white/40 bg-[#22252d]/95 backdrop-blur-xl p-3 flex flex-col gap-2.5"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-white text-[11px] font-black flex-none">标签筛选</span>
                <div className="flex-1 flex items-center gap-2 rounded-full bg-white/10 border border-white/30 px-2.5 py-2">
                  <Search size={13} color="#AEB5C2" />
                  <input placeholder="搜索标签…" className="w-full bg-transparent outline-none text-white text-[10px] font-bold placeholder:text-white/40" />
                </div>
                <button onClick={() => setShowTags(false)} className="pressable p-1.5 rounded-full bg-white/10 border border-white/30">
                  <X size={13} color="#ffffffab" />
                </button>
              </div>
              <div className="h-px bg-[#323945]/60" />
              <div className="font-mono text-[9px] font-semibold text-white/50">选择标签筛选对应聊天内容</div>

              {[{ title: '最近常看', tags: RECENT_TAGS }, { title: '历史标签', tags: HISTORY_TAGS }].map((sec) => (
                <div key={sec.title} className="flex flex-col gap-2">
                  <div className="font-mono text-[10px] font-black tracking-[1.2px] text-white/85">{sec.title}</div>
                  <div className="flex flex-wrap gap-2">
                    {sec.tags.map((t) => {
                      const on = pickedTags.includes(t)
                      return (
                        <button
                          key={t}
                          onClick={() => toggleTag(t)}
                          className={`pressable px-2.5 py-1.5 rounded-full border text-[10px] font-extrabold transition-all
                            ${on
                              ? 'bg-[#D43C33] border-[#FF8A80] text-white'
                              : 'bg-[linear-gradient(135deg,rgba(47,19,24,0.8),rgba(36,16,21,0.8))] border-white/40 text-white/85'}`}
                        >
                          {t}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              <button
                onClick={() => setShowTags(false)}
                className="pressable mt-1 w-full py-2.5 rounded-xl bg-[#D43C33] text-white text-[12px] font-black"
              >
                完成{pickedTags.length ? `（已选 ${pickedTags.length} 个）` : ''}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
