import { useState, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { create } from 'zustand'

// ============================================
// XR STORE
// ============================================
interface XRState {
  mode: 'ar' | 'vr' | 'xr'
  xrPrompt: string
  setMode: (m: 'ar' | 'vr' | 'xr') => void
  setXrPrompt: (p: string) => void
}

export const useXRStore = create<XRState>((set) => ({
  mode: 'xr',
  xrPrompt: '',
  setMode: (mode) => set({ mode }),
  setXrPrompt: (xrPrompt) => set({ xrPrompt }),
}))

// ============================================
// SCENE COMPONENTS
// ============================================

function FloatingIsland({ position = [0, -2, 0] }: { position?: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <dodecahedronGeometry args={[1.5, 0]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.8} metalness={0.2} />
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.8, 2, 8]} />
        <meshStandardMaterial color="#00ffa3" emissive="#00ffa3" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.3, 0.3, 0.8]} rotation={[0.2, 0, 0.1]}>
        <coneGeometry args={[0.4, 1.2, 6]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.3} />
      </mesh>
    </mesh>
  )
}

function NeonParticles({ count = 200 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = new THREE.Object3D()
  
  const particles = useRef(
    Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ),
      speed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ),
      scale: Math.random() * 0.1 + 0.05,
    }))
  )

  useFrame(() => {
    if (!mesh.current) return
    particles.current.forEach((particle, i) => {
      particle.position.add(particle.speed)
      if (Math.abs(particle.position.x) > 10) particle.speed.x *= -1
      if (Math.abs(particle.position.y) > 10) particle.speed.y *= -1
      if (Math.abs(particle.position.z) > 10) particle.speed.z *= -1
      dummy.position.copy(particle.position)
      dummy.scale.setScalar(particle.scale)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial
        color="#ff00ff"
        emissive="#ff00ff"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </instancedMesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ffa3" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <NeonParticles count={300} />
      
      <FloatingIsland position={[0, -2, 0]} />
      <FloatingIsland position={[-5, -1, -5]} />
      <FloatingIsland position={[5, 0, -7]} />
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={50}
      />
    </>
  )
}

// ============================================
// MAIN XR COMPONENT
// ============================================
export function XRWorld() {
  const { mode, xrPrompt, setXrPrompt, setMode } = useXRStore()
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!xrPrompt.trim()) return
    setGenerating(true)
    // Simulate AI generation
    await new Promise(r => setTimeout(r, 2000))
    setGenerating(false)
  }

  const handleEnterVR = () => {
    if ('xr' in navigator) {
      ;(navigator as any).xr.requestSession('immersive-vr').then((session: any) => {
        console.log('VR session started', session)
      }).catch((err: any) => {
        console.error('VR not supported', err)
      })
    }
  }

  return (
    <div className="xr-container">
      {/* Mode Switcher */}
      <div className="xr-mode-switcher">
        <button
          className={`mode-btn ${mode === 'ar' ? 'active' : ''}`}
          onClick={() => setMode('ar')}
        >
          📱 AR
        </button>
        <button
          className={`mode-btn ${mode === 'vr' ? 'active' : ''}`}
          onClick={() => setMode('vr')}
        >
          🥽 VR
        </button>
        <button
          className={`mode-btn ${mode === 'xr' ? 'active' : ''}`}
          onClick={() => setMode('xr')}
        >
          🌐 XR
        </button>
      </div>

      {/* Canvas */}
      <div className="xr-canvas-wrapper">
        <Canvas
          camera={{ position: [0, 2, 8], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Vibe Code Input */}
      <div className="xr-vibe-panel">
        <h3>✨ Vibe Code Your World</h3>
        <textarea
          className="xr-input"
          placeholder="Describe your XR world... e.g. 'A cyberpunk city with neon signs and floating islands'"
          value={xrPrompt}
          onChange={(e) => setXrPrompt(e.target.value)}
          rows={3}
        />
        <button className="xr-generate-btn" onClick={handleGenerate} disabled={generating}>
          {generating ? '✨ Generating...' : '✨ Generate World'}
        </button>
        <p className="xr-hint">
          {mode === 'vr' && '🥽 Put on your VR headset to explore'}
          {mode === 'ar' && '📱 Point your camera at the world'}
          {mode === 'xr' && '🌐 Drag to orbit • Scroll to zoom'}
        </p>
        {mode === 'vr' && (
          <button className="xr-enter-vr-btn" onClick={handleEnterVR}>
            🥽 Enter VR
          </button>
        )}
      </div>
    </div>
  )
}

export default XRWorld
