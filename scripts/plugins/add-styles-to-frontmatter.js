module.exports = function addstyles() {
  'use strict';
  return function (files, metalsmith, done){
    for (var file in files) {
      if (file.match(/\.md$/)) {
        let styles = files[file].styles || [];
        if (styles.indexOf('styles.css') == -1) {
          styles.unshift('styles.css');
        }
        files[file].styles = styles.map(style => `assets/css/${style}`);
      }
    }
    done();
  };
};
