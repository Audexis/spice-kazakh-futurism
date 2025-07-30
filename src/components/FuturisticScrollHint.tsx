import { useEffect, useState } from 'react';

interface FuturisticScrollHintProps {
  onClick: () => void;
}

export const FuturisticScrollHint = ({ onClick }: FuturisticScrollHintProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div 
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer group"
      onClick={onClick}
    >
      {/* Minimalist futuristic design */}
      <div className="relative">
        {/* Main indicator */}
        <div className="w-1 h-12 bg-gradient-to-b from-transparent via-primary to-transparent opacity-60 group-hover:opacity-100 transition-all duration-500">
          {/* Animated pulse */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary/20 animate-pulse" />
        </div>
        
        {/* Moving dot */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50 animate-bounce" />
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-primary/20 blur-sm rounded-full scale-150 group-hover:scale-200 transition-transform duration-700" />
      </div>
      
      {/* Minimal text hint */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs font-exo text-muted-foreground/60 group-hover:text-primary/80 transition-colors duration-300 tracking-widest">
          EXPLORE
        </span>
      </div>
    </div>
  );
};