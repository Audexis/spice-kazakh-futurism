import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import anime from 'animejs';

interface ScrollIndicatorProps {
  onClick: () => void;
}

export const ScrollIndicator = ({ onClick }: ScrollIndicatorProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setVisible(!scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Futuristic floating animation
    anime({
      targets: '.scroll-indicator',
      translateY: [0, -15, 0],
      duration: 3000,
      loop: true,
      easing: 'easeInOutSine'
    });

    // Pulsing glow effect
    anime({
      targets: '.scroll-glow',
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.8, 0.3],
      duration: 2000,
      loop: true,
      easing: 'easeInOutQuart'
    });

    // Scanning line effect
    anime({
      targets: '.scan-line',
      translateY: [-20, 20],
      duration: 1500,
      loop: true,
      easing: 'easeInOutQuad'
    });
  }, []);

  if (!visible) return null;

  return (
    <div 
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Futuristic text */}
        <div className="text-center">
          <p className="font-orbitron text-sm text-primary/80 font-medium tracking-wider mb-1">
            DISCOVER COLLECTION
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        </div>

        {/* Futuristic scroll indicator */}
        <div className="scroll-indicator relative">
          {/* Outer glow ring */}
          <div className="scroll-glow absolute inset-0 w-16 h-16 border-2 border-primary/30 rounded-full bg-primary/5 backdrop-blur-sm"></div>
          
          {/* Inner container */}
          <div className="relative w-16 h-16 border border-primary/50 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
            {/* Scanning line */}
            <div className="scan-line absolute w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            
            {/* Central chevron */}
            <ChevronDown className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-300" />
            
            {/* Corner accents */}
            <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-primary/60"></div>
            <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-primary/60"></div>
            <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-primary/60"></div>
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-primary/60"></div>
          </div>
          
          {/* Orbiting dots */}
          <div className="absolute inset-0 w-16 h-16">
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2 animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute left-0 top-1/2 w-1 h-1 bg-primary rounded-full transform -translate-y-1/2 animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute right-0 top-1/2 w-1 h-1 bg-primary rounded-full transform -translate-y-1/2 animate-pulse" style={{animationDelay: '1.5s'}}></div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="font-exo text-xs text-muted-foreground/60 tracking-widest">
          [ SCROLL TO EXPLORE ]
        </div>
      </div>
    </div>
  );
};