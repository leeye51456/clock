export function register(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((registration: ServiceWorkerRegistration) => {
          console.log(`ServiceWorker registration successful with scope: ${registration.scope}`);
        })
        .catch((error: any) => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
};
