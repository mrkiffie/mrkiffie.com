module.exports = function fingerprintmeta() {
  'use strict';
  return function (files, metalsmith, done) {
    setImmediate(done);
    let map = metalsmith.metadata().fingerprint;
    Object.keys(files).forEach(file => {
      if (/\.(html|js)$/.test(file)) {
        const data = files[file];
        if (data.styles) {
          data.styles = data.styles.map(style => map[style]);
        }
        if (data.scripts) {
          data.scripts = data.scripts.map(script => map[script]);
        }
        let contents = data.contents.toString();
        Object.keys(map).forEach(find => {
          const replace = map[find];
          contents = contents.split(find).join(replace);
        });
        data.contents = new Buffer(contents);
      }
    });
  };
};
