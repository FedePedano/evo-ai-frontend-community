import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

import { AppLogo } from '@/components/AppLogo';
import { BeexaWordmark } from '@/components/BeexaWordmark';

interface LoadingScreenProps {
  fullScreen?: boolean;
  showLogo?: boolean;
  className?: string;
}

const LoadingScreen = ({ fullScreen = false, showLogo = false, className }: LoadingScreenProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-neutral-background-default',
        fullScreen && 'h-screen',
        className,
      )}
    >
      {showLogo && (
        <div className="flex flex-col items-center gap-1 mb-4">
          <AppLogo className="w-1/4" />
          <BeexaWordmark className="h-8 w-auto text-[#171717] dark:text-white" />
        </div>
      )}
      <Loader2
        className={cn(
          'h-8 w-8 animate-spin text-primary-interaction-default dark:text-primary-surface-default'
        )}
      />
    </div>
  );
};

export default LoadingScreen;
