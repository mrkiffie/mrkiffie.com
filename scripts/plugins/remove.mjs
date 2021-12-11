import multimatch from "multimatch";

export default (options) => {
  "use strict";
  return (files, metalsmith, done) => {
    setImmediate(done);
    Object.keys(files)
      .filter((file) => multimatch(file, options.pattern).length > 0)
      .forEach((file) => delete files[file]);
  };
};
