import type { CSSProperties } from 'react';
import logoBeexa from '../assets/logo-beexa.png';

interface AppLogoProps {
  className?: string;
  alt?: string;
  style?: CSSProperties;
  forceTheme?: 'dark' | 'light';
}

export function AppLogo({ className, alt = 'Beexa', style }: AppLogoProps) {
  return <img src={logoBeexa} alt={alt} className={className} style={style} />;
}
