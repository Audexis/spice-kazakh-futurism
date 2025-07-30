import { useEffect, useRef } from 'react';

export const SpiceCollisionAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Particle class for realistic spice physics
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      targetX?: number;
      targetY?: number;
      isForming: boolean = false;
      rotation: number;
      rotationSpeed: number;
      shape: 'circle' | 'oval' | 'grain';
      settled: boolean = false;

      constructor(x: number, y: number, vx: number, vy: number, color: string, size: number = 2) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.color = color;
        this.alpha = 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.shape = Math.random() < 0.4 ? 'circle' : Math.random() < 0.7 ? 'oval' : 'grain';
      }

      update() {
        if (!this.settled) {
          this.x += this.vx;
          this.y += this.vy;
          this.rotation += this.rotationSpeed;
          
          // Apply friction and gravity
          this.vx *= 0.99;
          this.vy += 0.02; // gravity
          this.vy *= 0.995; // air resistance
        } else if (this.isForming && this.targetX !== undefined && this.targetY !== undefined) {
          // Only move to target when settled and assigned
          const dx = this.targetX - this.x;
          const dy = this.targetY - this.y;
          if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            this.x += dx * 0.05;
            this.y += dy * 0.05;
          }
        }
      }

      checkCollision(other: Particle): boolean {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (this.size + other.size);
      }

      collideWith(other: Particle) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          // Realistic collision response
          const nx = dx / distance;
          const ny = dy / distance;
          
          // Relative velocity
          const rvx = this.vx - other.vx;
          const rvy = this.vy - other.vy;
          
          // Relative velocity in collision normal direction
          const speed = rvx * nx + rvy * ny;
          
          if (speed > 0) return; // Objects moving apart
          
          // Collision impulse
          const impulse = 2 * speed / 2; // assuming equal mass
          
          this.vx -= impulse * nx;
          this.vy -= impulse * ny;
          other.vx += impulse * nx;
          other.vy += impulse * ny;
          
          // Add some randomness for realistic scatter
          this.vx += (Math.random() - 0.5) * 0.5;
          this.vy += (Math.random() - 0.5) * 0.5;
          other.vx += (Math.random() - 0.5) * 0.5;
          other.vy += (Math.random() - 0.5) * 0.5;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        // Make particles more visible with stronger colors
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 3;
        ctx.shadowColor = this.color;
        
        // Add slight blur for spice texture but keep visible
        ctx.filter = 'blur(0.3px)';
        
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Draw different spice particle shapes - make them bigger for visibility
        ctx.beginPath();
        const renderSize = this.size * 2; // Double the visual size
        switch (this.shape) {
          case 'circle':
            ctx.arc(0, 0, renderSize, 0, Math.PI * 2);
            break;
          case 'oval':
            ctx.ellipse(0, 0, renderSize, renderSize * 0.6, 0, 0, Math.PI * 2);
            break;
          case 'grain':
            // Grain-like elongated shape
            ctx.ellipse(0, 0, renderSize * 0.4, renderSize * 1.2, 0, 0, Math.PI * 2);
            break;
        }
        ctx.fill();
        ctx.restore();
      }
    }

    // Create powder-like particles (much smaller and more numerous)
    const redParticles: Particle[] = [];
    const yellowParticles: Particle[] = [];

    // Generate red powder cloud from left (more particles, better visibility)
    for (let i = 0; i < 1500; i++) {
      redParticles.push(new Particle(
        -150 - Math.random() * 200,
        canvas.height / 2 + (Math.random() - 0.5) * canvas.height * 0.4,
        2.5 + Math.random() * 3, // Strong throwing velocity
        (Math.random() - 0.5) * 1.5,
        `hsl(${Math.random() * 20}, 100%, ${65 + Math.random() * 25}%)`, // Brighter colors
        1.2 + Math.random() * 1.5 // Visible size
      ));
    }

    // Generate yellow powder cloud from right
    for (let i = 0; i < 1500; i++) {
      yellowParticles.push(new Particle(
        canvas.width + 150 + Math.random() * 200,
        canvas.height / 2 + (Math.random() - 0.5) * canvas.height * 0.4,
        -2.5 - Math.random() * 3, // Strong throwing velocity
        (Math.random() - 0.5) * 1.5,
        `hsl(${50 + Math.random() * 15}, 100%, ${65 + Math.random() * 25}%)`, // Brighter colors
        1.2 + Math.random() * 1.5 // Visible size
      ));
    }

    // Text formation points for "SPICE BAZAAR"
    const getTextPoints = (text: string, fontSize: number) => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      
      tempCtx.font = `bold ${fontSize}px Orbitron, monospace`;
      tempCtx.textAlign = 'center';
      tempCtx.fillStyle = 'white';
      tempCtx.fillText(text, canvas.width / 2, canvas.height / 2);
      
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const points: Array<{x: number, y: number}> = [];
      
      for (let y = 0; y < imageData.height; y += 3) {
        for (let x = 0; x < imageData.width; x += 3) {
          const index = (y * imageData.width + x) * 4;
          if (imageData.data[index + 3] > 128) {
            points.push({ x, y });
          }
        }
      }
      
      return points;
    };

    let animationPhase = 0; // 0: approach, 1: collision, 2: formation, 3: final
    let startTime = Date.now();
    const allParticles = [...redParticles, ...yellowParticles];
    let textPoints: Array<{x: number, y: number}> = [];
    let collisionStarted = false;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;

      // Clear canvas completely for better visibility
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Phase 1: Particles thrown towards center (0-2s)
      if (elapsed < 2) {
        animationPhase = 0;
        
        // Update all particles with physics
        allParticles.forEach(particle => {
          particle.update();
        });
        
        // Check for collisions between particles
        for (let i = 0; i < redParticles.length; i++) {
          for (let j = 0; j < yellowParticles.length; j++) {
            if (redParticles[i].checkCollision(yellowParticles[j])) {
              redParticles[i].collideWith(yellowParticles[j]);
            }
          }
        }
        
        // Draw all particles with high visibility
        allParticles.forEach(particle => {
          particle.draw(ctx);
        });
        
        // Debug: Add particle count to see if they exist
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(`Red: ${redParticles.length}, Yellow: ${yellowParticles.length}`, 10, 30);
        ctx.fillText(`Phase: ${animationPhase}, Time: ${elapsed.toFixed(1)}s`, 10, 50);
        ctx.restore();
        
        // Add minimal powder clouds for atmosphere
        ctx.save();
        ctx.globalAlpha = 0.02;
        redParticles.slice(0, 50).forEach(particle => {
          ctx.fillStyle = '#FF4444';
          ctx.filter = 'blur(8px)';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 15, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }
      // Phase 2: Collision and settling (2-3.5s)
      else if (elapsed < 3.5) {
        if (animationPhase === 0) {
          animationPhase = 1;
          console.log('Starting collision and settling phase');
        }
        
        // Continue physics simulation
        allParticles.forEach(particle => {
          particle.update();
          
          // Particles settle when they slow down enough
          if (!particle.settled && Math.abs(particle.vx) < 0.1 && Math.abs(particle.vy) < 0.1) {
            particle.settled = true;
          }
        });
        
        // Continue collision detection
        for (let i = 0; i < redParticles.length; i++) {
          for (let j = 0; j < yellowParticles.length; j++) {
            if (redParticles[i].checkCollision(yellowParticles[j])) {
              redParticles[i].collideWith(yellowParticles[j]);
            }
          }
        }

        allParticles.forEach(particle => {
          particle.draw(ctx);
        });

        // Collision effects
        const collisionProgress = (elapsed - 2) / 1.5;
        ctx.save();
        ctx.globalAlpha = Math.sin(collisionProgress * Math.PI) * 0.2;
        ctx.filter = 'blur(20px)';
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 80 * collisionProgress, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      // Phase 3: Natural text formation (3.5-5s)
      else if (elapsed < 5) {
        if (animationPhase === 1) {
          animationPhase = 2;
          textPoints = getTextPoints('SPICE BAZAAR', Math.min(120, canvas.width / 10));
          console.log('Starting natural text formation, text points:', textPoints.length);
          
          // Only assign settled particles to text formation
          const settledParticles = allParticles.filter(p => p.settled);
          textPoints.forEach((point, pointIndex) => {
            if (pointIndex < settledParticles.length) {
              const particle = settledParticles[pointIndex];
              particle.targetX = point.x;
              particle.targetY = point.y;
              particle.isForming = true;
              particle.alpha = 1;
            }
          });
          
          // Fade out excess particles
          allParticles.forEach(particle => {
            if (!particle.isForming) {
              particle.alpha *= 0.98;
            }
          });
        }

        const formationProgress = (elapsed - 3.5) / 1.5;
        
        allParticles.forEach(particle => {
          particle.update();
          if (particle.alpha > 0.1) {
            particle.draw(ctx);
          }
        });

        // Gradually show text outline when particles are close
        if (formationProgress > 0.6) {
          ctx.save();
          ctx.globalAlpha = (formationProgress - 0.5) * 2;
          ctx.font = `bold ${Math.min(120, canvas.width / 10)}px Orbitron, monospace`;
          ctx.textAlign = 'center';
          ctx.strokeStyle = '#4FC3F7';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#4FC3F7';
          ctx.strokeText('SPICE BAZAAR', canvas.width / 2, canvas.height / 2);
          ctx.restore();
        }
      }
      // Phase 4: Final glow effect (4.5s+)
      else {
        if (animationPhase === 2) {
          animationPhase = 3;
          console.log('Final phase started');
        }
        
        // Clear background
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Final text with full glow
        ctx.save();
        ctx.font = `bold ${Math.min(120, canvas.width / 10)}px Orbitron, monospace`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#4FC3F7';
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#4FC3F7';
        ctx.fillText('SPICE BAZAAR', canvas.width / 2, canvas.height / 2);
        
        // Add subtitle
        ctx.font = `${Math.min(30, canvas.width / 40)}px Exo, sans-serif`;
        ctx.fillStyle = '#FFB74D';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FFB74D';
        ctx.fillText('KAZAKHSTAN', canvas.width / 2, canvas.height / 2 + Math.min(80, canvas.width / 15));
        ctx.restore();

        // Add ambient floating particles
        for (let i = 0; i < 30; i++) {
          const x = canvas.width / 2 + (Math.random() - 0.5) * 400;
          const y = canvas.height / 2 + (Math.random() - 0.5) * 200;
          const size = Math.random() * 2;
          const alpha = Math.random() * 0.3 * Math.sin(elapsed * 2);
          
          ctx.save();
          ctx.globalAlpha = Math.max(0, alpha);
          ctx.fillStyle = Math.random() > 0.5 ? '#E65100' : '#FFB74D';
          ctx.shadowBlur = 5;
          ctx.shadowColor = ctx.fillStyle;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        
        return; // Stop animation after showing final state
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10"
      style={{ background: 'transparent' }}
    />
  );
};