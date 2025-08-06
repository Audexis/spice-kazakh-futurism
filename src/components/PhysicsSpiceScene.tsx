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

    // Optimized spice particle system using InstancedMesh
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

    const particleCount = 50000;
    const particles: Array<{
      velocity: THREE.Vector3;
      angular: THREE.Vector3;
      density: number;
      life: number;
      typeIndex: number;
      instanceId: number;
    }> = [];

    // Create shared geometries (only 3 total)
    const sphereGeometry = new THREE.SphereGeometry(1, 8, 8); // Reduced complexity
    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 6); // Reduced complexity
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    // Create instanced meshes for each spice type and geometry combination
    const instancedMeshes: THREE.InstancedMesh[] = [];
    const particlesPerTypeGeometry = Math.ceil(particleCount / (spiceTypes.length * 3));

    spiceTypes.forEach((spiceType, typeIndex) => {
      [sphereGeometry, cylinderGeometry, boxGeometry].forEach((geometry, geoIndex) => {
        const material = new THREE.MeshPhysicalMaterial({
          color: spiceType.color,
          metalness: 0.1, // Reduced for performance
          roughness: 0.9,
          emissive: spiceType.color,
          emissiveIntensity: 0.05, // Reduced for performance
          transparent: false, // Disabled transparency for performance
          opacity: 1
        });

        const instancedMesh = new THREE.InstancedMesh(geometry, material, particlesPerTypeGeometry);
        instancedMesh.castShadow = false; // Disabled shadows for performance
        scene.add(instancedMesh);
        instancedMeshes.push(instancedMesh);

        // Initialize particles for this instanced mesh
        for (let i = 0; i < particlesPerTypeGeometry && particles.length < particleCount; i++) {
          const side = Math.random() > 0.5 ? -1 : 1;
          const position = new THREE.Vector3(
            side * (30 + Math.random() * 20),
            Math.random() * 20 + 10,
            (Math.random() - 0.5) * 40
          );

          const scale = spiceType.size * (0.5 + Math.random() * 1.5);
          const matrix = new THREE.Matrix4();
          matrix.compose(
            position,
            new THREE.Quaternion().setFromEuler(new THREE.Euler(
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI
            )),
            new THREE.Vector3(scale, scale, scale)
          );
          instancedMesh.setMatrixAt(i, matrix);

          particles.push({
            velocity: new THREE.Vector3(
              -side * (2 + Math.random() * 3),
              -Math.random() * 2 - 1,
              (Math.random() - 0.5) * 2
            ),
            angular: new THREE.Vector3(
              (Math.random() - 0.5) * 0.1, // Reduced rotation speed
              (Math.random() - 0.5) * 0.1,
              (Math.random() - 0.5) * 0.1
            ),
            density: spiceType.density,
            life: Math.random() * 10 + 5,
            typeIndex: typeIndex * 3 + geoIndex,
            instanceId: i
          });
        }

        instancedMesh.instanceMatrix.needsUpdate = true;
      });
    });

    // Optimized company name 3D text
    const titleGroup = new THREE.Group();
    
    // Create simple 3D letter shapes
    const letterMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4fc3f7,
      metalness: 0.5, // Reduced for performance
      roughness: 0.3,
      emissive: 0x4fc3f7,
      emissiveIntensity: 0.2, // Reduced for performance
      transparent: true,
      opacity: 0
    });

    const letterGeometry = new THREE.BoxGeometry(2, 3, 0.5);
    for (let i = 0; i < 11; i++) { // SPICE BAZAAR = 11 letters
      const letter = new THREE.Mesh(letterGeometry, letterMaterial.clone());
      letter.position.set((i - 5) * 2.5, 0, 0);
      letter.castShadow = false; // Disabled for performance
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
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      phaseTimer += 0.016; // ~60fps

      // Update wind
      wind.set(
        Math.sin(phaseTimer * 0.5) * 0.002,
        Math.sin(phaseTimer * 0.3) * 0.001,
        Math.cos(phaseTimer * 0.4) * 0.002
      );

      // Optimized spice physics simulation using instanced meshes
      particles.forEach((particle, index) => {
        if (animationPhase === 0) {
          // Apply forces
          particle.velocity.add(gravity);
          particle.velocity.add(wind);
          
          // Air resistance
          particle.velocity.multiplyScalar(0.998);
          
          // Get current matrix
          const instancedMesh = instancedMeshes[particle.typeIndex];
          instancedMesh.getMatrixAt(particle.instanceId, matrix);
          matrix.decompose(position, quaternion, scale);
          
          // Update position
          position.add(particle.velocity);
          
          // Rotation
          const euler = new THREE.Euler().setFromQuaternion(quaternion);
          euler.x += particle.angular.x;
          euler.y += particle.angular.y;
          euler.z += particle.angular.z;
          quaternion.setFromEuler(euler);
          
          // Collision with ground
          if (position.y < -5) {
            particle.velocity.y *= -0.3; // Bounce with energy loss
            particle.velocity.x *= 0.7;
            particle.velocity.z *= 0.7;
            position.y = -5;
          }
          
          // Update matrix
          matrix.compose(position, quaternion, scale);
          instancedMesh.setMatrixAt(particle.instanceId, matrix);
          
          // Fade out old particles
          particle.life -= 0.016;
        }
      });

      // Update instance matrices
      instancedMeshes.forEach(mesh => {
        mesh.instanceMatrix.needsUpdate = true;
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
      
      // Dispose of instanced meshes
      instancedMeshes.forEach(mesh => {
        scene.remove(mesh);
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(mat => mat.dispose());
        } else {
          mesh.material.dispose();
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