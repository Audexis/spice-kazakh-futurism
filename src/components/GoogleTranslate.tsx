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

  useEffect(() => {
    // Initialize Google Translate invisibly
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
          'google_translate_element_hidden'
        );
        isInitialized = true;
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
    
    // Trigger Google Translate programmatically
    setTimeout(() => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = language.code;
        selectElement.dispatchEvent(new Event('change'));
      }
    }, 100);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Hidden Google Translate element */}
      <div id="google_translate_element_hidden" className="hidden" />
      
      {/* Custom flag-based switcher */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="text-lg">{currentLanguage.flag}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 bg-background border border-border shadow-lg" align="end">
          <div className="flex flex-col space-y-1">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={currentLanguage.code === lang.code ? "default" : "ghost"}
                size="sm"
                onClick={() => changeLanguage(lang)}
                className="justify-start gap-2 text-sm min-w-[140px]"
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