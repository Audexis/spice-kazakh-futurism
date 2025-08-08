import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const languages = [
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'kk', flag: '🇰🇿', name: 'Қазақ' },
  { code: 'zh', flag: '🇨🇳', name: '中文' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'hi', flag: '🇮🇳', name: 'हिन्दी' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
];

let isInitialized = false;

export const GoogleTranslate = () => {
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize Google Translate
    if (isInitialized) return;

    window.googleTranslateElementInit = () => {
      if (isInitialized) return;
      
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: languages.map(lang => lang.code).join(','),
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true,
          },
          'google_translate_element'
        );
        isInitialized = true;
        setIsLoaded(true);
      } catch (error) {
        console.log('Google Translate initialization error:', error);
      }
    };

    // Load script
    if (!window.google?.translate) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    } else {
      window.googleTranslateElementInit();
    }
  }, []);

  const changeLanguage = (language: typeof languages[0]) => {
    setCurrentLanguage(language);
    
    if (!isLoaded) return;
    
    // Wait for Google Translate to be ready, then trigger translation
    const triggerTranslation = () => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        // Find the correct option value for the language
        const options = selectElement.options;
        for (let i = 0; i < options.length; i++) {
          if (options[i].value.includes(language.code)) {
            selectElement.value = options[i].value;
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
            break;
          }
        }
      }
    };

    // Try multiple times with delays to ensure it works
    setTimeout(triggerTranslation, 100);
    setTimeout(triggerTranslation, 500);
    setTimeout(triggerTranslation, 1000);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Google Translate element - positioned off-screen but functional */}
      <div 
        id="google_translate_element" 
        className="absolute -left-[9999px] opacity-0 pointer-events-none"
        style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
      />
      
      {/* Custom flag-based switcher */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent">
            <span className="text-lg">{currentLanguage.flag}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 bg-background border border-border shadow-lg z-50" align="end">
          <div className="flex flex-col space-y-1">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={currentLanguage.code === lang.code ? "default" : "ghost"}
                size="sm"
                onClick={() => changeLanguage(lang)}
                className="justify-start gap-2 text-sm min-w-[140px] hover:bg-accent"
              >
                <span className="text-base">{lang.flag}</span>
                {lang.name}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};