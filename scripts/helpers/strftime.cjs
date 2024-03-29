const strftime = require("strftime");

/**
 * @param {string} date
 * @param {string} format
 * @return {string}
 */
 module.exports = function (date, format) {
  "use strict";
  const parsedDate = new Date(date);

  format = typeof format === "string" && format ? format : "%e %b %Y";

  if (!(parsedDate instanceof Date && isFinite(parsedDate.getTime()))) {
    // If date is invalid (but not undefined) log error for debugging
    if (date && process.env.NODE_ENV !== "test") {
      console.error("[handlebars] strftime - Invalid date:", date);
    }
    return date;
  }

  return strftime(format, parsedDate);
};
