import { useLanguage } from '@/hooks/useLanguage';
import { Sun, Moon } from 'lucide-react';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@evoapi/design-system';
import { useDarkMode } from '../hooks/useDarkMode';

// `className` permite que cada pantalla alinee el toggle con sus controles
// vecinos (p.ej. el selector de idioma en Auth). Se combina con las clases
// base mediante twMerge, que usa el design system, de modo que lo pasado aquí
// pisa a los valores por defecto.
type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps = {}) {
  const { t } = useLanguage('common');
  const { toggleTheme } = useDarkMode();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={`h-8 w-8 p-0 hover:bg-neutral-surface-highlight cursor-pointer ${className ?? ''}`}
          aria-label={t('base.theme.toggle')}
        >
          {/* Mostra lua no light */}
          <Moon className="h-4 w-4 dark:hidden" />
          {/* Mostra sol no dark */}
          <Sun className="h-4 w-4 hidden dark:block" />
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        {/* Texto também via CSS, sem ler state */}
        <span className="dark:hidden">{t('base.theme.dark')}</span>
        <span className="hidden dark:inline">{t('base.theme.light')}</span>
      </TooltipContent>
    </Tooltip>
  );
}
