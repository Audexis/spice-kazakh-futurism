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

    // Enhanced lighting for ultra-realistic effects
    const ambientLight = new THREE.AmbientLight(0x2a2a2a, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    scene.add(directionalLight);

    // Multiple colored lights for dramatic effect
    const coloredLights = [
      { color: 0xe65100, position: [-20, 10, 5] },
      { color: 0xffb74d, position: [20, 10, 5] },
      { color: 0x8bc34a, position: [0, 15, -10] },
      { color: 0xd32f2f, position: [-10, 8, 15] },
      { color: 0xffc107, position: [10, 8, 15] }
    ];

    coloredLights.forEach(light => {
      const pointLight = new THREE.PointLight(light.color, 1.5, 50);
      pointLight.position.set(light.position[0], light.position[1], light.position[2]);
      scene.add(pointLight);
    });

    // Spice particle system with physics
    const spiceTypes = [
      { color: 0xe65100, size: 0.02, density: 0.8 }, // Paprika
      { color: 0xffb74d, size: 0.015, density: 0.6 }, // Turmeric
      { color: 0x8bc34a, size: 0.018, density: 0.7 }, // Cardamom
      { color: 0xd32f2f, size: 0.012, density: 0.9 }, // Chili
      { color: 0xffc107, size: 0.008, density: 0.5 }, // Saffron
      { color: 0x795548, size: 0.025, density: 1.0 }, // Cinnamon
      { color: 0x4caf50, size: 0.014, density: 0.6 }, // Basil
      { color: 0xff9800, size: 0.016, density: 0.7 } // Cumin
    ];

    const particles: Array<{
      mesh: THREE.Mesh;
      velocity: THREE.Vector3;
      angular: THREE.Vector3;
      density: number;
      life: number;
    }> = [];

    // Create geometries for different spice shapes
    const sphereGeometry = new THREE.SphereGeometry(1, 12, 12);
    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 8);
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    // Create 50,000 spice particles (browser-friendly amount)
    for (let i = 0; i < 50000; i++) {
      const spiceType = spiceTypes[Math.floor(Math.random() * spiceTypes.length)];
      
      // Random geometry for variety
      const geometries = [sphereGeometry, cylinderGeometry, boxGeometry];
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      
      const material = new THREE.MeshPhysicalMaterial({
        color: spiceType.color,
        metalness: 0.2,
        roughness: 0.8,
        emissive: spiceType.color,
        emissiveIntensity: 0.1,
        transparent: true,
        opacity: 0.9
      });

      const particle = new THREE.Mesh(geometry, material);
      
      // Random starting position (from sides)
      const side = Math.random() > 0.5 ? -1 : 1;
      particle.position.set(
        side * (30 + Math.random() * 20), // Far from sides
        Math.random() * 20 + 10, // High up
        (Math.random() - 0.5) * 40
      );

      const scale = spiceType.size * (0.5 + Math.random() * 1.5);
      particle.scale.setScalar(scale);
      particle.castShadow = true;

      scene.add(particle);

      // Physics properties
      const velocity = new THREE.Vector3(
        -side * (2 + Math.random() * 3), // Towards center
        -Math.random() * 2 - 1, // Downward
        (Math.random() - 0.5) * 2
      );

      particles.push({
        mesh: particle,
        velocity,
        angular: new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        ),
        density: spiceType.density,
        life: Math.random() * 10 + 5
      });
    }

    // Company name 3D text (simplified for performance)
    const titleGroup = new THREE.Group();
    
    // Create 3D letter-like shapes for "SPICE BAZAAR"
    const letterMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4fc3f7,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x4fc3f7,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0
    });

    const letterGeometry = new THREE.BoxGeometry(2, 3, 0.5);
    for (let i = 0; i < 11; i++) { // SPICE BAZAAR = 11 letters
      const letter = new THREE.Mesh(letterGeometry, letterMaterial.clone());
      letter.position.set((i - 5) * 2.5, 0, 0);
      letter.castShadow = true;
      titleGroup.add(letter);
    }
    
    titleGroup.position.set(0, 5, 0);
    titleGroup.visible = false;
    scene.add(titleGroup);

    camera.position.set(0, 10, 25);
    camera.lookAt(0, 0, 0);

    // Animation timeline
    let animationPhase = 0; // 0: spices flying, 1: title appearing
    let phaseTimer = 0;
    const gravity = new THREE.Vector3(0, -0.01, 0);

    // Wind force simulation
    const wind = new THREE.Vector3();

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      phaseTimer += 0.016; // ~60fps

      // Update wind
      wind.set(
        Math.sin(phaseTimer * 0.5) * 0.002,
        Math.sin(phaseTimer * 0.3) * 0.001,
        Math.cos(phaseTimer * 0.4) * 0.002
      );

      // Spice physics simulation
      particles.forEach((particle, index) => {
        if (animationPhase === 0) {
          // Apply forces
          particle.velocity.add(gravity);
          particle.velocity.add(wind);
          
          // Air resistance
          particle.velocity.multiplyScalar(0.998);
          
          // Update position
          particle.mesh.position.add(particle.velocity);
          
          // Rotation
          particle.mesh.rotation.x += particle.angular.x;
          particle.mesh.rotation.y += particle.angular.y;
          particle.mesh.rotation.z += particle.angular.z;
          
          // Collision with ground
          if (particle.mesh.position.y < -5) {
            particle.velocity.y *= -0.3; // Bounce with energy loss
            particle.velocity.x *= 0.7;
            particle.velocity.z *= 0.7;
            particle.mesh.position.y = -5;
          }
          
          // Fade out old particles
          particle.life -= 0.016;
          if (particle.life <= 0) {
            const material = particle.mesh.material as THREE.MeshPhysicalMaterial;
            material.opacity *= 0.95;
          }
        }
      });

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

      // Dynamic camera movement
      const time = phaseTimer * 0.5;
      camera.position.x = Math.sin(time) * 5;
      camera.position.y = 10 + Math.cos(time * 0.7) * 2;
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
      
      particles.forEach(particle => {
        scene.remove(particle.mesh);
        particle.mesh.geometry.dispose();
        if (Array.isArray(particle.mesh.material)) {
          particle.mesh.material.forEach(mat => mat.dispose());
        } else {
          particle.mesh.material.dispose();
        }
      });
      
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