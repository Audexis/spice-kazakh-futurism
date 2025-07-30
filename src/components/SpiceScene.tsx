import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const SpiceScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererRef.current = renderer;
    
    renderer.setSize(300, 300);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4FC3F7, 0.8, 100);
    pointLight.position.set(-5, 5, -5);
    scene.add(pointLight);

    // Create spice jar geometry
    const jarGeometry = new THREE.CylinderGeometry(0.8, 1, 2, 32);
    const jarMaterial = new THREE.MeshPhongMaterial({
      color: 0x2a2a2a,
      transparent: true,
      opacity: 0.7,
      shininess: 100
    });
    const jar = new THREE.Mesh(jarGeometry, jarMaterial);
    jar.position.y = 0;
    scene.add(jar);

    // Create spice content
    const spiceGeometry = new THREE.CylinderGeometry(0.75, 0.95, 1.5, 32);
    const spiceMaterial = new THREE.MeshPhongMaterial({
      color: 0xE65100, // Spice orange color
      shininess: 30
    });
    const spice = new THREE.Mesh(spiceGeometry, spiceMaterial);
    spice.position.y = -0.2;
    scene.add(spice);

    // Create lid
    const lidGeometry = new THREE.CylinderGeometry(0.85, 0.85, 0.2, 32);
    const lidMaterial = new THREE.MeshPhongMaterial({
      color: 0x1a1a1a,
      shininess: 100
    });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.y = 1.1;
    scene.add(lid);

    // Create floating spice particles
    const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const particleMaterial = new THREE.MeshPhongMaterial({
      color: 0xFFB74D,
      shininess: 50
    });

    const particles: THREE.Mesh[] = [];
    for (let i = 0; i < 20; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        (Math.random() - 0.5) * 4,
        Math.random() * 3 + 1,
        (Math.random() - 0.5) * 4
      );
      particles.push(particle);
      scene.add(particle);
    }

    camera.position.z = 5;
    camera.position.y = 1;

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate jar
      jar.rotation.y += 0.005;
      spice.rotation.y += 0.005;
      lid.rotation.y += 0.005;

      // Animate particles
      particles.forEach((particle, index) => {
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
        particle.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
        particle.position.x += Math.cos(Date.now() * 0.001 + index) * 0.001;
      });

      // Gentle camera movement
      camera.position.x = Math.sin(Date.now() * 0.0005) * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
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
      className="w-[300px] h-[300px] mx-auto float opacity-80 hover:opacity-100 transition-opacity duration-500"
    />
  );
};