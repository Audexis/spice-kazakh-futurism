import { useCallback } from 'react';

export const useSound = () => {
  const playSuccessSound = useCallback(() => {
    console.log('playSuccessSound called');
    try {
      const audio = new Audio('/sounds/success-sound.mp3');
      console.log('Audio object created');
      audio.volume = 0.8;
      audio.preload = 'auto';
      
      audio.addEventListener('loadeddata', () => {
        console.log('Audio loaded successfully');
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
      });
      
      audio.play().then(() => {
        console.log('Audio played successfully');
      }).catch((error) => {
        console.error('Audio play failed:', error);
      });
    } catch (error) {
      console.error('Error creating audio:', error);
    }
  }, []);

  return { playSuccessSound };
};