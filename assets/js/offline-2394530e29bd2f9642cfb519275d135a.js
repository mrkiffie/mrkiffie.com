"use strict";if(window.caches){caches.open("v3.0.0::pages").then(function(cache){cache.keys().then(function(keys){var cachedUrls=keys.map(function(req){return req.url});[].slice.call(document.querySelectorAll("main a")).forEach(function(a){if(cachedUrls.includes(a.href)){a.parentNode.hidden=false}})})})}