<div align="center">

# IF — Parallel Persona App

**A social matching app where you bring your "what if" to life** — set up a parallel persona, pick the topics that matter, and get matched with people on the same frequency.

[![Live Demo](https://img.shields.io/badge/React%20App-Live%20Demo-ef4444?style=flat-square&logo=github)](https://mlbb229229-create.github.io/ifab/)
[![HTML Prototypes](https://img.shields.io/badge/HTML%20Prototypes-16%20Screens-e11d48?style=flat-square&logo=html5)](https://mlbb229229-create.github.io/ifab/prototypes/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

**Dark cosmic UI · red accents · phone-first**

</div>

---

## ✨ Try It Live

| | |
|---|---|
| **📱 [16 HTML Prototypes](https://mlbb229229-create.github.io/ifab/prototypes/)** | Hand-coded standalone HTML/CSS/JS screens — click any card to play with it. **This is the vibe-coding showcase.** |
| **⚛️ [React App Demo](https://mlbb229229-create.github.io/ifab/)** | The productized version: full navigation, global state, animations, matching flow. |

---

## 1. HTML Prototypes — Built at Conversation Speed

This whole UI started as Pencil design specs and was coded into **16 clickable, standalone HTML screens** in a single vibe-coding session — no build step, open the file and it runs. Every screen has working micro-interactions: phone login, verification-code flow, persona creation, a star-field home, chat screens, an intimacy meter, a decision assistant and more.

The gallery page ([`prototypes/index.html`](prototypes/index.html)) live-previews all 16 screens in phone frames:

<div align="center">

| | | | |
|---|---|---|---|
| [![01 guide](docs/screenshots/01-guide.png)](prototypes/01-guide.html) | [![02 login](docs/screenshots/02-login.png)](prototypes/02-login.html) | [![03 login modal](docs/screenshots/login-modal.png)](prototypes/login-modal.html) | [![04 phone login](docs/screenshots/phone-login.png)](prototypes/phone-login.html) |
| **01 · Onboarding** | **02 · Login & Sign-up** | **03 · Login Modal** | **04 · Phone Login** |
| [![05 verification](docs/screenshots/verification.png)](prototypes/verification.html) | [![06 profile](docs/screenshots/03-profile.png)](prototypes/03-profile.html) | [![07 create persona](docs/screenshots/04-create-persona.png)](prototypes/04-create-persona.html) | [![08 onboarding](docs/screenshots/06-onboarding.png)](prototypes/06-onboarding.html) |
| **05 · Verification Code** | **06 · Profile Setup** | **07 · Create Persona** | **08 · First-run Onboarding** |
| [![09 home](docs/screenshots/07-home.png)](prototypes/07-home.html) | [![10 intimacy](docs/screenshots/intimacy.png)](prototypes/intimacy.html) | [![11 ip settings](docs/screenshots/ip-settings.png)](prototypes/ip-settings.html) | [![12 decision](docs/screenshots/08-decision.png)](prototypes/08-decision.html) |
| **09 · Home · Star Sea** | **10 · Intimacy Meter** | **11 · IP Settings** | **12 · Decision Assistant** |
| [![13 group chat](docs/screenshots/group-chat.png)](prototypes/group-chat.html) | [![14 persona chat](docs/screenshots/persona-chat.png)](prototypes/persona-chat.html) | [![15 messages](docs/screenshots/messages.png)](prototypes/messages.html) | [![16 tag filter](docs/screenshots/messages-filter.png)](prototypes/messages-filter.html) |
| **13 · Group Chat** | **14 · Persona Chat** | **15 · Messages** | **16 · Messages · Tag Filter** |

</div>

> **Vibe coding, defined:** AI-assisted development where design intent turns into working UI in conversation, not in sprints. Design spec → clickable prototype → production app, all in the same day.

---

## 2. From Prototype to Product — The React App

The prototypes were productized into a full **React 18 + Vite 6** mobile-first app with real state, routing, and animation — not a mock.

<div align="center">
<img src="docs/screenshots/react-home.png" width="220" alt="React app home — IF gravity field" />
</div>

### Core Features

- **IF Gravity Field (星海)** — the home screen. Your "what-if" tags orbit the center "IF" star; tag distance encodes relevance, with an inertia-based drag, multi-select, and a live matching CTA. A custom **relevance scoring engine** ranks tags by keyword groups.
- **IF Goal Management** — create, track, and complete "IF" goals with progress sliders, completion states, and auto-suggested group chats per topic.
- **Square (广场)** — a feed with Recommended / Following / Nearby tabs, post composer with multi-image picker (up to 9), geo-tags, and post detail with comments.
- **Matching Overlay** — a full-screen radar-scan → particle-burst match animation with a compatibility score.
- **Messaging** — parallel-persona chat, group chat, and one-on-one chat, with a tag-filter drawer.
- **Intimacy System** — a rising intimacy meter unlocked through tasks, feeding back into the match experience.
- **Decision Assistant** — your second persona helps you reason through real decisions.
- **History-stack navigation** — push/pop routing with `framer-motion` transitions; all `back` buttons return to the true previous screen.

### Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18, Vite 6 |
| Styling | Tailwind CSS 3, custom CSS animations (rAF-driven star field) |
| Motion | framer-motion |
| Icons | lucide-react |
| State | Lightweight custom store (context) + data layer (`src/data/ifs.js`) |

---

## Repo Structure

```
.
├── prototypes/            # 16 standalone HTML demos — start at prototypes/index.html
├── src/
│   ├── screens/           # 16 app screens (Home, Square, Messages, Me, IF system…)
│   ├── components/        # MatchOverlay, shared UI
│   ├── data/ifs.js        # IF goals, topic pools, relevance scoring
│   └── App.jsx            # history-stack navigation + screen registry
├── docs/screenshots/      # screenshots used in this README
├── public/assets/         # static images
└── .github/workflows/     # GitHub Pages deployment (build → deploy)
```

## Getting Started

```bash
npm install
npm run dev       # start dev server
npm run build     # production build → dist/
```

The HTML prototypes need no setup — just open [`prototypes/index.html`](prototypes/index.html) in any browser (or browse them on the live gallery).

## Deployment

GitHub Actions builds the React app and bundles the HTML prototypes into the Pages site on every push to `main`:

- App → `https://mlbb229229-create.github.io/ifab/`
- Prototype gallery → `https://mlbb229229-create.github.io/ifab/prototypes/`
