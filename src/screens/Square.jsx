import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, MessageCircle, Share2, MapPin, Plus, Image as ImageIcon,
  ChevronLeft, SendHorizonal, X, Search, MoreHorizontal, ThumbsDown, Flag, Camera,
} from 'lucide-react'
import { StatusBar, BottomNav } from '../components/ui.jsx'
import { IMG, Avatar } from '../assets.jsx'

const POST_IMGS = [IMG.lib1, IMG.lib2, IMG.lib3, IMG.lib4, IMG.groupMove, IMG.groupProduct]
const LOCATIONS = ['北京·朝阳区', '上海·徐汇区', '成都·锦江区', '杭州·西湖区', '深圳·南山区', '广州·天河区']

const SEED = [
  {
    id: 1, user: { name: 'Luna', av: IMG.luna }, time: '3 分钟前',
    text: '今天终于把“如果三十岁前学会画画”这个 IF 兑现了第一笔——报名了周末水彩班🎨 哪怕一周只画一张也算数！',
    imgs: [IMG.lib1], location: '上海·徐汇区', likes: 128, liked: false,
    comments: [
      { name: 'Mika', av: IMG.mika, text: '冲！期待你的作品', time: '2 分钟前' },
      { name: 'Nono', av: IMG.nono, text: '同 30 岁前清单+1，互相监督', time: '1 分钟前' },
    ],
  },
  {
    id: 2, user: { name: 'Chen', av: IMG.chen }, time: '18 分钟前',
    text: '连续早起第 14 天。原来“如果我能早起”这件事，不是靠意志力，是靠把手机放客厅。',
    likes: 64, liked: true, location: '北京·朝阳区',
    comments: [{ name: 'Rita', av: IMG.rita, text: '这个方法我要试', time: '10 分钟前' }],
  },
  {
    id: 3, user: { name: 'Rita', av: IMG.rita }, time: '1 小时前',
    text: '【数字游民计划】刚到大理第二天，正在咖啡馆一边改简历一边看苍山。原来真的有人在过我想过的生活。',
    imgs: [IMG.lib2], location: '大理', likes: 312, liked: false,
    comments: [
      { name: 'Jay', av: IMG.jay, text: '求路线分享！', time: '40 分钟前' },
      { name: 'Luna', av: IMG.luna, text: '羡慕了，存钱中', time: '32 分钟前' },
    ],
  },
  {
    id: 4, user: { name: 'Jay', av: IMG.jay }, time: '2 小时前',
    text: '“如果我能戒掉拖延”——今天试了 25 分钟番茄钟，居然一口气写完了拖了一周的方案。原来拖延不是懒，是启动门槛太高。',
    likes: 89, liked: false, comments: [],
  },
  {
    id: 5, user: { name: 'Nono', av: IMG.nono }, time: '昨天',
    text: '断舍离第 30 天，扔掉了 47 件东西。最大的收获不是空间变大了，是终于看清自己真正需要什么。',
    imgs: [IMG.lib3], location: '成都·锦江区', likes: 201, liked: false,
    comments: [{ name: 'Chen', av: IMG.chen, text: '求清单', time: '昨天' }],
  },
  {
    id: 6, user: { name: 'Mika', av: IMG.mika }, time: '昨天',
    text: '学会拒绝的第一课：今天跟领导说了“这个我接不了”。手在抖，但说完那一刻轻松得想哭。',
    likes: 456, liked: true, location: '杭州·西湖区',
    comments: [
      { name: 'Rita', av: IMG.rita, text: '抱抱，这是成长', time: '昨天' },
      { name: 'Luna', av: IMG.luna, text: '边界感练习+1', time: '昨天' },
    ],
  },
]

const NEARBY_SEED = [
  {
    id: 101, user: { name: 'Luna', av: IMG.luna }, time: '5 分钟前', dist: '0.8',
    text: '朝阳区画画搭子求组队！周末去 798 写生，有人一起吗🎨',
    imgs: [IMG.lib1], location: '北京·朝阳区', likes: 23, liked: false,
    comments: [{ name: 'Chen', av: IMG.chen, text: '我也在朝阳，加我', time: '3 分钟前' }],
  },
  {
    id: 102, user: { name: 'Chen', av: IMG.chen }, time: '20 分钟前', dist: '1.2',
    text: '国贸附近找个能安静改简历的咖啡馆，求推荐。星巴克太吵了。',
    likes: 12, liked: false, location: '北京·朝阳区',
    comments: [],
  },
  {
    id: 103, user: { name: 'Rita', av: IMG.rita }, time: '40 分钟前', dist: '2.3',
    text: '三里屯夜跑小分队招人，每周二四晚 8 点出发，跑完一起吃夜宵🏃‍♀️',
    imgs: [IMG.lib2], location: '北京·朝阳区', likes: 47, liked: false,
    comments: [{ name: 'Jay', av: IMG.jay, text: '配速多少？', time: '30 分钟前' }],
  },
  {
    id: 104, user: { name: 'Jay', av: IMG.jay }, time: '1 小时前', dist: '3.1',
    text: '望京转租一间主卧，采光超好，离地铁 5 分钟。要的私聊。',
    imgs: [IMG.lib3, IMG.lib4], location: '北京·朝阳区', likes: 88, liked: false,
    comments: [{ name: 'Nono', av: IMG.nono, text: '多少钱？', time: '50 分钟前' }],
  },
]

