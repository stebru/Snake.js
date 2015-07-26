var CACHE_NAME = 'snake-cache-v3';
var urls = [
  'index.html',
  '/dist/bundle.js',
  '/dist/style.css'
];

self.addEventListener('install', function(event) {
  event.waitUntil(function() {
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urls);
    });
  });
});

self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['snake-cache-v2'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (~~cacheWhitelist.indexOf(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
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

      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        var responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then(function(cache) {
            cache.put(event.request, responseToCache);
          });

        return reponse;
      });
    })
  );
});
