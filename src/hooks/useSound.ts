import { useCallback } from 'react';

export const useSound = () => {
  const playSuccessSound = useCallback(() => {
    try {
      const audio = new Audio('/sounds/success-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(console.error);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, []);

  return { playSuccessSound };
};