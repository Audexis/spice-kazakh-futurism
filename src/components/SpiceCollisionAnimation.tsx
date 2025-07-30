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

    // Particle class for smooth animation
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

      constructor(x: number, y: number, vx: number, vy: number, color: string, size: number = 2) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.color = color;
        this.alpha = 1;
      }

      update() {
        if (this.isForming && this.targetX !== undefined && this.targetY !== undefined) {
          // Move towards target position for text formation
          const dx = this.targetX - this.x;
          const dy = this.targetY - this.y;
          this.x += dx * 0.08;
          this.y += dy * 0.08;
        } else {
          this.x += this.vx;
          this.y += this.vy;
        }
      }

      draw(ctx: CanvasRenderingContext2D, blurEffect: boolean = false) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        if (blurEffect) {
          // Create powder cloud effect with blur
          ctx.filter = 'blur(1px)';
          ctx.shadowBlur = 3;
          ctx.shadowColor = this.color;
        }
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Create powder-like particles (much smaller and more numerous)
    const redParticles: Particle[] = [];
    const yellowParticles: Particle[] = [];

    // Generate red powder cloud from left (more particles, smaller size)
    for (let i = 0; i < 2000; i++) {
      redParticles.push(new Particle(
        -100 - Math.random() * 300,
        canvas.height / 2 + (Math.random() - 0.5) * canvas.height * 0.6,
        1.5 + Math.random() * 2,
        (Math.random() - 0.5) * 1.5,
        `hsl(${Math.random() * 15}, ${80 + Math.random() * 20}%, ${45 + Math.random() * 25}%)`,
        0.5 + Math.random() * 1 // Much smaller particles
      ));
    }

    // Generate yellow powder cloud from right
    for (let i = 0; i < 2000; i++) {
      yellowParticles.push(new Particle(
        canvas.width + 100 + Math.random() * 300,
        canvas.height / 2 + (Math.random() - 0.5) * canvas.height * 0.6,
        -1.5 - Math.random() * 2,
        (Math.random() - 0.5) * 1.5,
        `hsl(${50 + Math.random() * 10}, ${80 + Math.random() * 20}%, ${45 + Math.random() * 25}%)`,
        0.5 + Math.random() * 1 // Much smaller particles
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

      // Clear canvas completely each frame for crisp animation
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Phase 1: Powder clouds approach center (0-2s)
      if (elapsed < 2) {
        animationPhase = 0;
        
        // Draw powder clouds with density clustering
        allParticles.forEach(particle => {
          particle.update();
          particle.draw(ctx, true); // Enable blur effect for powder look
        });
        
        // Add density clouds effect
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        allParticles.forEach(particle => {
          if (Math.random() < 0.1) { // Only some particles contribute to density
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = particle.color;
            ctx.filter = 'blur(8px)';
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 20, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.restore();
      }
      // Phase 2: Collision effect (2-3s)
      else if (elapsed < 3) {
        if (animationPhase === 0) {
          animationPhase = 1;
          console.log('Starting collision phase');
        }
        
        // Create powder explosion at center
        const collisionProgress = (elapsed - 2) / 1;
        
        allParticles.forEach(particle => {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const distance = Math.sqrt((particle.x - centerX) ** 2 + (particle.y - centerY) ** 2);
          
          if (distance < 150) {
            // Particles in collision zone get scattered
            particle.vx += (Math.random() - 0.5) * 0.5;
            particle.vy += (Math.random() - 0.5) * 0.5;
            particle.alpha = Math.max(0.3, particle.alpha);
          }
          
          particle.update();
          particle.draw(ctx, true);
        });

        // Add massive powder burst effect
        ctx.save();
        ctx.globalAlpha = Math.sin(collisionProgress * Math.PI) * 0.6;
        ctx.filter = 'blur(15px)';
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 100 * collisionProgress, 0, Math.PI * 2);
        ctx.fill();
        
        // Multiple explosion rings
        for (let i = 0; i < 3; i++) {
          ctx.globalAlpha = Math.sin(collisionProgress * Math.PI) * (0.3 - i * 0.1);
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2, (80 + i * 30) * collisionProgress, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      // Phase 3: Smooth text formation (3-4.5s)
      else if (elapsed < 4.5) {
        if (animationPhase === 1) {
          animationPhase = 2;
          textPoints = getTextPoints('SPICE BAZAAR', Math.min(120, canvas.width / 10));
          console.log('Starting text formation, text points:', textPoints.length);
          
          // Smoothly assign nearest particles to text points
          textPoints.forEach((point, pointIndex) => {
            let nearestParticle = null;
            let minDistance = Infinity;
            
            allParticles.forEach(particle => {
              if (!particle.isForming) {
                const distance = Math.sqrt((particle.x - point.x) ** 2 + (particle.y - point.y) ** 2);
                if (distance < minDistance) {
                  minDistance = distance;
                  nearestParticle = particle;
                }
              }
            });
            
            if (nearestParticle) {
              nearestParticle.targetX = point.x;
              nearestParticle.targetY = point.y;
              nearestParticle.isForming = true;
              nearestParticle.size = 1.5; // Slightly larger for text visibility
              nearestParticle.alpha = 1;
            }
          });
          
          // Fade out unassigned particles
          allParticles.forEach(particle => {
            if (!particle.isForming) {
              particle.alpha *= 0.95;
            }
          });
        }

        const formationProgress = (elapsed - 3) / 1.5;
        
        allParticles.forEach(particle => {
          particle.update();
          if (particle.alpha > 0.1) {
            particle.draw(ctx, !particle.isForming); // Blur non-forming particles
          }
        });

        // Gradually show text outline
        if (formationProgress > 0.5) {
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