const FOLLOW_SEED = [
  {
    id: 201, user: { name: 'Nono', av: IMG.nono }, time: '8 分钟前',
    text: '今天读完了《被讨厌的勇气》，终于理解为什么我总在讨好别人——原来“课题分离”不是冷漠，是把别人的期待还给别人。',
    likes: 73, liked: false, location: '成都·锦江区',
    comments: [{ name: 'Luna', av: IMG.luna, text: '这本书我也很爱', time: '5 分钟前' }],
  },
  {
    id: 202, user: { name: 'Jay', av: IMG.jay }, time: '35 分钟前',
    text: '副业第一个月收入到账了，虽然只有 800 块，但比工资开心十倍。原来“为自己赚钱”和“为老板赚钱”是两种完全不同的能量。',
    imgs: [IMG.lib4], likes: 156, liked: true, location: '杭州·西湖区',
    comments: [
      { name: 'Rita', av: IMG.rita, text: '求副业方向分享！', time: '20 分钟前' },
      { name: 'Chen', av: IMG.chen, text: '同感，自由感无价', time: '10 分钟前' },
    ],
  },
  {
    id: 203, user: { name: 'Luna', av: IMG.luna }, time: '2 小时前',
    text: '和互补人格聊了一晚上，它问我：你怕的真的是失败吗，还是怕开始？一句话把我问哭了。',
    likes: 289, liked: false,
    comments: [{ name: 'Mika', av: IMG.mika, text: '被戳中了', time: '1 小时前' }],
  },
  {
    id: 204, user: { name: 'Rita', av: IMG.rita }, time: '昨天',
    text: '学吉他第 7 天，终于能磕磕巴巴弹完一首《成都》了🎸 哪怕每天只练 15 分钟，时间也会替你记账。',
    imgs: [IMG.lib1], location: '上海·徐汇区', likes: 134, liked: false,
    comments: [{ name: 'Jay', av: IMG.jay, text: '求录音！', time: '昨天' }],
  },
]

function ImageGrid({ imgs, onOpen }) {
  if (!imgs || imgs.length === 0) return null
  if (imgs.length === 1) {
    return (
      <button onClick={onOpen} className="pressable mt-2 block w-full">
        <img src={imgs[0]} alt="" className="w-full max-h-[260px] object-cover rounded-xl border border-white/10" />
      </button>
    )
  }
  const cols = imgs.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
  return (
    <div className={`mt-2 grid ${cols} gap-1`}>
      {imgs.slice(0, 9).map((src, i) => (
        <button key={i} onClick={onOpen} className="pressable aspect-square overflow-hidden rounded-md border border-white/10">
          <img src={src} alt="" className="w-full h-full object-cover" />
        </button>
      ))}
    </div>
  )
}

