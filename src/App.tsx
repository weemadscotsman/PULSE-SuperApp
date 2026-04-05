import { useState, useEffect } from 'react'
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js'
import { XRWorld } from './XRWorld'
import './App.css'
import './xr.css'

// Constants
const SOLANA_NETWORK = 'devnet'
const CONNECTION = new Connection(`https://api.${SOLANA_NETWORK}.solana.com`, 'confirmed')
const MINIMAX_API = 'https://api.minimax.io/v1/text/chatcompletion_pro'
const MINIMAX_KEY = import.meta.env.VITE_MINIMAX_KEY || ''

type View = 'pulse' | 'finance' | 'vibe' | 'xr'

// MiniMax Vibe Code AI
async function vibeCodeAI(prompt: string): Promise<string> {
  if (!MINIMAX_KEY) {
    throw new Error('No API key')
  }
  
  try {
    const response = await fetch(MINIMAX_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MINIMAX_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7',
        bot_setting: [{
          bot_name: 'PULSE',
          content: 'You are PULSE Vibe Engine - an expert React/Solana developer. Generate complete, working React TypeScript component code based on user descriptions. Output ONLY the raw code, NO markdown blocks, NO backticks, NO explanations. The code must be valid JSX with proper imports and an exported default function.'
        }],
        reply_constraints: { output_language: 'English' },
        messages: [{
          sender_type: 'user',
          sender_name: 'PULSE',
          text: `Generate a complete working React TypeScript component for: ${prompt}. 
          
Requirements:
- Must be valid TypeScript JSX  
- Use @solana/web3.js for any Solana logic
- Include useState hooks
- Include a complete return with JSX UI
- Make it actually functional
- Export as default function
- Keep it under 80 lines
- NO markdown, NO backticks, pure raw code only`
        }]
      })
    })
    
    const data = await response.json()
    let code = data.choices?.[0]?.messages?.[0]?.text || ''
    
    // Clean up any markdown artifacts
    code = code.replace(/```tsx?\n?/g, '').replace(/```\n?$/g, '').trim()
    
    if (!code) throw new Error('Empty response')
    return code
  } catch (e) {
    console.error('Vibe code failed:', e)
    throw e
  }
}

