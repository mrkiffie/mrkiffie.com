# [mrkiffie.com](http://mrkiffie.com)

This is my static site generator. It uses metalsmith to do most of the heavy lifting.

## Installation

``` bash
git clone https://github.com/mrkiffie/mrkiffie.com.git mrkiffie.com
cd mrkiffie.com
npm install
npm start
```


### `npm start`

Starts a development server instance on `http://localhost:7000`

**Features:**
- uses nodemon to watch files used for the build process and will restart when file changes are detected
- changes to source files trigger a rebuild
- livereload support


### `npm run build`

Starts a server instance similar to the development server, except for the following

**Features:**
- fingerprints the asset files - useful for aggressive caching and cache busting. livereload is disabled as the fingerprints require an entire page refresh

## Source files

The source files are structured as described by the following tree

```
 src/
 ├── assets/
 │   ├── css/           // styles css and less
 │   ├── img/
 │   └── favicon.ico
 ├── content/
 │   ├── posts/
 │   │   ├── <year>/    // these contain posts in markdown organized by year
 │   ├── 404.md         // customizable 404
 │   ├── about.md       // example of a page
 │   └── site.json      // contains site meta data, e.g. title, links, etc.
 └── layouts/
     ├── partials/
     │   ├── footer.hbs
     │   ├── header.hbs
     │   └── html-head.hbs
     ├── blog-index.hbs
     ├── blog-post.hbs
     └── index.hbs
```


## Frontmatter

Certain frontmatter has special value to the build system.

### Example list page
``` md
---
title: Writings
layout: blog-index.hbs
listing: true
---
```

- `title` is the title used in the `<title>` tag and the main heading (`h1`).
- `layout` specifies the layout template to use - relative to the `layouts` dir.
- `listing: true` is meta data used exclude links to themselves in the list. This is done at the template level.


### Example blog post
``` md
---
title: "in and around my head"
date: 2007-08-01
category: "random"
layout: blog-post.hbs
styles:
    - "fancy-quotes.css"
---
```

- `date` is the date that the post was created and is used in the listing and article pages.
- `category` currently not used - historical categorization retained for possible future use.
- `styles` is an array of additional css files to include - the base stylesheet is automatically included for each page.

### Example 404
``` md
---
layout: index.hbs
permalink: false
robots: "noindex, follow"
title: 404
---
```

- `permalink: false` disables the permalink middleware. The `404.md` file will be output as `404.html` instead of `404/index.html`.
- `robots` allows you to overwrite robots meta tag rules - defaults to `index, follow`.
