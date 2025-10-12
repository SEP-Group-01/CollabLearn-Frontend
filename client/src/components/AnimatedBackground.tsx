import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import * as THREE from 'three'
import { motion } from 'framer-motion'

function Wave({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) {
  const meshRef = useRef<Mesh>(null!)
  
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, 32, 32)
    const positions = geo.attributes.position.array as Float32Array
    
    // Create wave pattern
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      positions[i + 2] = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.5
    }
    
    geo.attributes.position.needsUpdate = true
    return geo
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() * speed
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i]
        const y = positions[i + 1]
        positions[i + 2] = Math.sin(x * 0.1 + time) * Math.cos(y * 0.1 + time * 0.5) * 0.8
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true
      meshRef.current.rotation.z += 0.002
    }
  })

  return (
    <mesh ref={meshRef} position={position} geometry={geometry}>
      <meshPhongMaterial 
        color={color} 
        transparent 
        opacity={0.1}
        wireframe={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function FloatingOrb({ position, color, size }: { position: [number, number, number], color: string, size: number }) {
  const meshRef = useRef<Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      meshRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.5
      meshRef.current.position.x = position[0] + Math.cos(time * 0.6) * 0.3
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.005
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshPhongMaterial 
        color={color} 
        transparent 
        opacity={0.06}
        emissive={color}
        emissiveIntensity={0.02}
      />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#6366f1" />
      
      {/* Multiple wave layers */}
      <Wave position={[0, 0, -8]} color="#e0e7ff" speed={0.5} />
      <Wave position={[0, 0, -6]} color="#c7d2fe" speed={0.3} />
      <Wave position={[0, 0, -4]} color="#a5b4fc" speed={0.7} />
      
      {/* Floating orbs */}
      <FloatingOrb position={[-8, 2, -2]} color="#6366f1" size={0.8} />
      <FloatingOrb position={[6, -3, -1]} color="#8b5cf6" size={0.6} />
      <FloatingOrb position={[-4, -2, -3]} color="#06b6d4" size={0.4} />
      <FloatingOrb position={[8, 4, -2]} color="#10b981" size={0.5} />
      <FloatingOrb position={[2, 6, -4]} color="#f59e0b" size={0.3} />
    </>
  )
}

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Base gradient background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-indigo-50"
      />
      
      {/* Animated gradient overlay */}
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.03) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0"
      />
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20"
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight
              ],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>
      
      {/* Subtle grid pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.02 }}
        transition={{ duration: 3, delay: 1 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  )
}

export default AnimatedBackground