/**
 * Dependency
 */
const multimatch = require('multimatch');

module.exports = function remove(options) {
  'use strict';

  return function(files, metalsmith, done) {
    setImmediate(done);

    Object.keys(files)
      .filter(function(file) {
        return multimatch(file, options.pattern).length > 0;
      })
      .forEach(function(file) {
        delete files[file];
      });
    return;
  };
};
