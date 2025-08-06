import { useCallback } from 'react';

export const useSound = () => {
  const playSuccessSound = useCallback(() => {
    try {
      const audio = new Audio('/sounds/success-sound.mp3');
      audio.volume = 0.5;
      audio.preload = 'metadata';
      
      // Handle user gesture requirement
      audio.play().catch((error) => {
        console.log('Audio play failed:', error.message);
      });
    } catch (error) {
      console.error('Error creating audio:', error);
    }
  }, []);

  return { playSuccessSound };
};