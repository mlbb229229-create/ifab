import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { StatusBar, BottomNav } from '../components/ui.jsx'
import MatchOverlay from '../components/MatchOverlay.jsx'
import { IMG, Avatar } from '../assets.jsx'

/* ---------- tag data (2~8 字随机长度) ---------- */
const TAG_LABELS = [
  '搞钱', '亲密关系危机', '早睡早起', '读书', '数字游民计划',
  '减脂 10 斤', '转行 AI', '情绪复盘', '环球旅行', '副业月入过万',
  '冥想', '考研二战', '学会拒绝', '存钱买房',
  '升职加薪', '学摄影', '英语口语', '独居生活', '分手自愈', '考公上岸',
  '断舍离', '学吉他', '创业一周年', '早睡挑战', '戒掉拖延',
]
/* 点缀色：主色红 + 少量青/金/紫 */
const DOT_COLORS = [
  '', '', 'cyan', '', 'violet', '', '', 'cyan', '', '',
  'violet', '', 'cyan', '', '', 'cyan', 'violet', '', '', '',
  'cyan', 'violet', '', 'cyan', '',
]

const STARS = [
  { x: 30, y: 40, s: 2, d: 0 }, { x: 320, y: 70, s: 2, d: 1.1 }, { x: 70, y: 210, s: 2, d: 0.5 },
  { x: 300, y: 250, s: 3, d: 1.8 }, { x: 180, y: 20, s: 1.5, d: 0.8 }, { x: 20, y: 140, s: 1.5, d: 2.2 },
  { x: 350, y: 160, s: 2, d: 0.3 }, { x: 120, y: 300, s: 2, d: 1.5 }, { x: 250, y: 320, s: 1.5, d: 2.6 },
]

/* 2D 星尘锚点：黄金角螺旋 + 抖动，避免标签重叠 */
function starLayout(n) {
  const pts = []
  const ga = Math.PI * (3 - Math.sqrt(5))
  const cx = 160, cy = 150
  for (let i = 0; i < n; i++) {
    const r = 14 + (i / n) * 138
    const th = ga * i
    pts.push({
      x: cx + Math.cos(th) * r + ((i * 5) % 11 - 5) * 7,
      y: cy + Math.sin(th) * r + ((i * 7) % 13 - 6) * 5,
    })
  }
  return pts
}

