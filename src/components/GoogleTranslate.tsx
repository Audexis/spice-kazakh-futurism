import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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

export const GoogleTranslate = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const currentLang = i18n.language || 'en';
    return languages.find(lang => lang.code === currentLang) || languages[0];
  });

  const changeLanguage = async (language: typeof languages[0]) => {
    setCurrentLanguage(language);
    await i18n.changeLanguage(language.code);
    
    // Apply RTL direction for Arabic
    if (language.code === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language.code;
    }
  };

  return (
    <div className="flex items-center gap-2">
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