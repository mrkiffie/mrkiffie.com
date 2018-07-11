'use strict';

const version = 'v1.0.2::';
const staticCacheName = version + 'static';
const pagesCacheName = version + 'pages';
const imagesCacheName = version + 'images';

const updateStaticCache = () => {
  return caches.open(staticCacheName)
    .then(cache => {
      // These items won't block the installation of the Service Worker
      cache.addAll([
        '/about/'
      ]);
      // These items must be cached for the
      // Service Worker to complete installation
      return cache.addAll([
        '/assets/css/styles-e0c5db6f0b73c58b432286fb1d006868.css',
        '/assets/css/prism-9447029b855d2852d32e461a8c0f5729.css',
        '/assets/css/fancy-quotes-b49d96fdd613180d167a875328fd7743.css',
        '/assets/img/kiffie-144x144-84eee0bbb8fea04de91bbd15bdd31fc2.jpg',
        '/assets/img/offline-8e184112da766b2d403b8b0f3bad1fcb.svg',
        '/assets/js/main-ecb2c5597aca5c9f307012fc6f797964.js',
        '/assets/js/offline-6292c727f044bbc08cf633af5d5fc77d.js',
        '/',
        '/offline/'
      ]);
    });
};

const stashInCache = (cacheName, request, response) => {
  if (response.status === 200) {
    caches.open(cacheName)
      .then(cache => cache.put(request, response));
  }
};

// Limit the number of items in a specified cache.
const trimCache = (cacheName, maxItems) => {
  caches.open(cacheName)
    .then(cache => {
      cache.keys()
        .then(keys => {
          if (keys.length > maxItems) {
            cache.delete(keys[0])
              .then(trimCache(cacheName, maxItems));
          }
        });
    });
};

// Remove caches whose name is no longer valid
const clearOldCaches = () => {
  return caches.keys()
    .then(keys => {
      return Promise.all(keys
        .filter(key => !key.includes(version))
        .map(key => caches.delete(key))
      );
    });
};

self.addEventListener('install', event => {
  event.waitUntil(updateStaticCache()
    .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clearOldCaches()
    .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data.command === 'trimCaches') {
    trimCache(pagesCacheName, 25);
    trimCache(imagesCacheName, 15);
  }
});

self.addEventListener('fetch', event => {
  let request = event.request;
  const url = new URL(request.url);

  // Limit scope of handling requests to current domain
  if (url.origin !== location.origin) {
    return;
  }

  // For HTML requests,
  // try the network first,
  // fall back to the cache,
  // finally the offline page
  if (request.headers.get('Accept').includes('text/html')) {
    request = new Request(url, {
      method: 'GET',
      headers: request.headers,
      mode: request.mode === 'navigate' ? 'cors' : request.mode,
      credentials: request.credentials,
      redirect: request.redirect
    });
    event.respondWith(
      fetch(request)
        .then(response => {
          // NETWORK
          // Stash a copy of this page in the pages cache
          stashInCache(pagesCacheName, request, response.clone());
          return response;
        })
        .catch(() => {
          // CACHE or FALLBACK
          return caches.match(request)
            .then(response => response || caches.match('/offline/'));
        })
    );
    return;
  }

  // For non-HTML requests, look in the cache first, fall back to the network
  event.respondWith(
    caches.match(request)
      .then(response => {
        // CACHE
        return response || fetch(request)
          .then(response => {
            // NETWORK
            // If the request is for an image,
            // stash a copy of this image in the images cache
            if (request.headers.get('Accept').includes('image')) {
              stashInCache(imagesCacheName, request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // OFFLINE
            // If the request is for an image, show an offline placeholder
            if (request.headers.get('Accept').includes('image')) {
              return caches.match('/assets/img/offline-8e184112da766b2d403b8b0f3bad1fcb.svg');
            }
          });
      })
  );
});
