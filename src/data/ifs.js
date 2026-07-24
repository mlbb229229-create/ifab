/* IF 想法：数据模型 + 推荐池 + 关键词分类 */

export const CYCLES = ['30 天', '60 天', '90 天', '长期']

let _uid = 100
export const uid = () => ++_uid

/* 种子数据（3 进行中 + 1 已完成） */
export const SEED_IFS = [
  {
    id: 1,
    ifText: '每天下班后还有精力',
    want: '坚持健身打卡 30 天',
    cycle: '30 天',
    progress: 64,
    status: 'active',
    createdAt: '2026-06-22',
  },
  {
    id: 2,
    ifText: '月底不再月光',
    want: '存下工资的 30%',
    cycle: '90 天',
    progress: 30,
    status: 'active',
    createdAt: '2026-07-05',
  },
  {
    id: 3,
    ifText: '周末不再焦虑',
    want: '完成一次短途旅行',
    cycle: '60 天',
    progress: 10,
    status: 'active',
    createdAt: '2026-07-14',
  },
  {
    id: 4,
    ifText: '每天早起一小时',
    want: '读完《被讨厌的勇气》',
    cycle: '30 天',
    progress: 100,
    status: 'done',
    createdAt: '2026-05-08',
    finishedAt: '2026-06-08',
  },
]

/* 按主题分类的群聊推荐池（复用 Home 风格字段） */
export const GROUP_POOL = {
  fit: [
    { name: '30 天健身打卡 · 互相监督群', match: 96, tags: '打卡/增肌/自律', online: 58 },
    { name: '下班充电 · 精力管理小组', match: 91, tags: '作息/精力/习惯', online: 44 },
    { name: '跑步搭子 · 每周三次夜跑', match: 87, tags: '跑步/同城/组队', online: 72 },
  ],
  money: [
    { name: '理财入门 · 记账打卡群', match: 95, tags: '预算/存钱/复利', online: 36 },
    { name: '消费克制 · 30天不乱买小组', match: 89, tags: '习惯/记录/复盘', online: 87 },
    { name: '投资基础 · 小白互助大群', match: 83, tags: '风险/配置/心态', online: 129 },
  ],
  career: [
    { name: '升职加薪 · 目标拆解打卡群', match: 97, tags: '目标/复盘/执行', online: 68 },
    { name: '转行 AI · 学习互助群', match: 92, tags: '学习/转行/项目', online: 95 },
    { name: '工作效率 · 专注番茄钟组队', match: 91, tags: '专注/节奏/习惯', online: 75 },
  ],
  emotion: [
    { name: '情绪复盘 · 睡前十分钟', match: 94, tags: '复盘/表达/自愈', online: 39 },
    { name: '焦虑互助 · 不内耗练习室', match: 90, tags: '松弛/正念/陪伴', online: 51 },
    { name: '周末出逃计划 · 短途旅行组队', match: 88, tags: '旅行/同城/放松', online: 63 },
  ],
  growth: [
    { name: '早起读书 · 一页也是进步', match: 93, tags: '阅读/早起/打卡', online: 47 },
    { name: '副业探索 · 从 0 到 1 小组', match: 89, tags: '副业/搞钱/实战', online: 108 },
    { name: '英语口语 · 每天开口说', match: 85, tags: '口语/陪练/坚持', online: 54 },
  ],
}

/* 关键词 → 分类 */
const KEYWORDS = [
  { cat: 'fit', words: ['健身', '运动', '跑', '减脂', '瘦', '瑜伽', '打卡', '精力', '睡', '早起', '早睡'] },
  { cat: 'money', words: ['存', '钱', '工资', '月光', '理财', '记账', '消费', '买', '副业', '搞钱', '入过万'] },
  { cat: 'career', words: ['工作', '升职', '加薪', '转行', '跳槽', '汇报', '面试', '考公', '考研', 'AI', '效率'] },
  { cat: 'emotion', words: ['焦虑', '情绪', '内耗', '分手', '自愈', '旅行', '烦恼', '拒绝', '安全感', '冥想', '复盘'] },
  { cat: 'growth', words: ['读', '书', '学习', '英语', '摄影', '吉他', '写作', '早起'] },
]

/* 根据 ifText + want 推断推荐群聊 */
export function groupsFor(item) {
  const text = `${item.ifText} ${item.want || ''}`
  let cat = 'growth'
  for (const k of KEYWORDS) {
    if (k.words.some((w) => text.includes(w))) { cat = k.cat; break }
  }
  return GROUP_POOL[cat]
}

/* 推荐的同频用户池（详情页匹配用，与 Home 的 RECOMMENDED 结构一致） */
export const PEER_POOL = [
  { name: 'Luna', fit: 96, km: '1.2km', online: true },
  { name: 'Mika', fit: 92, km: '3.8km' },
  { name: 'Nono', fit: 88, km: '0.6km', online: true },
  { name: 'Chen', fit: 85, km: '5.4km', online: true },
  { name: 'Rita', fit: 81, km: '2.0km' },
  { name: 'Jay', fit: 79, km: '8.1km', online: true },
]
