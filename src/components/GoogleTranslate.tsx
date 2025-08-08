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
    if (isInitialized) {
      console.log('Google Translate already initialized');
      return;
    }

    console.log('Initializing Google Translate...');

    window.googleTranslateElementInit = () => {
      if (isInitialized) return;
      
      try {
        console.log('Creating Google Translate Element...');
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
        console.log('Google Translate initialized successfully');
        
        // Debug: Log available options after a delay
        setTimeout(() => {
          const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          if (selectElement) {
            console.log('Google Translate dropdown found with options:', Array.from(selectElement.options).map(opt => ({ value: opt.value, text: opt.text })));
          } else {
            console.log('Google Translate dropdown not found');
          }
        }, 2000);
      } catch (error) {
        console.error('Google Translate initialization error:', error);
      }
    };

    // Load script
    if (!window.google?.translate) {
      console.log('Loading Google Translate script...');
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onload = () => console.log('Google Translate script loaded');
      script.onerror = () => console.error('Failed to load Google Translate script');
      document.head.appendChild(script);
    } else {
      console.log('Google Translate already available, initializing...');
      window.googleTranslateElementInit();
    }
  }, []);

  const changeLanguage = (language: typeof languages[0]) => {
    console.log('Changing language to:', language.name, language.code);
    setCurrentLanguage(language);
    
    if (!isLoaded) {
      console.log('Google Translate not loaded yet, skipping translation');
      return;
    }
    
    // Wait for Google Translate to be ready, then trigger translation
    const triggerTranslation = () => {
      console.log('Attempting to trigger translation...');
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        console.log('Found Google Translate dropdown');
        
        // Log all available options
        const options = Array.from(selectElement.options);
        console.log('Available translation options:', options.map(opt => ({ value: opt.value, text: opt.text })));
        
        // Find the correct option value for the language
        let foundOption = false;
        for (let i = 0; i < options.length; i++) {
          const optionValue = options[i].value;
          const optionText = options[i].text;
          
          // Try multiple matching strategies
          if (optionValue.includes(language.code) || 
              optionValue === language.code || 
              optionText.toLowerCase().includes(language.name.toLowerCase())) {
            console.log('Found matching option:', { value: optionValue, text: optionText });
            selectElement.value = optionValue;
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
            foundOption = true;
            break;
          }
        }
        
        if (!foundOption) {
          console.log('No matching option found for language:', language.code);
        }
      } else {
        console.log('Google Translate dropdown not found');
      }
    };

    // Try multiple times with delays to ensure it works
    setTimeout(triggerTranslation, 100);
    setTimeout(triggerTranslation, 500);
    setTimeout(triggerTranslation, 1000);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Google Translate element - visually hidden but accessible */}
      <div 
        id="google_translate_element" 
        style={{ 
          position: 'absolute',
          top: '-1px',
          left: '-1px', 
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0'
        }}
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