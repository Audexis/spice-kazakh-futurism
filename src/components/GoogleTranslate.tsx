import { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

let isInitialized = false;

export const GoogleTranslate = () => {
  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized) return;

    // Add Google Translate script
    const addScript = () => {
      if (document.getElementById('google-translate-script')) return;
      
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    };

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      if (isInitialized) return;
      
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,ru,kk,zh,fr,de,es,ar,hi,ur,tr,fa,ja,ko',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true,
          },
          'google_translate_element'
        );
        isInitialized = true;
      } catch (error) {
        console.log('Google Translate initialization error:', error);
      }
    };

    // Load script if not already loaded
    if (!window.google?.translate) {
      addScript();
    } else {
      window.googleTranslateElementInit();
    }
  }, []);

  return (
    <div className="relative">
      <div 
        id="google_translate_element" 
        className="google-translate-widget"
      />
    </div>
  );
};