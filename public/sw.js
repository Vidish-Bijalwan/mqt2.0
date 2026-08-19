const CACHE_NAME = 'mqt-v1';
const STATIC_ASSETS = [
  '/',
  '/packages',
  '/blog',
  '/reviews',
  '/contact-us',
  '/about-us',
  '/favicon.svg',
  '/images/mqt-logo-256.webp',
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip API routes and dynamic imports
  if (event.request.url.includes('/api/') || event.request.url.includes('/_next/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response before caching
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((response) => {
          if (response) return response;
          // If it's a page request, return offline page
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});
