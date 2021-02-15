const cacheName: string = 'clock-v0';
const urlsToCache: string[] = [
  './',
  './index.js',
  './index.css',
  './manifest.json',
];

self.addEventListener('install', (event: any) => {
  const promise: Promise<void> = caches.open(cacheName)
    .then((cache: Cache) => cache.addAll(urlsToCache));
  event.waitUntil(promise);
});

self.addEventListener('fetch', (event: any) => {
  const responsePromise: Promise<Response | undefined> = fetch(event.request)
    .then((response: Response) => {
      if (response.ok) {
        const responseToCache: Response = response.clone();
        caches.open(cacheName)
          .then((cache: Cache) => cache.put(event.request, responseToCache));
      }
      return response;
    })
    .catch(() => caches.match(event.request));
  event.respondWith(responsePromise);
});