function PostCard({ post, onOpen, onLike, onDismiss, onReport }) {
  const [menu, setMenu] = useState(false)
  const imgs = post.imgs || (post.img ? [post.img] : [])
  return (
    <div className="px-4 py-3.5 border-b border-white/[0.06] relative">
      <div className="flex items-center gap-2.5 mb-2">
        <Avatar src={post.user.av} size={36} ring />
        <div className="flex-1 min-w-0">
          <div className="text-white text-[13px] font-bold">{post.user.name}</div>
          <div className="flex items-center gap-1 text-white/40 text-[10px]">
            <span>{post.time}</span>
            {post.location && <><span>·</span><MapPin size={9} /><span>{post.location}</span></>}
            {post.dist && <><span>·</span><span className="text-[#4fd8e0]">距你 {post.dist}km</span></>}
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setMenu((m) => !m)} className="pressable text-white/40 p-1">
            <MoreHorizontal size={18} />
          </button>
          <AnimatePresence>
            {menu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -6 }} transition={{ duration: 0.14 }}
                  className="absolute right-0 top-8 z-40 w-32 rounded-xl bg-[#262a33] border border-white/15 overflow-hidden shadow-2xl"
                >
                  <button onClick={() => { setMenu(false); onDismiss(post.id) }}
                    className="pressable w-full flex items-center gap-2 px-3 py-2.5 text-left text-white/80 text-[12px] font-medium">
                    <ThumbsDown size={14} /> 不感兴趣
                  </button>
                  <div className="h-px bg-white/[0.06]" />
                  <button onClick={() => { setMenu(false); onReport(post.id) }}
                    className="pressable w-full flex items-center gap-2 px-3 py-2.5 text-left text-[#ff7a7a] text-[12px] font-medium">
                    <Flag size={14} /> 举报
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <button onClick={() => onOpen(post)} className="block w-full text-left">
        <p className="text-white/90 text-[13px] leading-relaxed line-clamp-4">{post.text}</p>
      </button>

      <ImageGrid imgs={imgs} onOpen={() => onOpen(post)} />

      <div className="flex items-center gap-5 mt-3">
        <button onClick={() => onLike(post.id)} className="pressable flex items-center gap-1.5">
          <Heart size={16} color={post.liked ? '#ff5c5c' : '#8a93a3'} fill={post.liked ? '#ff5c5c' : 'none'} />
          <span className={`text-[11px] font-bold ${post.liked ? 'text-[#ff5c5c]' : 'text-white/55'}`}>{post.likes}</span>
        </button>
        <button onClick={() => onOpen(post)} className="pressable flex items-center gap-1.5">
          <MessageCircle size={16} color="#8a93a3" />
          <span className="text-white/55 text-[11px] font-bold">{post.comments.length}</span>
        </button>
        <button className="pressable flex items-center gap-1.5">
          <Share2 size={16} color="#8a93a3" />
          <span className="text-white/55 text-[11px] font-bold">分享</span>
        </button>
      </div>
    </div>
  )
}

