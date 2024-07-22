self.addEventListener('push', event => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon,
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/alerts/')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
