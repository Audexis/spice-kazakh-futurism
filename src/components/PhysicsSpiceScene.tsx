import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const PhysicsSpiceScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererRef.current = renderer;
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Simplified lighting for better performance
    const ambientLight = new THREE.AmbientLight(0x2a2a2a, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = false; // Disabled shadows completely
    scene.add(directionalLight);

    // Single colored light for atmosphere
    const pointLight = new THREE.PointLight(0x4fc3f7, 1, 100);
    pointLight.position.set(0, 15, 0);
    scene.add(pointLight);

    // Ultra-optimized spice particle system
    const spiceColors = [0xe65100, 0xffb74d, 0x8bc34a, 0xd32f2f, 0xffc107, 0x795548, 0x4caf50, 0xff9800];
    const particleCount = 50000;
    
    // Use only ONE geometry and material for maximum performance
    const geometry = new THREE.SphereGeometry(1, 6, 6); // Very low poly
    const material = new THREE.MeshBasicMaterial({ // Switched to basic material for performance
      color: 0xffa726,
      transparent: false
    });

    // Single instanced mesh for all particles
    const instancedMesh = new THREE.InstancedMesh(geometry, material, particleCount);
    instancedMesh.castShadow = false;
    instancedMesh.receiveShadow = false;
    scene.add(instancedMesh);

    // Simplified particle data
    const particles = new Float32Array(particleCount * 6); // position(3) + velocity(3)
    const colors = new Float32Array(particleCount * 3); // RGB
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const i6 = i * 6;
      const i3 = i * 3;
      
      // Position
      const side = Math.random() > 0.5 ? -1 : 1;
      particles[i6] = side * (30 + Math.random() * 20); // x
      particles[i6 + 1] = Math.random() * 20 + 10; // y
      particles[i6 + 2] = (Math.random() - 0.5) * 40; // z
      
      // Velocity
      particles[i6 + 3] = -side * (2 + Math.random() * 3); // vx
      particles[i6 + 4] = -Math.random() * 2 - 1; // vy
      particles[i6 + 5] = (Math.random() - 0.5) * 2; // vz
      
      // Color
      const color = new THREE.Color(spiceColors[Math.floor(Math.random() * spiceColors.length)]);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Set initial matrix
      const scale = 0.01 + Math.random() * 0.02;
      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(particles[i6], particles[i6 + 1], particles[i6 + 2]),
        new THREE.Quaternion(),
        new THREE.Vector3(scale, scale, scale)
      );
      instancedMesh.setMatrixAt(i, matrix);
    }
    
    // Add color attribute
    instancedMesh.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3));
    instancedMesh.material.vertexColors = true;
    instancedMesh.instanceMatrix.needsUpdate = true;

    // Simplified title
    const titleGroup = new THREE.Group();
    const letterMaterial = new THREE.MeshBasicMaterial({ // Basic material for performance
      color: 0x4fc3f7,
      transparent: true,
      opacity: 0
    });

    const letterGeometry = new THREE.BoxGeometry(2, 3, 0.5);
    for (let i = 0; i < 11; i++) {
      const letter = new THREE.Mesh(letterGeometry, letterMaterial.clone());
      letter.position.set((i - 5) * 2.5, 0, 0);
      titleGroup.add(letter);
    }
    
    titleGroup.position.set(0, 5, 0);
    titleGroup.visible = false;
    scene.add(titleGroup);

    camera.position.set(0, 10, 25);
    camera.lookAt(0, 0, 0);

    // Ultra-optimized animation
    let animationPhase = 0;
    let phaseTimer = 0;
    let frameCount = 0;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      phaseTimer += 0.016;
      frameCount++;

      // Only update physics every 2nd frame for performance
      if (frameCount % 2 === 0 && animationPhase === 0) {
        // Simplified physics - operate directly on arrays
        for (let i = 0; i < particleCount; i++) {
          const i6 = i * 6;
          
          // Apply gravity and simple wind
          particles[i6 + 4] -= 0.01; // gravity
          particles[i6 + 3] += Math.sin(phaseTimer * 0.5) * 0.001; // wind x
          particles[i6 + 5] += Math.cos(phaseTimer * 0.4) * 0.001; // wind z
          
          // Air resistance
          particles[i6 + 3] *= 0.998;
          particles[i6 + 4] *= 0.998;
          particles[i6 + 5] *= 0.998;
          
          // Update position
          particles[i6] += particles[i6 + 3];
          particles[i6 + 1] += particles[i6 + 4];
          particles[i6 + 2] += particles[i6 + 5];
          
          // Ground collision
          if (particles[i6 + 1] < -5) {
            particles[i6 + 4] *= -0.3;
            particles[i6 + 3] *= 0.7;
            particles[i6 + 5] *= 0.7;
            particles[i6 + 1] = -5;
          }
          
          // Update matrix (every 4th particle per frame for performance)
          if (i % 4 === frameCount % 4) {
            position.set(particles[i6], particles[i6 + 1], particles[i6 + 2]);
            const rotY = phaseTimer * 0.02 + i * 0.1;
            quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
            scale.set(0.01, 0.01, 0.01);
            matrix.compose(position, quaternion, scale);
            instancedMesh.setMatrixAt(i, matrix);
          }
        }
        
        instancedMesh.instanceMatrix.needsUpdate = true;
      }

      // Phase transition
      if (phaseTimer > 6 && animationPhase === 0) {
        animationPhase = 1;
        titleGroup.visible = true;
        
        // Animate title appearance
        titleGroup.children.forEach((letter, i) => {
          setTimeout(() => {
            const mesh = letter as THREE.Mesh;
            const material = mesh.material as THREE.MeshPhysicalMaterial;
            const animate = () => {
              material.opacity = Math.min(1, material.opacity + 0.05);
              if (material.opacity < 1) {
                requestAnimationFrame(animate);
              }
            };
            animate();
          }, i * 100);
        });
      }

      // Title animations
      if (animationPhase === 1) {
        titleGroup.rotation.y += 0.01;
        titleGroup.position.y = 5 + Math.sin(phaseTimer * 2) * 0.2;
      }

      // Simple camera movement
      const time = phaseTimer * 0.3;
      camera.position.x = Math.sin(time) * 3;
      camera.lookAt(0, 2, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      
      // Dispose single instanced mesh
      scene.remove(instancedMesh);
      instancedMesh.geometry.dispose();
      if (Array.isArray(instancedMesh.material)) {
        instancedMesh.material.forEach(mat => mat.dispose());
      } else {
        instancedMesh.material.dispose();
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 z-10"
    />
  );
};