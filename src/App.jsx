import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Onboarding from './screens/Onboarding.jsx'
import { LoginModal, PhoneLogin, Verification } from './screens/Auth.jsx'
import ProfileSetup from './screens/ProfileSetup.jsx'
import CreatePersona from './screens/CreatePersona.jsx'
import FirstIf from './screens/FirstIf.jsx'
import Home from './screens/Home.jsx'
import Square from './screens/Square.jsx'
import Messages from './screens/Messages.jsx'
import { PersonaChat, GroupChat, DmChat } from './screens/Chats.jsx'
import Decision from './screens/Decision.jsx'
import Intimacy from './screens/Intimacy.jsx'
import IpSettings from './screens/IpSettings.jsx'
import Me from './screens/Me.jsx'
import IfList from './screens/IfList.jsx'
import IfEdit from './screens/IfEdit.jsx'
import IfDetail from './screens/IfDetail.jsx'
import { SEED_IFS, uid } from './data/ifs.js'

const SCREENS = {
  onboarding: Onboarding,
  'phone-login': PhoneLogin,
  verification: Verification,
  profile: ProfileSetup,
  'create-persona': CreatePersona,
  'first-if': FirstIf,
  home: Home,
  square: Square,
  messages: Messages,
  'persona-chat': PersonaChat,
  'group-chat': GroupChat,
  'user-chat': DmChat,
  decision: Decision,
  intimacy: Intimacy,
  me: Me,
  'ip-settings': IpSettings,
  ifs: IfList,
  'if-edit': IfEdit,
  'if-detail': IfDetail,
}

export default function App() {
  // navigation history stack — back() pops to the real previous screen
  const [history, setHistory] = useState([{ name: 'onboarding', params: {} }])
  const [showLogin, setShowLogin] = useState(false)
  const [data, setData] = useState({
    nickname: '',
    gender: '',
    birthday: '',
    personaName: '',
    traits: [],
    firstIf: null,
  })
  const [ifs, setIfs] = useState(SEED_IFS)

  const store = useMemo(
    () => ({
      data,
      set: (patch) => setData((d) => ({ ...d, ...patch })),
      ifs,
      ifActions: {
        add: (item) =>
          setIfs((l) => [{ id: uid(), status: 'active', progress: 0, ...item }, ...l]),
        update: (id, patch) =>
          setIfs((l) => l.map((it) => (it.id === id ? { ...it, ...patch } : it))),
        toggleDone: (id) =>
          setIfs((l) =>
            l.map((it) =>
              it.id === id
                ? it.status === 'done'
                  ? { ...it, status: 'active', progress: Math.min(it.progress, 99) }
                  : { ...it, status: 'done', progress: 100, finishedAt: new Date().toISOString().slice(0, 10) }
                : it
            )
          ),
        setProgress: (id, p) =>
          setIfs((l) =>
            l.map((it) =>
              it.id === id
                ? { ...it, progress: p, status: p >= 100 ? 'done' : it.status === 'done' ? 'active' : it.status }
                : it
            )
          ),
        remove: (id) => setIfs((l) => l.filter((it) => it.id !== id)),
      },
    }),
    [data, ifs]
  )

  const screen = history[history.length - 1]
  const [navAnim, setNavAnim] = useState(null) // 'slide' | null

  const go = (name, params = {}) => {
    if (name === 'login') { setShowLogin(true); return }
    // only animate when entering 'ifs' from the tag
    setNavAnim(name === 'ifs' ? 'slide' : null)
    setHistory((h) => {
      const top = h[h.length - 1]
      // avoid pushing the exact same screen twice
      if (top && top.name === name && JSON.stringify(top.params || {}) === JSON.stringify(params || {})) return h
      return [...h, { name, params }]
    })
  }
  // replace top of stack (used for terminal flows that shouldn't be backed into)
  const replace = (name, params = {}) => {
    setNavAnim(null)
    setHistory((h) => [...h.slice(0, -1), { name, params }])
  }
  // go back to the real previous screen
  const back = () => {
    setNavAnim(null)
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h))
  }

  const Active = SCREENS[screen.name] || Onboarding

  return (
    <div className="stage">
      <div className="phone">
        <AnimatePresence initial={false}>
          <motion.div
            key={screen.name + (history.length)}
            initial={navAnim === 'slide' ? { x: '100%' } : false}
            animate={{ x: 0 }}
            exit={navAnim === 'slide' ? { x: '-25%' } : { opacity: 0 }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 z-10"
          >
            <Active go={go} replace={replace} back={back} params={screen.params} store={store} />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showLogin && (
            <LoginModal go={(n, p) => { setShowLogin(false); go(n, p) }} onClose={() => setShowLogin(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
