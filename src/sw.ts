const cacheName: string = 'clock-v0';
const urlsToCache: string[] = [
  './',
  './index.js',
  './index.css',
  './manifest.json',
];

self.addEventListener('install', (event: any) => {
  const promise: Promise<void> = caches.open(cacheName)
    .then((cache: Cache) => {
      return cache.addAll(urlsToCache);
    });
  event.waitUntil(promise);
});

self.addEventListener('fetch', (event: any) => {
  const responsePromise: Promise<Response> = caches.match(event.request)
    .then((response?: Response) => {
      if (response) {
        console.log('Cache hit');
        return response;
      }
      console.log('Cache miss');
      return fetch(event.request);
    });
  event.respondWith(responsePromise);
});
