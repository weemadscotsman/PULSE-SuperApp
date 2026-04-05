# PULSE ⚡ — Vibe-Coded Solana SuperApp

> **Build DeFi apps in 60 seconds with AI.** PULSE is a vibe-coded Solana SuperApp featuring AI-powered app generation, real wallet connect, and immersive XR worlds.

![PULSE](https://img.shields.io/badge/Solana-Devnet-00ffa3?style=for-the-badge&logo=solana)
![AI](https://img.shields.io/badge/AI-Powered-ff00ff?style=for-the-badge&logo=openai)
![XR](https://img.shields.io/badge/XR-Immersive-00d4ff?style=for-the-badge&logo=immersive)

## 🎯 What is PULSE?

PULSE is a hackathon submission for the **NOAH.AI Solana Hackathon 2026**. It demonstrates:

1. **✨ Vibe Code** — Describe any DeFi app in plain English, watch AI generate it in real-time
2. **💰 Solana Wallet** — Connect Phantom, send SOL on devnet
3. **📊 PULSE Finance** — Working DeFi dashboard with portfolio, swaps, trending tokens, activity
4. **🥽 XR World** — Immersive 3D floating islands with WebXR support

## 🚀 Live Demo

```
https://pulse-superapp.vercel.app
```

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Blockchain | Solana Web3.js + Phantom Wallet |
| AI | MiniMax M2.7 (vibe code generation) |
| 3D/XR | Three.js + WebXR |
| Styling | Custom CSS (dark gradient theme) |
| Deployment | Vercel |

## 💡 The Vibe Coding Pitch

> "What if building DeFi apps was as easy as describing what you want?"

PULSE's vibe engine takes natural language descriptions and generates working React components in real-time. No templates. No boilerplate. Just describe it and watch it appear.

### Example Prompts

- "A DeFi dashboard with token swaps and portfolio tracker"
- "A meme coin tracker with price alerts"
- "An NFT gallery with floor prices"
- "A staking calculator with APY projections"

## 📱 Features

### 💰 Wallet View
- Phantom wallet connection
- SOL balance display
- Send SOL to any address
- Devnet only (hackathon demo)

### 📊 Finance View (PULSE Finance)
- **Portfolio Tracker** — Track SOL, USDC, BONK holdings with real-time values
- **Instant Swap** — Mock SOL → USDC swap with loading animation
- **Trending Tokens** — BONK, WIF, POPCAT, SOL with price changes
- **Activity Feed** — Recent transactions with timestamps

### ✨ Vibe Code
- Natural language app generation
- AI-powered code creation
- Copy-to-clipboard functionality
- Loading animation with progress bar

### 🥽 XR World
- Floating islands with neon particles
- WebXR immersive mode
- AR/VR/XR mode switcher
- Animated star field

## 🎬 Demo Script (3 Minutes)

### Minute 1: The Problem
"DeFi is powerful but complex. Building even simple apps requires weeks of coding. What if I told you..."

### Minute 2: The Solution - PULSE
"Presenting PULSE — the vibe-coded Solana SuperApp. I built this entire DeFi dashboard in under 60 seconds using our vibe engine."

**[Show Finance tab]**
"Portfolio tracking, instant swaps, trending tokens, activity feed — all vibe-coded."

### Minute 3: The Technical Innovation
"PULSE uses AI code generation backed by MiniMax, runs on Solana devnet with Phantom wallet connect, and includes an immersive XR world built with Three.js."

**[Show XR tab]**
"3D floating islands. WebXR ready. This is the future of DeFi interfaces."

**"PULSE — Build fast. Pay instant. Vibes only."**

## 🔧 Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
PULSE-SuperApp-web/
├── src/
│   ├── App.tsx          # Main app with all views
│   ├── App.css          # Main styles
│   ├── xr.css           # XR/Three.js styles
│   ├── XRWorld.tsx      # Three.js immersive world
│   ├── main.tsx         # Entry point
│   └── index.css        # Global reset + fonts
├── index.html           # HTML template
├── package.json
├── vite.config.ts
└── .env                 # VITE_MINIMAX_KEY
```

## 🧪 Vibe Code API

The vibe engine connects to MiniMax API:

```typescript
POST https://api.minimax.io/v1/text/chatcompletion_pro
Model: MiniMax-M2.7
```

Prompts are structured to output raw JSX code without markdown formatting.

## 👨‍💻 Author

**Edward Cannon** — Solo builder, chaos architect, vibe coding evangelist.

Built in one night for the NOAH.AI Solana Hackathon 2026.

## 📜 License

MIT — Build on this, don't steal it.

---

**PULSE ⚡ — Vibe-coded on Solana | Powered by AI | NOAH.AI Hackathon 2026**
