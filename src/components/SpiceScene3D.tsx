import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Environment, useTexture, Sphere, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import anime from 'animejs';

// Individual spice components
const SpiceJar = ({ position, color, label, delay = 0 }: { position: [number, number, number], color: string, label: string, delay?: number }) => {
  const jarRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (jarRef.current) {
      jarRef.current.rotation.y += 0.005;
      jarRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.1;
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
      <Cylinder args={[0.3, 0.35, 0.8, 16]} position={[0, 0, 0]}>
        <meshPhongMaterial color="#2a2a2a" transparent opacity={0.8} />
      </Cylinder>
      
      {/* Spice content */}
      <Cylinder args={[0.25, 0.3, 0.6, 16]} position={[0, -0.05, 0]}>
        <meshPhongMaterial color={color} />
      </Cylinder>
      
      {/* Lid */}
      <Cylinder args={[0.32, 0.32, 0.1, 16]} position={[0, 0.45, 0]}>
        <meshPhongMaterial color="#1a1a1a" />
      </Cylinder>
      
      {/* Floating label */}
      {hovered && (
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

const FloatingSpice = ({ position, color, shape = 'sphere' }: { position: [number, number, number], color: string, shape?: 'sphere' | 'box' }) => {
  const spiceRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (spiceRef.current) {
      spiceRef.current.rotation.x += 0.01;
      spiceRef.current.rotation.y += 0.015;
      spiceRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
      spiceRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      {shape === 'sphere' ? (
        <Sphere ref={spiceRef} args={[0.05]} position={position}>
          <meshPhongMaterial color={color} shininess={100} />
        </Sphere>
      ) : (
        <Box ref={spiceRef} args={[0.08, 0.08, 0.08]} position={position}>
          <meshPhongMaterial color={color} shininess={50} />
        </Box>
      )}
    </Float>
  );
};

const SpiceScene3D = () => {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sceneRef.current) {
      anime({
        targets: sceneRef.current,
        opacity: [0, 1],
        duration: 2000,
        easing: 'easeOutQuart'
      });
    }
  }, []);

  return (
    <div ref={sceneRef} className="w-full h-full opacity-0">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <Environment preset="night" />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#4FC3F7" />
        <pointLight position={[-10, 5, -10]} intensity={0.8} color="#E65100" />
        <spotLight position={[0, 10, 0]} intensity={1.5} angle={0.3} penumbra={1} color="#FFB74D" />

        {/* Spice Jars */}
        <SpiceJar position={[-2, 0, 0]} color="#E65100" label="Paprika" delay={0} />
        <SpiceJar position={[0, 0, -1]} color="#FFB74D" label="Turmeric" delay={1} />
        <SpiceJar position={[2, 0, 0]} color="#8BC34A" label="Cardamom" delay={2} />
        <SpiceJar position={[-1, 0, 2]} color="#D32F2F" label="Chili" delay={3} />
        <SpiceJar position={[1, 0, 2]} color="#FFC107" label="Saffron" delay={4} />

        {/* Floating spice particles */}
        {Array.from({ length: 30 }, (_, i) => (
          <FloatingSpice
            key={i}
            position={[
              (Math.random() - 0.5) * 8,
              Math.random() * 4 + 1,
              (Math.random() - 0.5) * 8
            ]}
            color={[
              '#E65100', '#FFB74D', '#8BC34A', '#D32F2F', '#FFC107', 
              '#FF9800', '#4CAF50', '#FF5722', '#FFEB3B'
            ][Math.floor(Math.random() * 9)]}
            shape={Math.random() > 0.5 ? 'sphere' : 'box'}
          />
        ))}

        {/* Main title floating in 3D space */}
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.3}>
          <Text
            position={[0, 3, 0]}
            fontSize={0.8}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            SPICE BAZAAR
          </Text>
        </Float>

        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
          <Text
            position={[0, 2.2, 0]}
            fontSize={0.3}
            color="#aaaaaa"
            anchorX="center"
            anchorY="middle"
          >
            KAZAKHSTAN
          </Text>
        </Float>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default SpiceScene3D;