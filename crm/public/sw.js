/**
 * FeedOS PWA Service Worker (Static App Shell Only)
 *
 * Security & Privacy Rules:
 * - Caches static shell assets only ('/', '/index.html', '/manifest.json', '/icon.svg', '/assets/*').
 * - NEVER intercepts or caches /api/*, /sanctum/*, /webhooks/*, auth requests, or any PII payload.
 * - Supports explicit logout cache wipe via { type: 'CLEAR_CACHES' }.
 * - Defers activation until user confirms update via { type: 'SKIP_WAITING' }.
 */

const CACHE_NAME = 'feedos-shell-v2';
const STATIC_SHELL_ASSETS = ['/', '/index.html', '/manifest.json', '/icon.svg'];
const NEVER_CACHE_PREFIXES = ['/api/', '/sanctum/', '/webhooks/', '/storage/'];

function isCacheableStaticRequest(request) {
  if (!request || request.method !== 'GET') return false;
  if (request.headers && request.headers.get('Authorization')) return false;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  if (NEVER_CACHE_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
    return false;
  }

  return (
    url.pathname === '/' ||
    url.pathname === '/index.html' ||
    url.pathname === '/manifest.json' ||
    url.pathname === '/icon.svg' ||
    url.pathname.startsWith('/assets/')
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_SHELL_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  const payload = event.data;
  if (!payload || typeof payload !== 'object') return;

  if (payload.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (payload.type === 'CLEAR_CACHES') {
    event.waitUntil(
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .then(() => {
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({ cleared: true });
          }
        })
    );
  }
});

self.addEventListener('fetch', (event) => {
  if (!isCacheableStaticRequest(event.request)) {
    return;
  }

  const url = new URL(event.request.url);
  const isNavigation =
    event.request.mode === 'navigate' ||
    url.pathname === '/' ||
    url.pathname === '/index.html';

  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      });
    })
  );
});
