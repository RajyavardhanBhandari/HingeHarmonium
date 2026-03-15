# 🎹 Hinge Harmonium

> **Your MacBook lid is an instrument.**

Hinge Harmonium is a web-based musical instrument that reads your MacBook's lid angle using the DeviceOrientation API and plays harmonium-like drone notes — controlled entirely by how you open and close your laptop.

**Hold a key. Move your lid. Make music.**

---

## ✨ How It Works

A real harmonium has two parts working together — **keys** that open reeds, and **bellows** that push air through them. No air, no sound.

Hinge Harmonium mirrors this exactly:

| Action | Effect |
|--------|--------|
| Hold a key `A` – `N` | Opens that reed — selects the note |
| Open / close your lid | Pumps air through the bellows → controls volume |
| Stop moving the lid | Air pressure decays → sound fades out |
| Release the key | Reed closes → silence |

No key + no lid movement = silence. Just like the real thing.

---

## 🎵 Note Map

| Key | Note | Key | Note | Key | Note |
|-----|------|-----|------|-----|------|
| `A` | C2 | `H` | C3 | `X` | C4 |
| `S` | D2 | `J` | D3 | `C` | D4 |
| `D` | E2 | `K` | E3 | `V` | E4 |
| `F` | G2 | `L` | G3 | `B` | G4 |
| `G` | A2 | `Z` | A3 | `N` | A4 |

Pentatonic scale — C2 to A4 across 15 notes.

---

## 🔧 Tech Stack

- **Next.js 14** — App Router, TypeScript
- **Web Audio API** — 3 detuned oscillators (sawtooth + 2× square) per note, synthetic reverb via ConvolverNode
- **DeviceOrientation API** — lid angle sensor with iOS permission flow
- **Framer Motion** — lid spring animation, key press, note transitions
- **Tailwind CSS** — vintage mahogany + brass design system

---

## 🖥️ Platform Support

| Platform | Behaviour |
|----------|-----------|
| MacBook (Safari / Chrome) | Full lid angle sensor — open/close lid to pump air |
| iPhone / iPad | DeviceOrientation with permission prompt |
| Windows / Linux | Mouse Y-axis fallback — move cursor up/down to pump air |

> **Windows users:** Even convertible / 2-in-1 laptops don't expose hinge angle to the browser — mouse fallback activates automatically. For the physical feel, open the site on your **iPhone or iPad** and tilt the device instead — iOS passes orientation data to the browser just like a MacBook lid.

> **Note:** The lid sensor requires HTTPS. It works automatically on Vercel — not on plain `localhost`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Run Locally

```bash
git clone https://github.com/RajyavardhanBhandari/HingeHarmonium.git
cd HingeHarmonium
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — sensor won't work locally (needs HTTPS), but mouse fallback will.

### Build for Production

```bash
npm run build
npm start
```

---

## ☁️ Deploy on Vercel

The easiest way to deploy:

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import repo
3. Click **Deploy** — no environment variables needed

Live URL will be something like `hinge-harmonium.vercel.app`

HTTPS is provided automatically by Vercel, which enables the lid sensor on MacBook.

---

## 📁 Project Structure

```
hinge-harmonium/
├── app/
│   ├── globals.css          # Design system — CSS variables, wood-grain texture
│   ├── layout.tsx           # Root layout with Google Fonts
│   └── page.tsx             # Entry point — wraps app in LidAngleProvider
├── components/
│   ├── PermissionGate.tsx   # Landing screen — sensor permission flow
│   ├── HarmoniumPlayer.tsx  # Main instrument layout
│   ├── LaptopVisualizer.tsx # Animated SVG laptop with spring lid
│   ├── KeyboardStrip.tsx    # 15 decorative harmonium keys
│   └── BellowsIndicator.tsx # Animated bellows driven by air pressure
├── hooks/
│   ├── useLidAngle.ts       # DeviceOrientation hook + mouse fallback
│   └── useHarmonium.ts      # Web Audio API — oscillators, reverb, bellows
├── lib/
│   └── LidAngleContext.tsx  # React context so sensor runs once
├── next.config.js
├── tailwind.config.js
└── vercel.json
```

---

## 🎨 Design

Vintage Indian harmonium aesthetic — warm mahogany backgrounds, brass accents, ivory keys. Fonts: **Playfair Display** (headings) + **Crimson Text** (body).

The bellows SVG expands and glows in real time as air pressure builds. The laptop SVG lid rotates on a spring to mirror your actual laptop.

---

## 👨‍💻 Developer

**Rajyavardhan Bhandari**
Founder & CEO — [WebGravity Consulting Pvt. Ltd.](https://www.thewebgravity.com)

WebGravity is a next-generation digital agency based in Dehradun, India — blending creativity, strategy, and AI-powered precision to help brands grow smarter. Services include web development, digital marketing, branding, SEO, PPC, and AI automation.

- 🔗 LinkedIn: [linkedin.com/in/rajyavardhan-bhandari](https://www.linkedin.com/in/rajyavardhan-bhandari/)
- 🌐 Company: [thewebgravity.com](https://www.thewebgravity.com)
- 🐦 Twitter / X: [@thewebgravity](https://x.com/thewebgravity)
- 📸 Instagram: [@rajyavardhanbhandari](https://www.instagram.com/rajyavardhanbhandari/)

> *Final year CS student specialising in DevOps · LinkedIn Top Entrepreneurship Voice · Public Speaker · Builder's Bias*

---

## 📄 License

MIT — free to use, modify and deploy. Credit appreciated.

---

<p align="center">
  Made with 🎵 and a MacBook hinge &nbsp;·&nbsp; <a href="https://www.thewebgravity.com">WebGravity Consulting Pvt. Ltd.</a>
</p>