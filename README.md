# PULSE ⚡
**Vibe-Coded Solana SuperApp**

> Describe what you want. Watch it appear. Pay with Solana.

## The Vision

PULSE is a hackathon project for the **NOAH.AI Solana Vibe Coding Hackathon**. It's both:

1. **A Vibe-Coded Build Tool** — Describe an app in plain English, get working code
2. **A Reference SuperApp** — Pre-built demo showcasing the tool's capabilities

## Live Demo

**🌐 https://pulse-superapp.vercel.app**

Connect your Phantom wallet to:
- View your SOL balance
- Send SOL to any wallet
- Describe an app and generate code with Vibe Code

## Tech Stack

| Layer | Choice |
|-------|-------|
| Frontend | React + Vite + TypeScript |
| Payments | Solana Pay |
| Wallet | Phantom (via Web3.js) |
| AI | Claude API (vibe coding) |
| Deployment | Vercel |

## Quick Start

```bash
# Clone and install
npm install

# Dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── App.tsx       # Main app with wallet + vibe code
├── App.css       # Styles
├── main.tsx      # Entry with buffer polyfill
└── vite-env.d.ts # Type declarations
```

## Vibe Coding Workflow

```
1. User types a description
2. AI parses intent → generates React code
3. Code displayed with copy button
4. User deploys to Vercel/Netlify
```

## Hackathon Pitch

**"Build in 60 Seconds"** — Live demo showing:
1. Connect Phantom wallet
2. Describe a DeFi app
3. Get working code instantly
4. Deploy and share

## Links

- **Hackathon**: NOAH.AI Solana Vibe Coding Hackathon 2026
- **autoskills**: https://github.com/midudev/autoskills
- **Solana Docs**: https://docs.solanapay.com

---

*Built with ⚡ by Ted & Rig — 2026*
