import { useEffect, type CSSProperties } from 'react';
import AppRouter from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { DarkModeProvider } from './contexts/ThemeContext';
import ImpersonationBar from './components/ImpersonationBar';
import AppInitializer from './components/AppInitializer';
import { GlobalConfigProvider } from './contexts/GlobalConfigContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { PermissionsProvider } from './contexts/PermissionsContext';
import { UISettingsApplier } from './components/UISettingsApplier';
import { unlockAudioContext } from '@/utils/audioNotificationUtils';
import { PluginHostProvider, PluginSlot } from '@/plugin-host';

import { Toaster } from '@evoapi/design-system';

import { useIsDarkClass } from '@/hooks/chat/useIsDarkClass';

// Sonner with `richColors` reads these CSS vars. Passing `style` to the
// design-system Toaster REPLACES its defaults (it spreads props last), so the
// --normal-* trio has to be restated here or the toast loses its surface.
// `as CSSProperties` is required: @types/react 19 dropped the index signature
// on CSSProperties, so the literal's `--*` keys trip the excess-property check.
const toasterStyle = {
  // Cera Oscura (#2A2A2A) in dark, white in light. Deliberately --card and not
  // --popover: the design-system ships --popover as oklch(0.145 0 0) ≈ #252525,
  // which is darker than the brand's Cera Oscura.
  '--normal-bg': 'var(--card)',
  '--normal-text': 'var(--popover-foreground)',
  '--normal-border': 'var(--border)',

  // Success: solid Miel Ámbar with Negro Colmena text (≈13.5:1).
  '--success-bg': 'var(--bee-honey)',
  '--success-text': '#0A0A0A',
  '--success-border': 'var(--bee-honey)',

  // Warning: outlined, not filled. A filled amber warning is pixel-identical to
  // a filled amber success, so the two would be indistinguishable. --bee-alert
  // is the contrast-checked amber: 5.02:1 on white, 5.92:1 on Cera Oscura.
  '--warning-bg': 'var(--card)',
  '--warning-text': 'var(--bee-alert)',
  '--warning-border': 'var(--bee-honey)',
} as CSSProperties;

// Componente wrapper para o Toaster que usa o contexto de tema
function ThemedToaster() {
  const isDark = useIsDarkClass();

  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={2000}
      theme={isDark ? 'dark' : 'light'}
      style={toasterStyle}
    />
  );
}

function App() {
  useEffect(() => {
    // Try to unlock the AudioContext on the widest possible range of user
    // interactions so notification sounds work even if the user never clicked
    // or typed before switching tabs (the original EVO-977 scenario).
    const gestureEvents: Array<keyof WindowEventMap> = [
      'click',
      'keydown',
      'pointerdown',
      'touchstart',
    ];
    const unlock = () => unlockAudioContext();
    // `once: true` removes the listener automatically after first fire,
    // so no manual cleanup is needed for these.
    gestureEvents.forEach(evt => window.addEventListener(evt, unlock, { once: true }));

    // visibilitychange does not count as a user gesture, but when the tab
    // becomes visible again the browser usually allows resume() — try it.
    const onVisibility = () => {
      if (!document.hidden) unlockAudioContext();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <PluginHostProvider>
      <AuthProvider>
        <DarkModeProvider>
          <GlobalConfigProvider>
            <UISettingsApplier />
            {/* RouterGuard renders the same panel and knows which paths are
                public, so the provider must not block here (CRM-164). */}
            <PermissionsProvider blockOnLoadFailure={false}>
            <NotificationsProvider>
              <AppInitializer>
                <PluginSlot id="notifications.banner" />
                <ImpersonationBar />
                <AppRouter />
                <ThemedToaster />
              </AppInitializer>
            </NotificationsProvider>
            </PermissionsProvider>
          </GlobalConfigProvider>
        </DarkModeProvider>
      </AuthProvider>
    </PluginHostProvider>
  );
}

export default App;
