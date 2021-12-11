#!/usr/bin/env node

"use strict";

import { join } from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { Renderer } from "marked";
import metalsmith from "metalsmith";
import babel from "metalsmith-babel";
import collections from "metalsmith-collections";
import fingerprint from "metalsmith-fingerprint-ignore";
import htmlmin from "metalsmith-html-minifier";
import msif from "metalsmith-if";
import discoverHelpers from "metalsmith-discover-helpers";
import discoverPartials from "metalsmith-discover-partials";
import layouts from "metalsmith-layouts";
import less from "metalsmith-less";
import markdown from "metalsmith-markdown";
import moveup from "metalsmith-move-up";
import permalinks from "metalsmith-permalinks";
import prism from "metalsmith-prism";
import serve from "metalsmith-serve";
import watch from "metalsmith-watch";

import importJson from "./scripts/helpers/importJson.mjs";
import remove from "./scripts/plugins/remove.mjs";
import fingerprintMeta from "./scripts/plugins/fingerprint-meta.mjs";
import addStyle from "./scripts/plugins/add-styles.mjs";
import addScript from "./scripts/plugins/add-scripts.mjs";
import replaceVersion from "./scripts/plugins/replace-version.mjs";
import updateMarkdownToHtml from "./scripts/plugins/update-md-to-html.mjs";

const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * The build pipeline
 */
async function build() {

  const site = await importJson('./src/content/site.json', import.meta.url)
  const packageJson = await importJson('./package.json', import.meta.url)

  metalsmith(join(__dirname))
    .metadata({
      site,
      package: packageJson,
    })
    .use(replaceVersion())
    .use(
      babel({
        presets: ["@babel/preset-env"],
        sourceMaps: isDev,
        compact: isProd,
        comments: isDev,
        minified: isProd,
      })
    )
    .use(
      less({
        render: {
          compress: true,
        },
        useDynamicSourceMap: true,
      })
    )
    .use(
      msif(
        isProd,
        fingerprint({
          pattern: ["**/css/*.css", "**/js/*.js", "**/*.svg", "**/*.jpg"],
        })
      )
    )
    .use(addStyle())
    .use(addScript())
    .use(
      collections({
        posts: {
          pattern: "content/posts/**/*",
          sortBy: "date",
          reverse: true,
          refer: false,
        },
      })
    )
    .use(
      moveup({
        pattern: "content/**/*",
      })
    )
    .use(
      moveup({
        pattern: "posts/**/*",
      })
    )
    .use(
      moveup({
        pattern: "static/**/*",
      })
    )
    .use(
      markdown({
        breaks: true,
        langPrefix: "language-",
        renderer: new Renderer(),
      })
    )
    .use(updateMarkdownToHtml())
    .use(prism())
    .use(
      permalinks({
        relative: false,
      })
    )
    .use(
      discoverHelpers({
        directory: "scripts/helpers",
        pattern: /\.cjs$/,
      })
    )
    .use(
      discoverPartials({
        directory: "src/layouts/partials",
        pattern: /\.hbs$/,
      })
    )
    .use(
      layouts({
        directory: "src/layouts",
        pattern: "**/*.html",
      })
    )
    .use(msif(isProd, fingerprintMeta()))
    .use(
      htmlmin({
        removeAttributeQuotes: false,
      })
    )
    .use(
      remove({
        pattern: ["**/layouts/**", "site.json", ".eslintrc"],
      })
    )
    .use(
      msif(
        isDev,
        watch({
          paths: {
            "${source}/**/*": true,
            "${source}/layouts/**/*": "**/*.md",
          },
          livereload: isDev,
        })
      )
    )
    .use(
      msif(
        isDev,
        serve({
          port: 7000,
          http_error_files: {
            // eslint-disable-line camelcase
            404: "/404.html",
          },
        })
      )
    )
    .destination(join(__dirname, "build"))
    .build((err) => {
      if (err) {
        throw err;
      }
    });

}


build();
