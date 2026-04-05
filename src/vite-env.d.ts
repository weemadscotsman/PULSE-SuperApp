/// <reference types="vite/client" />

interface Window {
  solana?: {
    isPhantom?: boolean
    connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>
    disconnect: () => Promise<void>
    signAndSendTransaction: (transaction: any) => Promise<string>
    signTransaction: (transaction: any) => Promise<any>
  }
  Buffer: typeof globalThis.Buffer
}
