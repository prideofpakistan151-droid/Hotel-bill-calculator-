const CACHE_NAME = 'hostel-bill-v1';
const urlsToCache = [
  '/hostel-bill-app/',
  '/hostel-bill-app/index.html',
  '/hostel-bill-app/new-bill.html',
  '/hostel-bill-app/calculator.html',
  '/hostel-bill-app/previous-bills.html',
  '/hostel-bill-app/bill-detail.html',
  '/hostel-bill-app/styles/common.css',
  '/hostel-bill-app/styles/home.css',
  '/hostel-bill-app/styles/new-bill.css',
  '/hostel-bill-app/styles/calculator.css',
  '/hostel-bill-app/styles/previous-bills.css',
  '/hostel-bill-app/js/app.js',
  '/hostel-bill-app/js/storage.js',
  '/hostel-bill-app/js/calculator.js',
  '/hostel-bill-app/js/previous-bills.js',
  '/hostel-bill-app/manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
