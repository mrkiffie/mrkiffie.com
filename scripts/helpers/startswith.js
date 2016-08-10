module.exports = function(v1, v2, opts) {
  'use strict';
  return (v1 && v1.indexOf(v2) === 0) ? opts.fn(this) : opts.inverse(this);
};
