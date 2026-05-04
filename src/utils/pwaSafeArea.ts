import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Edge = 'top' | 'bottom' | 'left' | 'right';

type Insets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

function readCssInset(edge: Edge) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 0;
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--pwa-safe-area-${edge}`)
    .trim();

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isStandaloneWebApp() {
  if (typeof window === 'undefined') {
    return false;
  }

  return Boolean(
    window.matchMedia?.('(display-mode: standalone)').matches
    || (window.navigator as Navigator & { standalone?: boolean }).standalone
  );
}

export function useAppSafeAreaInsets(): Insets {
  const insets = useSafeAreaInsets();
  const [cssInsets, setCssInsets] = useState<Insets>({ top: 0, bottom: 0, left: 0, right: 0 });

  useEffect(() => {
    if (Platform.OS !== 'web' || !isStandaloneWebApp()) {
      return;
    }

    const update = () => {
      setCssInsets({
        top: readCssInset('top'),
        bottom: readCssInset('bottom'),
        left: readCssInset('left'),
        right: readCssInset('right'),
      });
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (Platform.OS !== 'web' || !isStandaloneWebApp()) {
    return insets;
  }

  return {
    top: Math.max(insets.top, cssInsets.top),
    bottom: Math.max(insets.bottom, cssInsets.bottom),
    left: Math.max(insets.left, cssInsets.left),
    right: Math.max(insets.right, cssInsets.right),
  };
}
