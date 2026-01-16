// static/js/sw.js
// Incremented to v10 to force clean update for Dashboard & CSS
const CACHE_NAME = 'mate-cache-v11';

const STATIC_ASSETS = [
  '/',
  '/journal',
  '/projects',
  '/about',
  '/resources',
  '/static/css/style.css',
  '/static/js/script.js',
  '/static/js/storage.js',
  '/static/js/browser.js',
  '/static/js/thirdparty.js',
  '/static/images/1.png',
  '/static/images/temp.webp',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

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

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // NETWORK FIRST: Use for HTML and API calls to reflections.json
  if (event.request.headers.get('accept').includes('text/html') || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
  // CACHE FIRST: Use for static assets like CSS and JS
  else {
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    );
  }
});
