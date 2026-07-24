import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Image as ImageIcon, ArrowUp, MoreHorizontal, LayoutDashboard, Sparkles, Flame } from 'lucide-react'
import { StatusBar, NavBar } from '../components/ui.jsx'
import { IMG, Avatar } from '../assets.jsx'

/* ---------- shared input bar ---------- */
function InputBar({ placeholder, onSend, extra }) {
  const [text, setText] = useState('')
  const send = () => {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }
  return (
    <div className="flex flex-col gap-2">
      {extra}
      <div className="flex items-center justify-between h-[50px] rounded-full bg-[#242a34] border border-white/30 px-3.5 gap-2.5">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <button className="pressable w-[34px] h-[34px] rounded-full border border-white/50 flex items-center justify-center flex-none">
            <Mic size={17} color="#d7d7d7" />
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none text-white text-[13px] font-semibold placeholder:text-white/45"
          />
        </div>
        <div className="flex items-center gap-2.5 flex-none">
          <button className="pressable w-[34px] h-[34px] rounded-full border border-white/50 flex items-center justify-center">
            <ImageIcon size={17} color="#d7d7d7" />
          </button>
          <button
            onClick={send}
            className={`pressable w-[34px] h-[34px] rounded-full border border-white/50 flex items-center justify-center transition-colors
              ${text.trim() ? 'bg-[#f63636]' : 'bg-[#f63636]/50'}`}
          >
            <ArrowUp size={15} color="#fff" strokeWidth={2.6} />
          </button>
        </div>
      </div>
    </div>
  )
}

function Typing() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <span key={i} className="typing-dot w-1.5 h-1.5 rounded-full bg-white/70" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  )
}

/* ============ 平行人格聊天 ============ */
const PERSONA_REPLIES = [
  '我理解你的纠结。我们先把这个问题拆成「想要的」和「害怕的」两列，好吗？',
  '基于你的性格标签，我建议先做一次低成本试错，再决定是否全力以赴。',
  '别忘了你在「如果」里写下的目标。这个选择能让你离它更近吗？',
]

