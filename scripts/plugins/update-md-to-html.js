module.exports = () => {
  'use strict';
  return (files, metalsmith, done) => {
    setImmediate(done);
    Object.keys(files).forEach(file => {
      if (/\.html$/.test(file)) {
        // change the extension for folowing plugins
        files[file].path = files[file].path.replace(/(\.md)$/, '.html');
      }
    });
  };
};

