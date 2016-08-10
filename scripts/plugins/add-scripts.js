module.exports = function addScripts() {
  'use strict';
  return function(files, metalsmith, done) {
    for (var file in files) {
      if (file.match(/\.md$/)) {
        let scripts = files[file].scripts || [];
        if (scripts.indexOf('main.js') === -1) {
          scripts.unshift('main.js');
        }
        files[file].scripts = scripts.map(script => `assets/js/${script}`);
      }
    }
    done();
  };
};
