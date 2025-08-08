import { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export const GoogleTranslate = () => {
  useEffect(() => {
    // Add Google Translate script
    const addScript = () => {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,ru,kk,zh,fr,de,es,ar,hi,ur,tr,fa',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    // Load script if not already loaded
    if (!window.google?.translate) {
      addScript();
    } else {
      window.googleTranslateElementInit();
    }
  }, []);

  return (
    <div 
      id="google_translate_element" 
      className="google-translate-widget"
      style={{
        display: 'inline-block',
      }}
    />
  );
};