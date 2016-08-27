module.exports = () => {
  'use strict';
  return (files, metalsmith, done) => {
    setImmediate(done);
    Object.keys(files).forEach(file => {
      if (file.match(/\.md$/)) {
        const styles = files[file].styles || [];
        // Add `styles.css` if not already included
        if (styles.indexOf('styles.css') === -1) {
          styles.unshift('styles.css');
        }
        files[file].styles = styles.map(style => `assets/css/${style}`);
      }
    });
  };
};