function DetailView({ post, onBack, onLike, onComment }) {
  const [text, setText] = useState('')
  const send = () => {
    if (!text.trim()) return
    onComment(post.id, text.trim())
    setText('')
  }
  const imgs = post.imgs || (post.img ? [post.img] : [])
  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col z-30">
      <StatusBar />
      <div className="flex items-center gap-2 h-12 px-3 border-b border-white/[0.06]">
        <button onClick={onBack} className="pressable text-white"><ChevronLeft size={22} /></button>
        <span className="text-white text-[15px] font-bold">帖子详情</span>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2.5 mb-3">
            <Avatar src={post.user.av} size={40} ring />
            <div className="flex-1">
              <div className="text-white text-[14px] font-bold">{post.user.name}</div>
              <div className="flex items-center gap-1 text-white/40 text-[10px]">
                <span>{post.time}</span>
                {post.location && <><span>·</span><MapPin size={9} /><span>{post.location}</span></>}
                {post.dist && <><span>·</span><span className="text-[#4fd8e0]">距你 {post.dist}km</span></>}
              </div>
            </div>
            <button className="pressable px-3 py-1 rounded-full bg-[#D43C33] text-white text-[11px] font-bold">关注</button>
          </div>
          <p className="text-white text-[14px] leading-relaxed whitespace-pre-wrap">{post.text}</p>
          <ImageGrid imgs={imgs} />
          <div className="flex items-center gap-5 mt-4">
            <button onClick={() => onLike(post.id)} className="pressable flex items-center gap-1.5">
              <Heart size={18} color={post.liked ? '#ff5c5c' : '#8a93a3'} fill={post.liked ? '#ff5c5c' : 'none'} />
              <span className={`text-[12px] font-bold ${post.liked ? 'text-[#ff5c5c]' : 'text-white/60'}`}>{post.likes}</span>
            </button>
            <div className="flex items-center gap-1.5">
              <MessageCircle size={18} color="#8a93a3" />
              <span className="text-white/60 text-[12px] font-bold">{post.comments.length}</span>
            </div>
          </div>
        </div>
        <div className="h-px bg-white/[0.06]" />
        <div className="px-4 py-3 font-mono text-[10px] font-extrabold tracking-wider text-white/70">评论 {post.comments.length}</div>
        <div className="px-4 pb-4 flex flex-col gap-3.5">
          {post.comments.length === 0 && <div className="text-white/35 text-[12px] py-6 text-center">还没有评论，来说点什么吧</div>}
          {post.comments.map((c, i) => (
            <div key={i} className="flex gap-2.5">
              <Avatar src={c.av} size={28} />
              <div className="flex-1 min-w-0">
                <div className="text-white text-[12px] font-bold">{c.name}</div>
                <div className="text-white/85 text-[13px] leading-relaxed mt-0.5">{c.text}</div>
                <div className="text-white/35 text-[10px] mt-1">{c.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-3 pb-6 pt-2 border-t border-white/[0.06]">
        <div className="flex items-center gap-2 rounded-full bg-[#242a34] border border-white/25 px-3.5 py-2.5">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="说点什么..." className="w-full bg-transparent outline-none text-white text-[13px] placeholder:text-white/40" />
          <button onClick={send} disabled={!text.trim()}
            className="pressable w-8 h-8 rounded-full bg-[#D43C33] flex items-center justify-center flex-none disabled:opacity-40">
            <SendHorizonal size={14} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============ 全屏发布页（朋友圈式） ============ */
function ComposePage({ onClose, onPublish }) {
  const [text, setText] = useState('')
  const [selected, setSelected] = useState([]) // image urls
  const [location, setLocation] = useState(null)

  const toggleImg = (src) =>
    setSelected((s) => (s.includes(src) ? s.filter((x) => x !== src) : s.length < 9 ? [...s, src] : s))

  const toggleLoc = () =>
    setLocation(location ? null : LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)])

  const publish = () => {
    if (!text.trim() && selected.length === 0) return
    onPublish({ text: text.trim(), imgs: selected, location })
  }

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 320 }}
      className="absolute inset-0 z-50 bg-[#0e1014] flex flex-col"
    >
      <StatusBar />
      {/* top bar */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-white/[0.06]">
        <button onClick={onClose} className="pressable text-white/60 text-[14px]">取消</button>
        <span className="text-white text-[15px] font-black">发表动态</span>
        <button onClick={publish} disabled={!text.trim() && selected.length === 0}
          className={`pressable text-[14px] font-bold px-3 py-1 rounded-full
            ${(text.trim() || selected.length) ? 'bg-[#D43C33] text-white' : 'bg-white/10 text-white/40'}`}>
          发表
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4">
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 1000))}
          placeholder="这一刻的想法..."
          rows={5}
          className="w-full bg-transparent text-white text-[15px] leading-relaxed outline-none placeholder:text-white/30 resize-none"
        />

        {/* selected images grid */}
        {selected.length > 0 && (
          <div className={`mt-1 grid ${selected.length === 1 ? 'grid-cols-1' : 'grid-cols-3'} gap-1.5`}>
            {selected.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} alt="" className={`object-cover rounded-md border border-white/10 ${selected.length === 1 ? 'w-full max-h-[240px]' : 'w-full aspect-square'}`} />
                <button onClick={() => toggleImg(src)}
                  className="pressable absolute -right-1.5 -top-1.5 w-5 h-5 rounded-full bg-[#D43C33] flex items-center justify-center">
                  <X size={11} color="#fff" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* gallery picker */}
        <div className="mt-4">
          <div className="font-mono text-[10px] font-extrabold tracking-wider text-white/50 mb-2">从相册选择</div>
          <div className="grid grid-cols-4 gap-1.5">
            <div className="aspect-square rounded-md border border-dashed border-white/20 flex items-center justify-center text-white/30">
              <Camera size={20} />
            </div>
            {POST_IMGS.map((src) => {
              const on = selected.includes(src)
              const idx = selected.indexOf(src)
              return (
                <button key={src} onClick={() => toggleImg(src)}
                  className={`pressable relative aspect-square rounded-md overflow-hidden border-2 ${on ? 'border-[#D43C33]' : 'border-transparent'}`}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  {on && (
                    <span className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-[#D43C33] text-white text-[9px] font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* location row */}
        <button onClick={toggleLoc}
          className="pressable mt-5 w-full flex items-center justify-between py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <MapPin size={16} color={location ? '#FF8A80' : '#8a93a3'} />
            <span className={`text-[13px] ${location ? 'text-[#FF8A80] font-bold' : 'text-white/60'}`}>
              {location || '所在位置'}
            </span>
          </div>
          <span className="text-white/30 text-[12px]">{location ? '已选' : '选填'}</span>
        </button>

        <div className="text-white/25 text-[10px] font-mono mt-1 text-right">{text.length}/1000</div>
      </div>
    </motion.div>
  )
}

export default function Square({ go, store }) {
  const [tab, setTab] = useState('推荐')
  const [posts, setPosts] = useState(SEED)
  const [follow, setFollow] = useState(FOLLOW_SEED)
  const [nearby, setNearby] = useState(NEARBY_SEED)
  const [detail, setDetail] = useState(null)
  const [composing, setComposing] = useState(false)
  const [toast, setToast] = useState('')

  const ping = (m) => { setToast(m); clearTimeout(ping.t); ping.t = setTimeout(() => setToast(''), 1800) }

  const list = useMemo(() => {
    if (tab === '关注') return follow
    if (tab === '附近') return nearby
    return posts
  }, [tab, posts, follow, nearby])

  const like = (id) => {
    const upd = (p) => p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p
    setPosts((ps) => ps.map(upd))
    setFollow((ps) => ps.map(upd))
    setNearby((ps) => ps.map(upd))
    setDetail((d) => d && d.id === id ? upd(d) : d)
  }

  const comment = (id, text) => {
    const c = { name: store.data.nickname || '我', av: IMG.me, text, time: '刚刚' }
    const upd = (p) => p.id === id ? { ...p, comments: [...p.comments, c] } : p
    setPosts((ps) => ps.map(upd))
    setFollow((ps) => ps.map(upd))
    setNearby((ps) => ps.map(upd))
    setDetail((d) => d && d.id === id ? { ...d, comments: [...d.comments, c] } : d)
  }

  const dismiss = (id) => {
    setPosts((ps) => ps.filter((p) => p.id !== id))
    setFollow((ps) => ps.filter((p) => p.id !== id))
    setNearby((ps) => ps.filter((p) => p.id !== id))
    ping('已减少此类推荐')
  }
  const report = (id) => {
    setPosts((ps) => ps.filter((p) => p.id !== id))
    setFollow((ps) => ps.filter((p) => p.id !== id))
    setNearby((ps) => ps.filter((p) => p.id !== id))
    ping('举报已提交，我们会尽快处理')
  }

  const publish = (draft) => {
    const p = {
      id: Date.now(),
      user: { name: store.data.nickname || '我', av: IMG.me },
      time: '刚刚',
      text: draft.text || (draft.imgs.length ? '分享图片' : ''),
      imgs: draft.imgs,
      location: draft.location,
      likes: 0, liked: false, comments: [],
    }
    setPosts((ps) => [p, ...ps])
    setComposing(false)
    setTab('推荐')
  }

  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col overflow-hidden">
      <StatusBar />
      {/* header + tabs */}
      <div className="flex items-center justify-between px-4 h-12">
        <div className="flex items-center gap-5">
          {['推荐', '关注', '附近'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className="pressable relative pb-1.5">
              <span className={`text-[15px] ${tab === t ? 'text-white font-black' : 'text-white/45 font-medium'}`}>{t}</span>
              {tab === t && (
                <motion.div layoutId="sq-tab"
                  className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#D43C33]" />
              )}
            </button>
          ))}
        </div>
        <button className="pressable"><Search size={20} color="#AEB5C2" /></button>
      </div>

      {/* feed */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.2 }}
          >
            {tab !== '推荐' && (
              <div className="px-4 pt-2 pb-1 font-mono text-[10px] font-extrabold tracking-[2px] text-white/55">
                {tab === '关注' ? '你关注的人' : `附近 · ${list.length} 条动态`}
              </div>
            )}
            {list.length === 0 && (
              <div className="py-16 text-center text-white/35 text-[12px]">
                {tab === '关注' ? '还没有关注的人，去广场发现更多' : tab === '附近' ? '附近暂无动态' : '这里还没有内容，去发布第一条吧'}
              </div>
            )}
            {list.map((p) => (
              <PostCard key={p.id} post={p} onOpen={setDetail} onLike={like} onDismiss={dismiss} onReport={report} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* floating compose button */}
      <button
        onClick={() => setComposing(true)}
        className="pressable absolute right-4 bottom-24 z-30 w-12 h-12 rounded-full flex items-center justify-center
          bg-[#D43C33] border border-white/30 shadow-[0_8px_28px_rgba(212,60,51,0.5)]"
      >
        <Plus size={24} color="#fff" strokeWidth={2.4} />
      </button>

      <BottomNav active="square" onTab={(t) => go(t)} />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-28 z-50 px-4 py-2 rounded-full bg-[#2a2e38]/95 border border-white/20 text-white text-[11px] font-semibold shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {composing && <ComposePage onClose={() => setComposing(false)} onPublish={publish} />}
      </AnimatePresence>

      <AnimatePresence>
        {detail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30">
            <DetailView
              post={posts.find((p) => p.id === detail.id) || follow.find((p) => p.id === detail.id) || nearby.find((p) => p.id === detail.id) || detail}
              onBack={() => setDetail(null)} onLike={like} onComment={comment}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
