import React from 'react'
import { motion } from 'framer-motion'
import { StatusBar, GradientButton } from '../components/ui.jsx'

const PARTICLES = [
  { x: 32, y: 58, s: 5, o: 0.9, d: 0 },
  { x: 58, y: 128, s: 2, o: 0.65, d: 0.6 },
  { x: 88, y: 26, s: 2, o: 0.35, d: 1.2 },
  { x: 204, y: 28, s: 2, o: 0.55, d: 0.3 },
  { x: 284, y: 78, s: 2, o: 0.45, d: 1.6 },
  { x: 300, y: 146, s: 3, o: 0.3, d: 0.9 },
  { x: 22, y: 170, s: 2, o: 0.42, d: 2.1 },
  { x: 132, y: 198, s: 2, o: 0.45, d: 1.4 },
  { x: 248, y: 190, s: 2, o: 0.45, d: 0.2 },
  { x: 170, y: 14, s: 2, o: 0.52, d: 1.9 },
]

export default function Onboarding({ go, replace }) {
  return (
    <div className="absolute inset-0 bg-black flex flex-col overflow-hidden">
      <StatusBar />

      {/* hero nebula */}
      <div className="relative mx-auto mt-6 w-[327px] h-[300px] anim-float">
        {/* orbit rings */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[356px] h-[356px] rounded-full border-[0.5px] border-[#FF2A2A]/10" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[312px] h-[312px] rounded-full border-[0.5px] border-white/10" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[197px] h-[197px] rounded-full border border-[#FF9497]/60" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[268px] h-[268px] rounded-full border border-[#FF3B3F]/20 anim-spin-slow" />

        {/* crosshair */}
        <div className="absolute left-[16px] top-1/2 w-[295px] h-px bg-[linear-gradient(90deg,transparent,#FF7B8460,transparent)]" />
        <div className="absolute top-[16px] left-1/2 h-[260px] w-px bg-[linear-gradient(180deg,transparent,#FFA2A750,transparent)]" />

        {/* nebula clouds */}
        <div className="absolute -left-14 -top-12 w-[274px] h-[274px] rounded-full opacity-50 blur-2xl bg-[radial-gradient(circle,#FF1E1ECC_0%,#7F070733_55%,transparent_100%)]" />
        <div className="absolute right-0 bottom-0 w-[240px] h-[240px] rounded-full opacity-75 blur-2xl bg-[radial-gradient(circle,#FF2A2AFF_0%,#C4121255_35%,transparent_100%)]" />

        {/* core planet */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[178px] h-[178px] rounded-full anim-pulse-glow
          bg-[radial-gradient(circle,#FFFFFFFF_0%,#FF3B3BBB_28%,#DC262633_62%,transparent_100%)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[25px] h-[25px] rounded-full
          bg-[radial-gradient(circle,#FFE4E4FF_0%,#FF2A2AEE_25%,#B4000033_70%,transparent_100%)]" />

        {/* particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="star"
            style={{ left: p.x, top: p.y, width: p.s, height: p.s, opacity: p.o, animationDelay: `${p.d}s` }}
          />
        ))}
      </div>

      {/* copy */}
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="mt-8 text-center text-white text-[52px] font-black tracking-[6px] text-glow"
      >
        如果
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="mt-2 text-center text-[#F4F4F5] text-[14px] font-semibold"
      >
        构建你的第二人格模型
      </motion.p>

      {/* divider ornament */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="w-[118px] h-px bg-[linear-gradient(90deg,transparent,#FF3F4D82)]" />
        <div className="w-2 h-2 rotate-45 bg-[linear-gradient(135deg,#FF9A9A,#C40000)]" />
        <div className="w-[118px] h-px bg-[linear-gradient(90deg,#FF3F4D82,transparent)]" />
      </div>

      {/* CTA */}
      <div className="px-6 mt-8">
        <GradientButton className="w-full h-[52px]" onClick={() => go('login')}>
          进入IF宇宙&nbsp;&gt;
        </GradientButton>
        <button
          onClick={() => replace('home')}
          className="pressable mx-auto mt-4 flex items-center gap-1 text-[11px] font-bold"
        >
          <span className="text-[#BEBFC8]">我已了解原理 · </span>
          <span className="text-[#FF7A93] font-extrabold">跳过</span>
        </button>
      </div>

      {/* bottom planet horizon */}
      <div className="pointer-events-none absolute -bottom-[860px] left-1/2 -translate-x-1/2 w-[1100px] h-[1000px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{
              border: '1px solid rgba(255,100,111,' + (0.35 - i * 0.06) + ')',
              transform: `scale(${1 + i * 0.035}) translateY(${i * -8}px)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
