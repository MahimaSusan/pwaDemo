// // Install the service worker.
// this.addEventListener('install', function(event) {
//   event.waitUntil(
//     caches.open('v1').then(function(cache) {
//       // The cache will fail if any of these resources can't be saved.
//       return cache.addAll([
//           // Path is relative to the origin, not the app directory.
//           './images/gallery-img-2.jpg',
//           './images/gallery-img-3.jpg'
//         ])
//         .then(function() {
//           console.log('Success! App is available offline!');
//         })
//     })
//   );
// });

// // Define what happens when a resource is requested.
// // For our app we do a Cache-first approach.
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     // Try the cache.
//     caches.match(event.request)
//     .then(function(response) {
//       // Fallback to network if resource not stored in cache.
//       return response || fetch(event.request);
//     })
//   );
// });
var CACHE_NAME = 'Trip-Cache';
var urlsToCache = [
  './images/gallery-img-2.jpg',
          './images/gallery-img-3.jpg'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});


self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});