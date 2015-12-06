module.exports = function fingerprintmeta() {
  'use strict';
  return function (files, metalsmith, done) {
    let map = metalsmith.metadata().fingerprint;
    for (var file in files) {
      if (files[file].styles) {
        files[file].styles = files[file].styles.map(style => map[style]);
      }
    }
    done();
  };
};
