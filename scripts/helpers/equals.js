module.exports = function(v1, v2, opts) {
  'use strict';
  return (v1 === v2) ? opts.fn(this) : opts.inverse(this);
};