/* ---------- 2D 星尘标签场（可拖拽甩动 + 点选） ---------- */
function StarField({ myIf, selected, onToggle }) {
  const tags = useMemo(() => {
    const list = myIf
      ? [{ label: myIf.ifText.length > 8 ? myIf.ifText.slice(0, 8) + '…' : myIf.ifText, gold: true },
         ...TAG_LABELS.map((t, i) => ({ label: t, dot: DOT_COLORS[i % DOT_COLORS.length] }))]
      : TAG_LABELS.map((t, i) => ({ label: t, dot: DOT_COLORS[i % DOT_COLORS.length] }))
    const pts = starLayout(list.length)
    return list.map((t, i) => ({ ...t, a: pts[i] }))
  }, [myIf])

  const tagRefs = useRef([])
  const S = useRef({ ox: 0, oy: 0, vx: 0, vy: 0, dragging: false, lastX: 0, lastY: 0, lastT: 0 })

  const apply = () => {
    const s = S.current
    tagRefs.current.forEach((el, i) => {
      if (!el || !tags[i]) return
      el.style.transform = `translate(-50%,-50%) translate(${s.ox + tags[i].a.x}px, ${s.oy + tags[i].a.y}px)`
    })
  }

  useEffect(() => {
    apply()
    let raf
    const loop = () => {
      const s = S.current
      if (!s.dragging) {
        s.ox += s.vx
        s.oy += s.vy
        s.vx *= 0.9
        s.vy *= 0.9
        if (Math.abs(s.vx) < 0.06 && Math.abs(s.vy) < 0.06) s.vx = s.vy = 0
        apply()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [tags])

  const onDown = (e) => {
    const s = S.current
    s.dragging = true
    s.lastX = e.clientX
    s.lastY = e.clientY
    s.lastT = performance.now()
    s.vx = s.vy = 0
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onMove = (e) => {
    const s = S.current
    if (!s.dragging) return
    const now = performance.now()
    const dx = e.clientX - s.lastX
    const dy = e.clientY - s.lastY
    const dtm = Math.max(1, now - s.lastT) / 1000
    s.ox = Math.max(-120, Math.min(120, s.ox + dx))
    s.oy = Math.max(-80, Math.min(80, s.oy + dy))
    s.vx = Math.max(-12, Math.min(12, dx / dtm))
    s.vy = Math.max(-10, Math.min(10, dy / dtm))
    s.lastX = e.clientX
    s.lastY = e.clientY
    s.lastT = now
    apply()
  }
  const onUp = () => { S.current.dragging = false }

  return (
    <div className="relative w-full h-[320px] overflow-hidden rounded-[20px] border border-white/10
      bg-[radial-gradient(120%_90%_at_50%_0%,#1b1f2a_0%,#13151c_55%,#0e1016_100%)] select-none"
      style={{ touchAction: 'none' }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={onUp}
    >
      {/* 微光星星 */}
      {STARS.map((s, i) => (
        <div key={i} className="star" style={{ left: s.x, top: s.y, width: s.s, height: s.s, animationDelay: `${s.d}s` }} />
      ))}
      {/* 中心微光 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,60,51,0.12), transparent 65%)' }} />

      {/* 星尘标签 */}
      {tags.map((t, i) => {
        const on = selected.includes(t.label)
        return (
          <div key={t.label} ref={(el) => (tagRefs.current[i] = el)}
            className="absolute left-0 top-0 will-change-transform" style={{ left: 0, top: 0 }}>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onToggle(t.label)}
              className={`pressable whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all duration-200
                ${on
                  ? 'bg-[#D43C33] border border-[#ff6b62] text-white shadow-[0_0_16px_rgba(212,60,51,0.55)]'
                  : t.gold
                    ? 'bg-[rgba(58,36,6,0.55)] border border-[#e8bf3a]/50 text-[#ffd76a] shadow-[0_0_10px_rgba(232,191,58,0.2)]'
                    : 'bg-[rgba(20,24,32,0.7)] border border-white/20 text-white/85 shadow-[0_0_8px_rgba(255,255,255,0.06)]'}`}
            >
              <span className={`tag-dot ${t.gold ? 'gold' : ''} ${t.dot || ''}`} />
              {t.label}
              {t.gold && <span className="text-[7px] text-white/50 font-normal">(我)</span>}
            </button>
          </div>
        )
      })}

      {/* 提示 */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-2 text-center pointer-events-none">
        <span className="text-white/30 text-[9px] font-medium tracking-wide">按住拖拽 · 点选星辰</span>
      </div>
    </div>
  )
}

/* ---------- group discovery data ---------- */
const GROUP_TABS = ['#消费成长', '#工作效率', '#情绪复盘', '#职场人际沟通', '#存钱', '#忘记烦恼的']
const PANELS = {
  money: [
    { name: '理财入门 · 记账打卡群', match: 95, tags: '预算/存钱/复利', online: 36 },
    { name: '消费克制 · 30天不乱买小组', match: 89, tags: '习惯/记录/复盘', online: 87 },
    { name: '投资基础 · 小白互助大群', match: 83, tags: '风险/配置/心态', online: 129 },
  ],
  relation: [
    { name: '亲密关系修复 · 安全感练习群', match: 93, tags: '沟通/边界/修复', online: 52 },
    { name: '伴侣对话练习室 · 不内耗', match: 90, tags: '表达/倾听/冲突', online: 41 },
    { name: '边界练习室 · 敢拒绝', match: 88, tags: '自我/边界/勇气', online: 33 },
  ],
  career: [
    { name: '升职加薪 · 目标拆解打卡群', match: 97, tags: '目标/复盘/执行', online: 68 },
    { name: '向上管理 · 汇报与谈判', match: 94, tags: '汇报/谈判/协作', online: 47 },
    { name: '工作效率 · 专注番茄钟组队', match: 91, tags: '专注/节奏/习惯', online: 75 },
  ],
}
const TAB_PANEL = { '#消费成长': 'money', '#存钱': 'money', '#情绪复盘': 'relation', '#忘记烦恼的': 'relation', '#工作效率': 'career', '#职场人际沟通': 'career' }

const AVATAR_POOL = [IMG.luna, IMG.mika, IMG.nono, IMG.chen, IMG.rita, IMG.jay]

const RECOMMENDED = [
  { name: 'Luna', av: IMG.luna, fit: 96, km: '1.2km', online: true },
  { name: 'Mika', av: IMG.mika, fit: 92, km: '3.8km' },
  { name: 'Nono', av: IMG.nono, fit: 88, km: '0.6km', online: true },
  { name: 'Chen', av: IMG.chen, fit: 85, km: '5.4km', online: true },
  { name: 'Rita', av: IMG.rita, fit: 81, km: '2.0km' },
  { name: 'Jay', av: IMG.jay, fit: 79, km: '8.1km', online: true },
]

export default function Home({ go, store }) {
  const [tab, setTab] = useState('#消费成长')
  const [toast, setToast] = useState('')
  const [matching, setMatching] = useState(false)
  const [selTags, setSelTags] = useState([])
  const panel = PANELS[TAB_PANEL[tab]]

  const ping = (msg) => {
    setToast(msg)
    clearTimeout(ping.t)
    ping.t = setTimeout(() => setToast(''), 1800)
  }
  const toggleTag = (label) => {
    setSelTags((prev) => (prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]))
  }
  const joinTopic = (label) => {
    ping(`已加入「${label}」话题`)
    setTimeout(() => go('group-chat', { title: label }), 650)
  }
  const startMatch = () => {
    if (!selTags.length) { ping('先点亮几颗星辰吧 ✦'); return }
    setMatching(true)
  }
  const matchDone = (u) => {
    setMatching(false)
    go('user-chat', { name: u.name, av: u.av, fit: u.fit })
  }

  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col overflow-hidden">
      <StatusBar />
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* header */}
        <div className="flex items-center justify-between px-5 pt-1">
          <h1 className="text-white text-[20px] font-black">星海</h1>
        </div>

        {/* 2D 星尘标签场 — drag to browse, tap to select */}
        <StarField myIf={store.data.firstIf} selected={selTags} onToggle={toggleTag} />

        {/* 已选星辰 + 去匹配 */}
        {selTags.length > 0 && (
          <div className="mx-4 mt-3 rounded-[16px] bg-[#171a22] border border-[#D43C33]/40 p-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="flex-none text-white/40 text-[10px] font-bold">已选</span>
              {selTags.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className="pressable flex-none flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D43C33] border border-[#ff6b62] text-white text-[10px] font-semibold"
                >
                  {t}
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="rgba(255,255,255,0.8)" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                </button>
              ))}
            </div>
            <button
              onClick={startMatch}
              className="pressable mt-2.5 w-full h-9 rounded-full bg-[linear-gradient(95deg,#FF4B4B,#C40000)] text-white text-[12px] font-black
                shadow-[0_6px_20px_rgba(255,60,60,0.4)]"
            >
              基于 {selTags.length} 个话题去匹配
            </button>
          </div>
        )}

        {/* match cards */}
        <div className="flex gap-3 px-4 mt-4">
          {/* IF 伴侣 — dark glass + subtle red glow, accent only on CTA */}
          <div className="relative flex-1 rounded-[20px] p-4 overflow-hidden flex flex-col justify-between h-[160px]
            bg-[#171a22] border border-white/10">
            <div className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl opacity-40
              bg-[radial-gradient(circle,#D43C33,transparent_70%)]" />
            <div className="relative flex items-start justify-between">
              <div className="text-white text-[18px] font-black leading-tight">IF 伴侣</div>
              <span className="px-2 py-0.5 rounded-full bg-[#D43C33] text-white font-mono text-[9px] font-black">新</span>
            </div>
            <p className="relative text-white/60 text-[11px] font-medium leading-snug">
              基于你的 IF 设定与近期互动，匹配最同频的人。
            </p>
            <div className="relative flex flex-col items-start gap-2">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#54e92c] shadow-[0_0_6px_#54e92c]" />
                <span className="font-mono text-[10px] font-bold text-white/55">今日可匹配 3 次</span>
              </div>
              <button
                onClick={startMatch}
                className="pressable whitespace-nowrap px-4 py-2 rounded-full bg-[#D43C33] text-white text-[12px] font-black shadow-[0_4px_16px_rgba(212,60,51,0.4)]"
              >
                开始匹配
              </button>
            </div>
          </div>

          {/* 同城IF — dark glass + teal location accent */}
          <div className="relative w-[130px] rounded-[20px] p-4 overflow-hidden flex flex-col h-[160px]
            bg-[#171a22] border border-white/10">
            <div className="pointer-events-none absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-30
              bg-[radial-gradient(circle,#4fd8e0,transparent_70%)]" />
            <div className="relative flex items-center justify-between">
              <span className="text-white text-[18px] font-black leading-tight">同城IF</span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#4fd8e0]/15">
                <MapPin size={15} color="#4fd8e0" />
              </div>
            </div>
            <p className="relative text-white/55 text-[10px] font-medium leading-snug mt-2">
              线下组队交友，惊喜活动不停。
            </p>
            <button
              onClick={() => ping('同城活动即将开放')}
              className="pressable relative mt-auto self-start whitespace-nowrap px-3.5 py-1.5 rounded-full bg-[#4fd8e0] text-[#0b2b2e] text-[11px] font-black"
            >
              去看看
            </button>
          </div>
        </div>

        {/* recommended users */}
        <div className="mt-5 px-4">
          <div className="text-white/80 text-[11px] font-bold tracking-wide mb-2.5">可能感兴趣的用户</div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {RECOMMENDED.map((u) => (
              <button key={u.name} onClick={() => go('user-chat', { name: u.name, av: u.av, fit: u.fit })} className="pressable relative flex flex-col items-center gap-1.5 w-[54px] flex-none">
                <Avatar src={u.av} size={38} ring />
                {u.online && (
                  <span className="absolute right-2 top-0 w-[7px] h-[7px] rounded-full bg-[#54e92c] border border-[#141416]" />
                )}
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-mono text-white text-[7px] font-semibold">默契度 {u.fit}%</span>
                  <span className="font-mono text-white/60 text-[9px] font-semibold">{u.km}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* group discovery */}
        <div className="mt-5 px-4">
          <div className="text-white/80 text-[11px] font-semibold tracking-wide mb-2">发现群聊</div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {GROUP_TABS.map((t) => {
              const on = tab === t
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pressable flex-none px-2.5 py-1.5 rounded-full border text-[10px] transition-all
                    ${on ? 'border-[#c1352d] text-[#ff6b62] font-extrabold bg-[#D43C33]/10' : 'border-white/30 text-white/75 font-semibold'}`}
                >
                  {t}
                </button>
              )
            })}
          </div>
          <div className="h-px bg-white/10 my-2.5" />

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col gap-2"
            >
              {panel.map((g, i) => (
                <button
                  key={g.name}
                  onClick={() => go('group-chat', { title: g.name.split(' · ')[0] })}
                  className="pressable w-full rounded-[18px] bg-[#181c23] border border-white/25 px-3.5 py-2.5 flex items-center justify-between text-left"
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
                  <span
                    onClick={(e) => { e.stopPropagation(); ping('已加入群聊') }}
                    className="pressable flex-none ml-2 px-3.5 py-2 rounded-lg text-white text-[13px]
                      bg-[linear-gradient(135deg,rgba(255,22,42,0.7),rgba(250,46,107,0.65))] border border-white/25"
                  >
                    加入
                  </span>
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 右侧抽屉标签：红色小胶囊 + 左箭头，点击向左拽出 */}
      <motion.button
        onClick={() => go('ifs')}
        initial={{ x: 8, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring', damping: 20, stiffness: 200 }}
        whileTap={{ x: -10 }}
        className="absolute right-0 top-[38%] z-40 h-9 pl-1.5 pr-2 rounded-l-full
          bg-[linear-gradient(120deg,#FF6B62,#D43C33_55%,#8A1E18)]
          shadow-[-3px_0_16px_rgba(212,60,51,0.5),inset_1px_0_1px_rgba(255,255,255,0.2)]
          flex items-center gap-1"
      >
        {/* 左箭头 */}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="flex-none">
          <path d="M15 18l-6-6 6-6" stroke="rgba(255,255,255,0.85)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {/* IF 文字 */}
        <span className="text-white/90 text-[9px] font-semibold tracking-wide leading-none">IF</span>
      </motion.button>

      <BottomNav active="home" onTab={(t) => go(t === 'home' ? 'home' : t)} />

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-24 z-50 px-4 py-2 rounded-full bg-[#2a2e38]/95 border border-white/20 text-white text-[11px] font-semibold shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* matching overlay */}
      <AnimatePresence>
        {matching && (
          <MatchOverlay pool={RECOMMENDED} onDone={matchDone} onClose={() => setMatching(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
