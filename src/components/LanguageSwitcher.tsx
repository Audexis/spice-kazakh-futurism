import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const languages = [
  { code: 'en' as Language, flag: '🇬🇧', name: 'English' },
  { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' },
];

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="text-lg">{currentLanguage.flag}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end">
        <div className="flex flex-col space-y-1">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? "default" : "ghost"}
              size="sm"
              onClick={() => setLanguage(lang.code)}
              className="justify-start gap-2 text-sm"
            >
              <span className="text-base">{lang.flag}</span>
              {lang.name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};