function App() {
  const [view, setView] = useState<View>('pulse')
  const [connected, setConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [txSig, setTxSig] = useState<string | null>(null)
  const [vibePrompt, setVibePrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [vibeLoading, setVibeLoading] = useState(false)
  const [vibeError, setVibeError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [swapAmount, setSwapAmount] = useState('')
  const [swapLoading, setSwapLoading] = useState(false)
  const [swapSuccess, setSwapSuccess] = useState(false)

  // Wallet detection
  useEffect(() => {
    const checkWallet = async () => {
      if ('solana' in window) {
        const solana = (window as any).solana
        if (solana?.isPhantom) {
          try {
            const response = await solana.connect({ onlyIfTrusted: true })
            const pubKey = response.publicKey.toString()
            setWalletAddress(pubKey)
            setConnected(true)
            await fetchBalance(pubKey)
          } catch (e) {
            console.log('No trusted connection')
          }
        }
      }
    }
    checkWallet()
  }, [])

  const fetchBalance = async (address: string) => {
    try {
      const pubKey = new PublicKey(address)
      const bal = await CONNECTION.getBalance(pubKey)
      setBalance(bal / LAMPORTS_PER_SOL)
    } catch (e) {
      console.error('Balance error:', e)
    }
  }

  const connectWallet = async () => {
    if ('solana' in window) {
      const solana = (window as any).solana
      if (solana?.isPhantom) {
        try {
          const response = await solana.connect()
          const pubKey = response.publicKey.toString()
          setWalletAddress(pubKey)
          setConnected(true)
          await fetchBalance(pubKey)
        } catch (e) {
          console.error('Connection error:', e)
        }
      } else {
        alert('Phantom wallet not found!')
      }
    } else {
      alert('Install Phantom from phantom.app')
    }
  }

  const disconnectWallet = () => {
    if ('solana' in window) {
      (window as any).solana.disconnect()
    }
    setConnected(false)
    setWalletAddress(null)
    setBalance(0)
  }

  const sendSol = async () => {
    if (!connected || !walletAddress) return
    if (!recipient || !amount) return

    try {
      const fromPubKey = new PublicKey(walletAddress)
      const toPubKey = new PublicKey(recipient)
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromPubKey,
          toPubkey: toPubKey,
          lamports,
        })
      )

      const solana = (window as any).solana
      const { blockhash } = await CONNECTION.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = fromPubKey

      const signed = await solana.signAndSendTransaction(transaction)
      setTxSig(signed)
      alert(`Sent ${amount} SOL!`)
      await fetchBalance(walletAddress)
      setRecipient('')
      setAmount('')
    } catch (e) {
      console.error('Send error:', e)
      alert('Transaction failed!')
    }
  }

  const handleVibeCode = async () => {
    if (!vibePrompt.trim()) return
    setVibeLoading(true)
    setVibeError(null)
    setGeneratedCode(null)
    
    try {
      const code = await vibeCodeAI(vibePrompt)
      setGeneratedCode(code)
    } catch (e) {
      setVibeError('Vibe engine overloaded. Try again!')
    } finally {
      setVibeLoading(false)
    }
  }

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSwap = async () => {
    if (!swapAmount) return
    setSwapLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    setSwapLoading(false)
    setSwapSuccess(true)
    setTimeout(() => setSwapSuccess(false), 3000)
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">PULSE ⚡</div>
        <nav className="nav">
          <button className={view === 'pulse' ? 'active' : ''} onClick={() => setView('pulse')}>💰 Wallet</button>
          <button className={view === 'finance' ? 'active' : ''} onClick={() => setView('finance')}>📊 Finance</button>
          <button className={view === 'vibe' ? 'active' : ''} onClick={() => setView('vibe')}>✨ Vibe</button>
          <button className={view === 'xr' ? 'active' : ''} onClick={() => setView('xr')}>🥽 XR</button>
        </nav>
      </header>

      <main className="main">
        {/* WALLET VIEW */}
        {view === 'pulse' && (
          <div className="pulse-view">
            <h1>Solana SuperApp</h1>
            <p className="tagline">Build fast. Pay instant. Vibes only.</p>

            {!connected ? (
              <div className="connect-section">
                <button className="connect-btn" onClick={connectWallet}>
                  <span>👻</span> Connect Phantom
                </button>
                <p className="hint">Hackathon Demo — devnet only</p>
              </div>
            ) : (
              <div className="wallet-connected">
                <div className="wallet-card">
                  <div className="wallet-icon-lg">👻</div>
                  <div className="wallet-info">
                    <p className="wallet-label">Connected</p>
                    <p className="wallet-address">{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</p>
                    <p className="wallet-balance">{balance.toFixed(4)} SOL</p>
                  </div>
                  <button className="disconnect-btn" onClick={disconnectWallet}>✕</button>
                </div>

                <div className="send-form">
                  <h2>Send SOL</h2>
                  <input type="text" placeholder="Recipient address" value={recipient} onChange={e => setRecipient(e.target.value)} className="input" />
                  <input type="number" placeholder="Amount (SOL)" value={amount} onChange={e => setAmount(e.target.value)} className="input" step="0.01" min="0" />
                  <button className="send-btn" onClick={sendSol}>Send ⚡</button>
                  {txSig && <p className="tx-success">✓ Sent! {txSig.slice(0, 20)}...</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FINANCE VIEW */}
        {view === 'finance' && (
          <div className="finance-view">
            <h1>📊 PULSE Finance</h1>
            <p className="tagline">DeFi made simple. Vibe-coded in 60 seconds.</p>

            <div className="finance-grid">
              {/* Portfolio Card */}
              <div className="finance-card">
                <h3>💼 Portfolio</h3>
                <div className="stat-row">
                  <span>Total Value</span>
                  <span className="stat-value">$24,892.44</span>
                </div>
                <div className="stat-row">
                  <span>SOL</span>
                  <span>18.44 × $42.18 = $777.69</span>
                </div>
                <div className="stat-row">
                  <span>USDC</span>
                  <span>$12,440.00</span>
                </div>
                <div className="stat-row">
                  <span>BONK</span>
                  <span>125M × $0.000019 = $2,375</span>
                </div>
                <div className="stat-row profit">
                  <span>24h Change</span>
                  <span>+14.32% ↑</span>
                </div>
              </div>

              {/* Swap Card */}
              <div className="finance-card">
                <h3>⚡ Instant Swap</h3>
                <div className="swap-box">
                  <div className="swap-input-group">
                    <label>From</label>
                    <div className="token-input">
                      <span className="token-icon">SOL</span>
                      <input type="number" placeholder="0.0" value={swapAmount} onChange={e => setSwapAmount(e.target.value)} />
                    </div>
                  </div>
                  <div className="swap-arrow">↓</div>
                  <div className="swap-input-group">
                    <label>To</label>
                    <div className="token-input">
                      <span className="token-icon">USDC</span>
                      <input type="number" placeholder="0.0" readOnly value={swapAmount ? (parseFloat(swapAmount) * 42.18).toFixed(2) : '0.00'} />
                    </div>
                  </div>
                  <button className="swap-btn" onClick={handleSwap} disabled={swapLoading || !swapAmount}>
                    {swapLoading ? 'Swapping...' : swapSuccess ? '✓ Swapped!' : 'Swap ⚡'}
                  </button>
                </div>
                <p className="swap-hint">Rate: 1 SOL = $42.18 USDC</p>
              </div>

              {/* Trending */}
              <div className="finance-card">
                <h3>🔥 Trending</h3>
                <div className="token-row">
                  <span className="token-name">BONK</span>
                  <span className="token-price">$0.000019</span>
                  <span className="token-change green">+8.2%</span>
                </div>
                <div className="token-row">
                  <span className="token-name">WIF</span>
                  <span className="token-price">$2.84</span>
                  <span className="token-change green">+12.4%</span>
                </div>
                <div className="token-row">
                  <span className="token-name">POPCAT</span>
                  <span className="token-price">$0.873</span>
                  <span className="token-change red">-3.1%</span>
                </div>
                <div className="token-row">
                  <span className="token-name">SOL</span>
                  <span className="token-price">$42.18</span>
                  <span className="token-change green">+5.7%</span>
                </div>
              </div>

              {/* Activity */}
              <div className="finance-card">
                <h3>📜 Activity</h3>
                <div className="activity-item">
                  <span className="activity-icon">⚡</span>
                  <div>
                    <p className="activity-desc">Swap SOL → USDC</p>
                    <p className="activity-time">2 mins ago</p>
                  </div>
                  <span className="activity-amount green">+$42.18</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">📥</span>
                  <div>
                    <p className="activity-desc">Received SOL</p>
                    <p className="activity-time">1 hour ago</p>
                  </div>
                  <span className="activity-amount green">+5.0 SOL</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">📤</span>
                  <div>
                    <p className="activity-desc">Sent USDC</p>
                    <p className="activity-time">3 hours ago</p>
                  </div>
                  <span className="activity-amount red">-$200.00</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIBE CODE VIEW */}
        {view === 'vibe' && (
          <div className="vibe-view">
            <h1>✨ Vibe Code</h1>
            <p className="tagline">Describe your app. Watch it appear in 60 seconds.</p>

            <div className="vibe-interface">
              <textarea
                className="vibe-input"
                placeholder="Describe your app... e.g., 'A DeFi dashboard with token swaps, portfolio tracker, and NFT gallery'"
                value={vibePrompt}
                onChange={e => setVibePrompt(e.target.value)}
                rows={4}
              />
              <button className="vibe-btn" onClick={handleVibeCode} disabled={vibeLoading}>
                {vibeLoading ? (
                  <span>⚡ Vibe coding... <span className="spin">⟳</span></span>
                ) : (
                  <span>Generate App ✨</span>
                )}
              </button>

              {vibeError && <p className="vibe-error">{vibeError}</p>}

              {vibeLoading && (
                <div className="vibe-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" />
                  </div>
                  <p>Analyzing vibe... Building components... Compiling magic... ✨</p>
                </div>
              )}

              {generatedCode && (
                <div className="code-output">
                  <div className="code-header">
                    <span>Generated Code</span>
                    <button className="copy-btn" onClick={copyCode}>{copied ? '✓ Copied!' : '📋 Copy'}</button>
                  </div>
                  <pre className="code-block">{generatedCode}</pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* XR VIEW */}
        {view === 'xr' && (
          <div className="xr-view">
            <h1>🥽 XR World</h1>
            <p className="tagline">AR • VR • XR — Your imagination is the limit</p>
            <XRWorld />
          </div>
        )}
      </main>

      <footer className="footer">
        <p>PULSE ⚡ Vibe-coded on Solana | Powered by AI</p>
        <p className="hackathon">NOAH.AI Solana Hackathon 2026</p>
      </footer>
    </div>
  )
}

export default App
