import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

const baseUrl = process.env.EXPO_BASE_URL
  ? `/${process.env.EXPO_BASE_URL.replace(/^\/+/, '').replace(/\/$/, '')}`
  : '';

const serviceWorkerBootstrap = `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('${baseUrl}/sw.js').catch(error => {
      console.error('Service worker registration failed:', error);
    });
  });
}
`;

const safeAreaCss = `
:root {
  --pwa-safe-area-top: env(safe-area-inset-top, 0px);
  --pwa-safe-area-bottom: env(safe-area-inset-bottom, 0px);
  --pwa-safe-area-left: env(safe-area-inset-left, 0px);
  --pwa-safe-area-right: env(safe-area-inset-right, 0px);
}
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#050714" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Bubbles" />
        <link rel="manifest" href={`${baseUrl}/manifest.json`} />
        <link rel="apple-touch-icon" href={`${baseUrl}/apple-touch-icon.png`} />
        <style dangerouslySetInnerHTML={{ __html: safeAreaCss }} />
        <script dangerouslySetInnerHTML={{ __html: serviceWorkerBootstrap }} />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
