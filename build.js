#!/usr/bin/env node

'use strict';

const path = require('path');

const marked = require('marked');
const metalsmith = require('metalsmith');
const babel = require('metalsmith-babel');
const collections = require('metalsmith-collections');
const fingerprint = require('metalsmith-fingerprint-ignore');
const htmlmin = require('metalsmith-html-minifier');
const msif = require('metalsmith-if');
const layouts = require('metalsmith-layouts');
const less = require('metalsmith-less');
const markdown = require('metalsmith-markdown');
const moveup = require('metalsmith-move-up');
const permalinks = require('metalsmith-permalinks');
const prism = require('metalsmith-prism');
const serve = require('metalsmith-serve');
const watch = require('metalsmith-watch');
const yargs = require('yargs')
  .option('env', {
    alias: 'e',
    describe: 'choose the production env',
    choices: ['prod', 'dev'],
    default: 'dev'
  })
  .argv;

const remove = require('./scripts/plugins/remove');
const fingerprintMeta = require('./scripts/plugins/fingerprint-meta');
const addStyle = require('./scripts/plugins/add-styles');
const addScript = require('./scripts/plugins/add-scripts');
const replaceVersion = require('./scripts/plugins/replace-version');
const updateMarkdownToHtml = require('./scripts/plugins/update-md-to-html');

const isDev = yargs.env === 'dev';
const isProd = yargs.env === 'prod';

metalsmith(path.join(__dirname))
  .metadata({
    site: require(path.join(__dirname, 'src/content/site.json')),
    package: require(path.join(__dirname, 'package.json'))
  })
  .use(replaceVersion())
  .use(babel({
    presets: ['es2015'],
    sourceMaps: isDev,
    compact: isProd,
    comments: isDev,
    minified: isProd
  }))
  .use(less({
    render: {
      compress: true
    },
    useDynamicSourceMap: true
  }))
  .use(msif(
    isProd,
    fingerprint({
      pattern: ['**/css/*.css', '**/js/*.js', '**/*.svg', '**/*.jpg']
    })
  ))
  .use(addStyle())
  .use(addScript())
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
    pattern: 'static/**/*'
  }))
  .use(markdown({
    breaks: true,
    langPrefix: 'language-',
    renderer: new marked.Renderer()
  }))
  .use(updateMarkdownToHtml())
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
      strftime: require('./scripts/helpers/strftime.js')
    }
  }))
  .use(msif(
    isProd,
    fingerprintMeta()
  ))
  .use(htmlmin({
    removeAttributeQuotes: false
  }))
  .use(remove({
    pattern: ['**/layouts/**', 'site.json', '.eslintrc']
  }))
  .use(msif(
    isDev,
    watch({
      paths: {
        '${source}/**/*': true,
        '${source}/layouts/**/*': '**/*.md'
      },
      livereload: isDev
    })
  ))
  .use(msif(
    isDev,
    serve({
      port: 7000,
      http_error_files: { // eslint-disable-line camelcase
        404: '/404.html'
      }
    })
  ))
  .destination(path.join(__dirname, 'build'))
  .build(err => {
    if (err) {
      throw err;
    }
  });
