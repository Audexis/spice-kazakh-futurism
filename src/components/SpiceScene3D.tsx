import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

// Simple spice jar component
const SpiceJar = ({ position, color, label }: { position: [number, number, number], color: string, label: string }) => {
  const jarRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (jarRef.current) {
      jarRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group
      ref={jarRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      {/* Jar body */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.35, 0.8, 16]} />
        <meshPhongMaterial color="#2a2a2a" transparent opacity={0.8} />
      </mesh>
      
      {/* Spice content */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.6, 16]} />
        <meshPhongMaterial color={color} />
      </mesh>
      
      {/* Lid */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.1, 16]} />
        <meshPhongMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
};

// Simple floating particle
const FloatingParticle = ({ position, color }: { position: [number, number, number], color: string }) => {
  const particleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (particleRef.current) {
      particleRef.current.rotation.x += 0.01;
      particleRef.current.rotation.y += 0.015;
      particleRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
    }
  });

  return (
    <mesh ref={particleRef} position={position}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshPhongMaterial color={color} />
    </mesh>
  );
};

const SpiceScene3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#4FC3F7" />
        <pointLight position={[-10, 5, -10]} intensity={0.8} color="#E65100" />
        <spotLight position={[0, 10, 0]} intensity={1.5} angle={0.3} penumbra={1} color="#FFB74D" />

        {/* Spice Jars */}
        <SpiceJar position={[-2, 0, 0]} color="#E65100" label="Paprika" />
        <SpiceJar position={[0, 0, -1]} color="#FFB74D" label="Turmeric" />
        <SpiceJar position={[2, 0, 0]} color="#8BC34A" label="Cardamom" />

        {/* Floating particles */}
        {Array.from({ length: 10 }, (_, i) => (
          <FloatingParticle
            key={i}
            position={[
              (Math.random() - 0.5) * 6,
              Math.random() * 3 + 1,
              (Math.random() - 0.5) * 6
            ]}
            color={['#E65100', '#FFB74D', '#8BC34A'][Math.floor(Math.random() * 3)]}
          />
        ))}

        {/* Simple 3D text using mesh */}
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.3}>
          <group position={[0, 3, 0]}>
            <mesh>
              <boxGeometry args={[3, 0.5, 0.1]} />
              <meshPhongMaterial color="#ffffff" />
            </mesh>
          </group>
        </Float>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default SpiceScene3D;