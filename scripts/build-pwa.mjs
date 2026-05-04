import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const swPath = path.join(distDir, 'sw.js');

const PRECACHE_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.ico',
  '.jpg',
  '.jpeg',
  '.js',
  '.json',
  '.png',
  '.svg',
  '.ttf',
  '.txt',
  '.webp',
  '.woff',
  '.woff2',
]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async entry => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(entryPath);
      }
      return [entryPath];
    }),
  );

  return files.flat();
}

function toPublicUrl(filePath) {
  const relativePath = path.relative(distDir, filePath).split(path.sep).join('/');
  return `/${relativePath}`;
}

function isPrecacheAsset(filePath) {
  if (path.basename(filePath) === 'sw.js') {
    return false;
  }

  return PRECACHE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function routePatternFor(publicUrl) {
  if (!publicUrl.includes('[')) {
    return null;
  }

  const escaped = publicUrl
    .replace(/\.html$/, '')
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\\\[\.{3}[^\]]+\\\]/g, '.+')
    .replace(/\\\[[^\]]+\\\]/g, '[^/]+');

  return `^${escaped}/?$`;
}

function buildRouteAliases(publicUrl) {
  if (!publicUrl.endsWith('.html')) {
    return [];
  }

  if (publicUrl === '/index.html') {
    return [['/', publicUrl], ['/index.html', publicUrl]];
  }

  if (publicUrl.endsWith('/index.html')) {
    const routePath = publicUrl.slice(0, -'/index.html'.length) || '/';
    return [[routePath, publicUrl], [`${routePath}/`, publicUrl]];
  }

  const routePath = publicUrl.slice(0, -'.html'.length);
  return [[routePath, publicUrl], [`${routePath}/`, publicUrl]];
}

async function build() {
  const distStats = await stat(distDir).catch(() => null);

  if (!distStats?.isDirectory()) {
    throw new Error('dist directory not found. Run `expo export --platform web` first.');
  }

  await mkdir(distDir, { recursive: true });

  const files = await walk(distDir);
  const precacheUrls = [];
  const routeAliases = {};
  const dynamicRouteFallbacks = [];

  for (const filePath of files) {
    if (!isPrecacheAsset(filePath)) {
      continue;
    }

    const publicUrl = toPublicUrl(filePath);
    precacheUrls.push(publicUrl);

    for (const [alias, target] of buildRouteAliases(publicUrl)) {
      routeAliases[alias] = target;
    }

    const pattern = routePatternFor(publicUrl);
    if (pattern) {
      dynamicRouteFallbacks.push([pattern, publicUrl]);
    }
  }

  const cacheVersion = Date.now().toString();
  const serviceWorkerSource = `const CACHE_NAME = 'bubbles-pwa-${cacheVersion}';
const PRECACHE_URLS = ${JSON.stringify(precacheUrls.sort(), null, 2)};
const ROUTE_ALIASES = ${JSON.stringify(routeAliases, null, 2)};
const DYNAMIC_ROUTE_FALLBACKS = ${JSON.stringify(dynamicRouteFallbacks, null, 2)};

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      )
    ).then(() => self.clients.claim())
  );
});

function resolveNavigationTarget(pathname) {
  if (ROUTE_ALIASES[pathname]) {
    return ROUTE_ALIASES[pathname];
  }

  for (const [pattern, target] of DYNAMIC_ROUTE_FALLBACKS) {
    if (new RegExp(pattern).test(pathname)) {
      return target;
    }
  }

  return '/index.html';
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (_error) {
    return cache.match(request);
  }
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request).then(async response => {
        if (response) {
          return response;
        }

        const cache = await caches.open(CACHE_NAME);
        const fallbackTarget = resolveNavigationTarget(url.pathname);
        return (await cache.match(fallbackTarget)) || (await cache.match('/index.html'));
      })
    );
    return;
  }

  event.respondWith(cacheFirst(request));
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
`;

  await writeFile(swPath, serviceWorkerSource);

  const manifestPath = path.join(distDir, 'manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const normalizedManifest = {
    ...manifest,
    start_url: manifest.start_url ?? '/',
    scope: manifest.scope ?? '/',
  };
  await writeFile(manifestPath, `${JSON.stringify(normalizedManifest, null, 2)}\n`);

  console.log(`Generated ${path.relative(projectRoot, swPath)} with ${precacheUrls.length} precached assets.`);
}

build().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
