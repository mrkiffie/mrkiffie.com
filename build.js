#!/usr/bin/env node

(function () {

  'use strict';

  const path = require('path');
  const fs = require('fs');

  const marked = require('marked');
  const Metalsmith = require('metalsmith');
  const collections = require('metalsmith-collections');
  const fingerprint = require('metalsmith-fingerprint-ignore');
  const htmlmin = require('metalsmith-html-minifier');
  const layouts = require('metalsmith-layouts');
  const less = require('metalsmith-less');
  const markdown = require('metalsmith-markdown');
  const moveup = require('metalsmith-move-up');
  const permalinks = require('metalsmith-permalinks');
  const prism = require('metalsmith-prism');
  const serve = require('metalsmith-serve');
  const watch = require('metalsmith-watch');

  const fingerprintmeta = require('./scripts/plugins/fingerprint-meta');
  const addstyle = require('./scripts/plugins/add-styles-to-frontmatter');

  Metalsmith(path.join(__dirname))
    .metadata({
      site: require(path.join(__dirname, 'src/content/site.json'))
    })
    .use(less({
      useDynamicSourceMap: true
    }))
    .use(fingerprint({
      pattern: '**/*.css'
    }))
    .use(addstyle())
    .use(fingerprintmeta())
    .use(collections({
      posts: {
        pattern: 'content/posts/**/*',
        sortBy: 'date',
        reverse: true,
        refer: false
      }
    }))
    .use(moveup({
      pattern: 'content/**/*'
    }))
    .use(moveup({
      pattern: 'posts/**/*'
    }))
    .use(moveup({
      pattern: 'assets/favicon.ico'
    }))
    .use(markdown({
      breaks: true,
      langPrefix: 'language-',
      renderer: new marked.Renderer()
    }))
    .use(prism())
    .use(permalinks({
      relative: false
    }))
    .use(layouts({
      engine: 'handlebars',
      directory: 'src/layouts',
      pattern: '**/*.html',
      partials: 'src/layouts/partials',
      helpers: {
        equals: require('./scripts/helpers/equals.js'),
        startswith: require('./scripts/helpers/startswith.js'),
        strftime: require('./scripts/helpers/strftime.js'),
      }
    }))
    .use(htmlmin({
      removeAttributeQuotes: false
    }))
    .use(watch({
      livereload: true
    }))
    .use(serve({
      port: 7000,
      http_error_files: {
        404: "/404.html"
      }
    }))
    .destination(path.join(__dirname, 'build'))
    .build((err, files) => {
      if (err) {
        throw err;
      }
    });

}());
