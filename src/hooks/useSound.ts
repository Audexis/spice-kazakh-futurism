import { useCallback } from 'react';

export const useSound = () => {
  const playSuccessSound = useCallback(() => {
    try {
      const audio = new Audio('/sounds/success-sound.wav');
      audio.volume = 0.3;
      audio.preload = 'auto';
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Audio play prevented by browser:', error);
        });
      }
    } catch (error) {
      console.error('Error creating audio:', error);
    }
  }, []);

  return { playSuccessSound };
};