import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced spice jar component with better materials and visibility
const SpiceJar = ({ position, color, label }: { position: [number, number, number], color: string, label: string }) => {
  const jarRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (jarRef.current) {
      jarRef.current.rotation.y += 0.005;
      jarRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.05;
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
      {/* Jar body - glass material with rim lighting */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.8, 32]} />
        <meshPhysicalMaterial 
          color="#1a1a1a" 
          transparent 
          opacity={0.7}
          transmission={0.3}
          roughness={0.1}
          metalness={0.1}
          emissive="#4FC3F7"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Spice content with emissive glow */}
      <mesh position={[0, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.6, 32]} />
        <meshPhysicalMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      
      {/* Lid with metallic material */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.1, 32]} />
        <meshPhysicalMaterial 
          color="#2a2a2a" 
          metalness={0.8}
          roughness={0.2}
          emissive="#4FC3F7"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Label ring */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.05, 32]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={0.2}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>
      
      {/* Floating label */}
      {hovered && (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.1}>
          <Text
            position={[0, 1, 0]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#4FC3F7"
            font-family="Orbitron"
          >
            {label}
          </Text>
        </Float>
      )}

      {/* Particle effect around jar */}
      {hovered && Array.from({ length: 8 }, (_, i) => (
        <Float key={i} speed={3} rotationIntensity={1} floatIntensity={0.5}>
          <mesh position={[
            Math.cos(i * Math.PI / 4) * 0.5,
            Math.random() * 0.5 + 0.2,
            Math.sin(i * Math.PI / 4) * 0.5
          ]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshPhysicalMaterial 
              color={color} 
              emissive={color}
              emissiveIntensity={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// Enhanced floating particle with glow effect
const FloatingParticle = ({ position, color }: { position: [number, number, number], color: string }) => {
  const particleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (particleRef.current) {
      particleRef.current.rotation.x += 0.02;
      particleRef.current.rotation.y += 0.03;
      particleRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.3;
      particleRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.8 + position[2]) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
      <mesh ref={particleRef} position={position}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshPhysicalMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
};

const SpiceScene3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [0, 2, 5], fov: 50 }} 
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.2} color="#4FC3F7" />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.5} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[5, 5, 5]} intensity={1} color="#4FC3F7" />
        <pointLight position={[-5, 3, -3]} intensity={0.8} color="#E65100" />
        <pointLight position={[0, 8, 0]} intensity={1.2} color="#FFB74D" />
        
        {/* Rim lighting */}
        <spotLight 
          position={[0, 0, 8]} 
          intensity={2} 
          angle={Math.PI / 3} 
          penumbra={0.5} 
          color="#4FC3F7"
        />

        {/* Enhanced Spice Jars */}
        <SpiceJar position={[-2.5, 0, 0]} color="#E65100" label="PAPRIKA" />
        <SpiceJar position={[0, 0, -1]} color="#FFB74D" label="TURMERIC" />
        <SpiceJar position={[2.5, 0, 0]} color="#8BC34A" label="CARDAMOM" />
        <SpiceJar position={[-1.2, 0, 2]} color="#D32F2F" label="CHILI" />
        <SpiceJar position={[1.2, 0, 2]} color="#FFC107" label="SAFFRON" />

        {/* Enhanced floating particles */}
        {Array.from({ length: 20 }, (_, i) => (
          <FloatingParticle
            key={i}
            position={[
              (Math.random() - 0.5) * 8,
              Math.random() * 4 + 1,
              (Math.random() - 0.5) * 8
            ]}
            color={['#E65100', '#FFB74D', '#8BC34A', '#D32F2F', '#FFC107'][Math.floor(Math.random() * 5)]}
          />
        ))}

        {/* Main title with futuristic styling */}
        <Float speed={1} rotationIntensity={0.3} floatIntensity={0.2}>
          <Text
            position={[0, 3.5, 0]}
            fontSize={1}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#4FC3F7"
            font-family="Orbitron"
          >
            SPICE BAZAAR
          </Text>
        </Float>

        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.15}>
          <Text
            position={[0, 2.8, 0]}
            fontSize={0.35}
            color="#4FC3F7"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#ffffff"
            font-family="Exo 2"
          >
            KAZAKHSTAN
          </Text>
        </Float>

        {/* Floor plane for shadows */}
        <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshPhysicalMaterial 
            color="#0a0a0a" 
            transparent 
            opacity={0.3}
            roughness={1}
            metalness={0}
          />
        </mesh>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
};

export default SpiceScene3D;