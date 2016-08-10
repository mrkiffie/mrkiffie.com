if (window.caches) {
  // Display posts that are available offline
  caches.open('v{{ PACKAGE.VERSION }}::pages')
    .then(function(cache) {
      cache.keys()
        .then(function(keys) {
          var cachedUrls = keys.map(function(req) {
            return req.url;
          });
          [].slice.call(document.querySelectorAll('main a')).map(function(a) {
            if (cachedUrls.indexOf(a.href) > -1) {
              a.parentNode.hidden = false;
            }
          });
        });
    });
}