export function PersonaChat({ go, back, store }) {
  const personaName = store.data.personaName || 'W'
  const [msgs, setMsgs] = useState([
    { from: 'me', text: '我到底要不要三十岁之前去创业？' },
    { from: 'if', text: '我知道你的内心充满纠结，你是一个喜欢稳定的人，但内心却有很多想法' },
  ])
  const [typing, setTyping] = useState(false)
  const replyIdx = useRef(0)
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: 99999, behavior: 'smooth' })
  }, [msgs, typing])

  const send = (t) => {
    setMsgs((m) => [...m, { from: 'me', text: t }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'if', text: PERSONA_REPLIES[replyIdx.current++ % PERSONA_REPLIES.length] }])
    }, 1400)
  }

  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col">
      <StatusBar />
      <NavBar
        title={`IF · ${personaName}`}
        onBack={back}
        right={
          <button onClick={() => go('intimacy')} className="pressable relative">
            <Avatar src={IMG.persona} size={28} ring />
          </button>
        }
      />
      <div className="h-px bg-white/10" />

      <div ref={listRef} className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-5">
        <div className="self-center text-white/45 text-[11px] font-semibold">4月20日 周一</div>
        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${m.from === 'me' ? 'flex-row-reverse items-end' : 'items-start'}`}
            >
              <Avatar src={m.from === 'me' ? IMG.me : IMG.persona} size={32} />
              <div
                className={`max-w-[230px] px-3 py-2.5 text-[12px] leading-relaxed font-medium text-white border border-white/30
                  ${m.from === 'me'
                    ? 'bg-[#dc3c3c] rounded-[22px_22px_8px_22px]'
                    : 'bg-[linear-gradient(135deg,#40434ae8,#34373ef0_52%,#2a2d33f8)] rounded-[20px_20px_20px_8px]'}`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex gap-2 items-start">
            <Avatar src={IMG.persona} size={32} />
            <div className="rounded-[20px_20px_20px_8px] border border-white/30 bg-[#34373e]">
              <Typing />
            </div>
          </div>
        )}
      </div>

      <div className="px-3 pb-6 pt-1">
        <InputBar
          placeholder="分享一个关于改变的想法..."
          onSend={send}
          extra={
            <div className="flex gap-2.5 px-1">
              <button
                onClick={() => go('decision')}
                className="pressable flex items-center gap-1.5 h-[30px] px-3 rounded-full border border-white/40
                  bg-[linear-gradient(135deg,rgba(47,19,24,0.8),rgba(36,16,21,0.8))]"
              >
                <LayoutDashboard size={13} color="#fff" />
                <span className="text-white text-[12px] font-black">决策台</span>
                <Flame size={13} color="#e12e01" />
              </button>
              <button
                onClick={() => send('帮我整理一个提问模板')}
                className="pressable flex items-center gap-1.5 h-[30px] px-3 rounded-full border border-white/40 opacity-95
                  bg-[linear-gradient(135deg,rgba(47,19,24,0.8),rgba(36,16,21,0.8))]"
              >
                <Sparkles size={13} color="#fff" />
                <span className="text-white text-[12px] font-extrabold">提问模板</span>
              </button>
            </div>
          }
        />
      </div>
    </div>
  )
}

/* ============ 用户私聊（匹配到的同频用户） ============ */
const DM_REPLIES = [
  '哈哈真的假的，我也是这么想的！',
  '看到你的 IF 目标了，感觉我们可以互相监督打卡。',
  '周末有个同城的小组活动，要不要一起？',
]

export function DmChat({ go, back, params }) {
  const name = params?.name || 'Luna'
  const av = params?.av || IMG.luna
  const fit = params?.fit || 96
  const [msgs, setMsgs] = useState([
    { from: 'other', text: `嗨～我们的 IF 目标好像，默契度 ${fit}% 不是盖的。` },
    { from: 'other', text: '你最近在为目标做什么行动呀？' },
  ])
  const [typing, setTyping] = useState(false)
  const replyIdx = useRef(0)
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: 99999, behavior: 'smooth' })
  }, [msgs, typing])

  const send = (t) => {
    setMsgs((m) => [...m, { from: 'me', text: t }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'other', text: DM_REPLIES[replyIdx.current++ % DM_REPLIES.length] }])
    }, 1400)
  }

  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col">
      <StatusBar />
      <NavBar
        title={name}
        sub={`默契度 ${fit}% · 在线`}
        onBack={back}
        right={<button className="pressable"><MoreHorizontal size={22} color="#fff" /></button>}
      />
      <div className="h-px bg-white/10" />

      <div ref={listRef} className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-4">
        <div className="self-center flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D43C33]/15 border border-[#D43C33]/40">
          <span className="text-[#FF8A80] text-[10px] font-bold">已通过 IF 伴侣匹配成功</span>
        </div>
        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
              {m.from === 'me' ? (
                <div className="flex gap-2 justify-end items-end">
                  <div className="max-w-[240px] px-3 py-2.5 text-[12px] leading-relaxed font-semibold text-white bg-[#dc3c3c] border border-white/30 rounded-[18px_18px_8px_18px]">
                    {m.text}
                  </div>
                  <Avatar src={IMG.meAvatar} size={28} />
                </div>
              ) : (
                <div className="flex gap-2.5">
                  <Avatar src={av} size={28} />
                  <div className="max-w-[240px] px-3 py-2.5 text-[12px] leading-relaxed font-semibold text-white border border-white/30
                    bg-[linear-gradient(135deg,#40434ae8,#34373ef0_52%,#2a2d33f8)] rounded-[18px_18px_18px_8px]">
                    {m.text}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex gap-2.5 items-center">
            <Avatar src={av} size={28} />
            <div className="rounded-[18px_18px_18px_8px] border border-white/30 bg-[#34373e]"><Typing /></div>
          </div>
        )}
      </div>

      <div className="px-3 pb-6 pt-1">
        <InputBar placeholder="打个招呼吧..." onSend={send} />
      </div>
    </div>
  )
}

/* ============ 群组聊天 ============ */
const GROUP_MSGS = [
  { name: '路人A', av: IMG.passerA, text: '我会先去那边试住一周，把通勤/租房摸清。' },
  { name: '北迁·小组长', av: IMG.leader, text: '我们群里有个清单：城市信息、预算、落地动作。要不要我发你？' },
  { name: '路人B', av: IMG.passerB, text: '别忘了把‘为什么换’写成一句话，不然做决策会反复。' },
]
const GROUP_REPLIES = [
  { name: '北迁·小组长', av: IMG.leader, text: '这个思路很稳，建议先把预算表拉出来。' },
  { name: '路人A', av: IMG.passerA, text: '+1，底线清单比目标清单更重要。' },
]

export function GroupChat({ go, back, params }) {
  const title = params?.title || '北迁计划'
  const [msgs, setMsgs] = useState([
    ...GROUP_MSGS.map((m) => ({ ...m, from: 'other' })),
    { from: 'me', text: '我会先列三条底线：预算、通勤、社交。' },
  ])
  const [typing, setTyping] = useState(false)
  const replyIdx = useRef(0)
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: 99999, behavior: 'smooth' })
  }, [msgs, typing])

  const send = (t) => {
    setMsgs((m) => [...m, { from: 'me', text: t }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const r = GROUP_REPLIES[replyIdx.current++ % GROUP_REPLIES.length]
      setMsgs((m) => [...m, { ...r, from: 'other' }])
    }, 1500)
  }

  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col">
      <StatusBar />
      <NavBar
        title={title}
        sub="4人群聊 · 12人在线"
        onBack={back}
        right={<button className="pressable"><MoreHorizontal size={22} color="#fff" /></button>}
      />
      <div className="h-px bg-white/10" />

      <div ref={listRef} className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-4">
        <div className="self-center text-white/45 text-[10px] font-extrabold">今天 16:36</div>
        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
              {m.from === 'me' ? (
                <div className="flex gap-2 justify-end items-end">
                  <div className="max-w-[240px] px-3 py-2.5 text-[12px] leading-relaxed font-semibold text-white bg-[#dc3c3c] border border-white/30 rounded-[18px_18px_8px_18px]">
                    {m.text}
                  </div>
                  <Avatar src={IMG.meAvatar} size={28} />
                </div>
              ) : (
                <div className="flex gap-2.5">
                  <Avatar src={m.av} size={28} />
                  <div className="flex flex-col gap-1">
                    <span className="text-white/60 text-[10px] font-extrabold">{m.name}</span>
                    <div className="max-w-[240px] px-3 py-2.5 text-[12px] leading-relaxed font-semibold text-white border border-white/30
                      bg-[linear-gradient(135deg,#40434ae8,#34373ef0_52%,#2a2d33f8)] rounded-[18px_18px_18px_8px]">
                      {m.text}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex gap-2.5 items-center">
            <Avatar src={IMG.leader} size={28} />
            <div className="rounded-[18px_18px_18px_8px] border border-white/30 bg-[#34373e]"><Typing /></div>
          </div>
        )}
      </div>

      <div className="px-3 pb-6 pt-1">
        <InputBar
          placeholder="分享一个关于改变的想法..."
          onSend={send}
          extra={
            <button
              onClick={() => send('那当然是预算、通勤、社交了。')}
              className="pressable flex items-center gap-2 self-start rounded-[20px] border border-white/30 px-3 py-2
                bg-[linear-gradient(135deg,#3c3c44f5,#303038f7_52%,#25252dfa)]"
            >
              <Avatar src={IMG.persona} size={22} />
              <span className="text-white/85 text-[11px] font-medium">AI 建议回复：那当然是预算、通勤、社交了。</span>
            </button>
          }
        />
      </div>
    </div>
  )
}
