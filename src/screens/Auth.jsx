import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, X } from 'lucide-react'
import { StatusBar, Checkbox } from '../components/ui.jsx'

/* ============ 首次登录弹窗（微信一键登录） ============ */
export function LoginModal({ go, onClose }) {
  const [agree, setAgree] = useState(false)
  const [shake, setShake] = useState(0)
  const wechat = () => {
    if (!agree) { setShake((s) => s + 1); return }
    go('profile')
  }
  return (
    <motion.div className="absolute inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-[#0c0c0e]/85 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        key={shake}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1, x: shake ? [0, -8, 8, -5, 5, 0] : 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        className="absolute left-6 right-6 top-[300px] rounded-[14px] bg-[#2a2929] border border-white/10 p-6 overflow-hidden"
      >
        <div className="pointer-events-none absolute left-3 top-2 right-3 h-16 rounded-[26px] opacity-25
          bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.06)_60%,transparent)]" />
        <button
          onClick={onClose}
          className="pressable absolute right-4 top-4 w-7 h-7 rounded-full bg-[#242a34]/80 border border-white/30 flex items-center justify-center"
        >
          <X size={14} color="#fff" />
        </button>
        <div className="text-white text-[18px] font-black tracking-[4px] mb-1">IF</div>
        <div className="text-white/50 text-[11px] mb-5">登录以同步你的平行宇宙</div>
        <button
          onClick={wechat}
          className="pressable w-full h-[54px] rounded-[10px] bg-[#D43C33] border border-white/30 text-white text-[14px] font-black"
        >
          微信一键登录
        </button>
        <div className="mt-4 flex items-center gap-2">
          <Checkbox checked={agree} onChange={() => setAgree(!agree)} />
          <span className="text-white text-[11px] font-bold">
            我已阅读并同意<span className="text-[#FF8A80]">《用户协议》</span><span className="text-[#FF8A80]">《隐私政策》</span>
          </span>
        </div>
        {!agree && shake > 0 && (
          <div className="mt-2 text-[11px] text-[#FF7A93] font-semibold">请先勾选同意协议</div>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ============ 02 登录注册（手机号 + 验证码，含 Tab 切换） ============ */
export function PhoneLogin({ go, back }) {
  const [tab, setTab] = useState('login')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [count, setCount] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (count <= 0) return
    const t = setTimeout(() => setCount((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [count])

  const sendCode = () => {
    if (!/^1\d{10}$/.test(phone)) { setError('手机号错误，请检查后重试'); return }
    setError('')
    setCount(60)
  }
  const submit = () => {
    if (!/^1\d{10}$/.test(phone)) { setError('手机号错误，请检查后重试'); return }
    if (code.length < 4) { setError('请输入正确的验证码'); return }
    go('verification', { phone })
  }

  return (
    <div className="absolute inset-0 bg-[#141416] flex flex-col">
      <StatusBar />
      <div className="flex items-center justify-between px-4 h-10">
        <button onClick={back} className="pressable text-white p-1 -ml-1">
          <ChevronLeft size={22} />
        </button>
        <span className="text-white/70 text-[13px]">帮助</span>
      </div>

      <div className="px-5 pt-2 flex flex-col gap-5">
        <div>
          <div className="grad-title font-mono text-[22px] font-extrabold tracking-wider">
            {tab === 'login' ? '进入并行实验' : '创建并行身份'}
          </div>
          <p className="mt-2 text-white/60 text-[13px]">用手机号验证身份 · 数据加密存储</p>
        </div>

        {/* tabs */}
        <div className="relative flex h-12 rounded-[28px] border border-white/30 p-1 gap-2">
          {['login', 'register'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative flex-1 rounded-[24px] overflow-hidden"
            >
              {tab === t && (
                <motion.span
                  layoutId="auth-tab"
                  className="absolute inset-0 rounded-[24px] bg-[linear-gradient(90deg,#8FE2DE,#6BD4E8)] border border-white/40"
                  transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                />
              )}
              <span className={`relative z-10 font-mono text-[11px] tracking-[2px] font-semibold ${tab === t ? 'text-[#0b2b33]' : 'text-white/80'}`}>
                {t === 'login' ? '登录' : '注册'}
              </span>
            </button>
          ))}
        </div>

        {/* form */}
        <div className="flex flex-col gap-3.5">
          <label className="font-mono text-[10px] tracking-[2px] text-white/70">手机号</label>
          <div className="h-[52px] rounded-xl border border-white/40 bg-white/[0.06] px-3.5 flex items-center focus-within:border-[#6BD4E8] transition-colors">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder="+86 · 请输入手机号"
              inputMode="numeric"
              className="w-full bg-transparent outline-none text-white text-[15px] placeholder:text-white/35"
            />
          </div>
          <label className="font-mono text-[10px] tracking-[2px] text-white/70">验证码</label>
          <div className="h-[52px] rounded-xl border border-white/40 bg-white/[0.06] px-3.5 flex items-center justify-between focus-within:border-[#6BD4E8] transition-colors">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6 位数字"
              inputMode="numeric"
              className="w-full bg-transparent outline-none text-white text-[15px] placeholder:text-white/35"
            />
            <button
              onClick={sendCode}
              disabled={count > 0}
              className={`font-mono text-[11px] tracking-wider flex-none pl-3 ${count > 0 ? 'text-white/35' : 'text-[#8FE2DE]'}`}
            >
              {count > 0 ? `${count}s` : '获取'}
            </button>
          </div>
          {error && <div className="text-[#D43C33] text-[12px] font-bold">{error}</div>}
        </div>

        <button
          onClick={submit}
          className="pressable h-[46px] rounded-[23px] bg-[#D43C33] border border-white/30 text-white text-[15px] font-extrabold shadow-[0_8px_28px_rgba(212,60,51,0.35)]"
        >
          继续
        </button>
        <p className="text-center text-white/40 text-[11px] leading-relaxed">
          继续即表示同意《用户协议》与《隐私政策》
        </p>
      </div>
    </div>
  )
}

/* ============ 验证码（6 位） ============ */
export function Verification({ go, back, params }) {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState(false)
  const refs = useRef([])
  const phone = params?.phone || '138****1234'
  const masked = phone.length === 11 ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : phone

  const setDigit = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = d
    setDigits(next)
    setError(false)
    if (d && i < 5) refs.current[i + 1]?.focus()
    if (d && i === 5 && next.every((x) => x)) refs.current[5]?.blur()
  }
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
  }
  const done = digits.every((d) => d)

  const submit = () => {
    if (!done) { setError(true); return }
    go('profile')
  }

  return (
    <div className="absolute inset-0 bg-[#141416]">
      <StatusBar />
      <div className="flex items-center px-4 h-10">
        <button onClick={back} className="pressable text-white p-1 -ml-1">
          <ChevronLeft size={22} />
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-6 mt-14 rounded-[14px] bg-[#2a2929] border border-white/10 p-6 relative overflow-hidden"
      >
        <div className="pointer-events-none absolute left-3 top-2 right-3 h-[90px] rounded-[20px] opacity-20
          bg-[linear-gradient(180deg,rgba(255,255,255,0.19),rgba(255,255,255,0.06)_60%,transparent)]" />
        <div className="text-white text-[13px] font-bold mb-1.5">
          验证码已发送至 <span className="font-mono">{masked}</span>
        </div>
        <div className="text-white/45 text-[11px] mb-5">输入短信中的 6 位数字</div>

        <div className="flex justify-center gap-2.5 mb-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              value={d}
              inputMode="numeric"
              maxLength={1}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              className={`w-[42px] h-[52px] rounded-lg border text-center text-white text-[20px] font-black bg-[#1c212a] outline-none transition-colors
                ${error ? 'border-[#D43C33]' : d ? 'border-[#FF8A80]' : 'border-white/40 focus:border-[#FF8A80]'}`}
            />
          ))}
        </div>
        {error && <div className="text-[#D43C33] text-[12px] font-bold text-center mb-1">验证码错误，请重试</div>}

        <button
          onClick={submit}
          disabled={!done}
          className="pressable mt-4 w-full h-[54px] rounded-[10px] bg-[#D43C33] border border-white/30 text-white text-[14px] font-black disabled:opacity-40"
        >
          进入
        </button>
        <button className="pressable mt-3 w-full text-center text-white/45 text-[11px] font-semibold">
          收不到验证码？<span className="text-[#FF8A80]">重新发送</span>
        </button>
      </motion.div>
    </div>
  )
}
