module.exports = () => {
  'use strict';
  return (files, metalsmith, done) => {
    setImmediate(done);
    Object.keys(files).forEach(file => {
      if (file.match(/\.md$/)) {
        const scripts = files[file].scripts || [];
        // Add `main.js` if not already included
        if (scripts.indexOf('main.js') === -1) {
          scripts.unshift('main.js');
        }
        files[file].scripts = scripts.map(script => `assets/js/${script}`);
      }
    });
  };
};
