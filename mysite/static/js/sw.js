// static/js/sw.js
// Service Worker for Lab 7

const CACHE_NAME = 'mate-cache-v2'; // Changed to v2 to force update
const STATIC_ASSETS = [
  '/',
  '/journal',
  '/projects',
  '/about',
  '/static/css/style.css',
  '/static/js/script.js',
  '/static/js/storage.js',
  '/static/js/browser.js',
  '/static/js/thirdparty.js',
  '/static/images/1.png',
  '/static/images/temp.webp',
  '/manifest.json'
];

// 1. INSTALL
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// 2. ACTIVATE
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// 3. FETCH
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network First (API & HTML)
  if (event.request.headers.get('accept').includes('text/html') || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
  // Cache First (Static Assets)
  else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
