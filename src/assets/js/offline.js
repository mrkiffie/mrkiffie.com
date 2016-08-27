if (window.caches) {
  // Display posts that are available offline
  caches.open('v{{ PACKAGE.VERSION }}::pages')
    .then(cache => {
      cache.keys()
        .then(keys => {
          const cachedUrls = keys.map(req => req.url);
          [].slice.call(document.querySelectorAll('main a')).forEach(a => {
            if (cachedUrls.includes(a.href)) {
              a.parentNode.hidden = false;
            }
          });
        });
    });
}
