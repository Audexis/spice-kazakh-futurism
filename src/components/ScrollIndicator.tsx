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
    // Animate the scroll indicator
    anime({
      targets: '.scroll-indicator',
      translateY: [0, 10, 0],
      duration: 2000,
      loop: true,
      easing: 'easeInOutSine'
    });

    // Animate the text
    anime({
      targets: '.scroll-text',
      opacity: [0.5, 1, 0.5],
      duration: 3000,
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
      <div className="flex flex-col items-center space-y-2">
        <p className="scroll-text text-sm text-muted-foreground font-medium tracking-wide">
          Discover Our Collection
        </p>
        <div className="scroll-indicator flex flex-col items-center space-y-1 group-hover:scale-110 transition-transform duration-300">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
          <ChevronDown className="h-5 w-5 text-primary/70" />
        </div>
      </div>
    </div>
  );
};