import path from 'path'
import config from 'config'

/* ========== Setting ========== */

const env = process.env.NODE_ENV || 'development'

// Project Directories information
const dir = {
  source: 'src',
  build: 'dist',
  sample: 'sample',
  template: 'src/template',
}

/* ========== Tasks ========== */
// Task Setting
const tasks = {}

// Default Tasks
const defaultTasks = {
  html: 'pug',
  css: 'sass',
  js: 'js',
  font: 'font',
  sprite: 'sprite',
  image: 'imagemin',
}

// Task: copy
tasks.copy = {
  target: '**/*',
  srcDir: 'static',
  genDir: '',
}
tasks.copy.path = {
  source: path.join(dir.source, tasks.copy.srcDir),
  build: path.join(dir.build, env, config.get('path')),
}
tasks.copy.replace = {
  target: ['.js', '.css', '.html'],
  regex: [
    {
      pattern: /\[\[genRoot\]\]/g,
      replacement: config.get('domain') + config.get('path'),
    },
    {
      pattern: /\[\[cdnRoot\]\]/g,
      replacement: config.get('cdn') + config.get('path'),
    },
  ],
}

// Task: pug
tasks.pug = {
  target: '**/*.pug',
  srcDir: 'pug',
  genDir: '',
  dataName: 'data',
  pretty: '    ',
}
tasks.pug.path = {
  source: path.join(dir.source, tasks.pug.srcDir),
  build: path.join(dir.build, env, config.get('path')),
}

// Task: ejs
tasks.ejs = {
  target: '**/*.ejs',
  srcDir: 'ejs',
  genDir: '',
  prettify: {
    indent_size: 4,
  },
}
tasks.ejs.path = {
  source: path.join(dir.source, tasks.ejs.srcDir),
  build: path.join(dir.build, env, config.get('path')),
}

// Tasks: sass
tasks.sass = {
  target: '**/*.scss',
  srcDir: 'sass',
  genDir: 'resources/css',
}
tasks.sass.path = {
  source: path.join(dir.source, tasks.sass.srcDir),
  build: path.join(dir.build, env, config.get('path'), tasks.sass.genDir),
}

// Tasks: PostCSS
tasks.postcss = {
  target: '**/*.css',
  srcDir: 'postcss',
  genDir: 'resources/css',
}
tasks.postcss.path = {
  source: path.join(dir.source, tasks.postcss.srcDir),
  build: path.join(dir.build, env, config.get('path'), tasks.postcss.genDir),
}

// Tasks: font
tasks.font = {
  target: '**/*.svg',
  srcDir: 'font',
  genDir: 'resources/font',
  className: 'icon',
}
tasks.font.path = {
  source: path.join(dir.source, tasks.font.srcDir),
  build: path.join(dir.build, env, config.get('path'), tasks.font.genDir),
  sample: path.join(dir.sample, tasks.font.srcDir),
  template: path.join(dir.source, tasks.font.srcDir, '_template'),
  css: path.join(tasks[defaultTasks.css].path.source, `_${tasks.font.className}`),
}
tasks.font.template = {
  sample: {
    css: path.join(tasks.font.path.template, 'sample.css'),
    html: path.join(tasks.font.path.template, 'sample.html'),
  },
  sass: {
    base: path.join(tasks.font.path.template, 'base.scss'),
    font: path.join(tasks.font.path.template, 'family.scss'),
  },
  postcss: {
    base: path.join(tasks.font.path.template, 'base.css'),
    font: path.join(tasks.font.path.template, 'family.css'),
  },
}

// Tasks: imagemin
tasks.imagemin = {
  target: '**/*.+(jpg|jpeg|png|gif|svg)',
  srcDir: 'img',
  genDir: 'resources/img',
}
tasks.imagemin.path = {
  source: path.join(dir.source, tasks.imagemin.srcDir),
  build: path.join(dir.build, env, config.get('path'), tasks.imagemin.genDir),
}

// Tasks: sprite
tasks.sprite = {
  target: '**/*.png',
  target2x: '**/*@2x.png',
  srcDir: 'img-sprite',
  genDir: 'resources/img',
  className: 'sprite',
  retina: true,
}
tasks.sprite.path = {
  source: path.join(dir.source, tasks.sprite.srcDir),
  build: path.join(dir.build, env, config.get('path'), tasks[defaultTasks.image].genDir),
  sample: path.join(dir.sample, tasks.sprite.srcDir),
  template: path.join(dir.source, tasks.sprite.srcDir, '_template'),
  css: path.join(tasks[defaultTasks.css].path.source, `_${tasks.sprite.className}`),
}
tasks.sprite.template = {
  sample: {
    css: path.join(tasks.sprite.path.template, 'sample.css'),
    html: path.join(tasks.sprite.path.template, 'sample.html'),
  },
  sass: {
    base: path.join(tasks.sprite.path.template, 'base.scss'),
    sprite: path.join(tasks.sprite.path.template, 'file.scss'),
  },
  postcss: {
    base: path.join(tasks.sprite.path.template, 'base.css'),
    sprite: path.join(tasks.sprite.path.template, 'file.css'),
  },
}

// Task: js
tasks.js = {
  babel: true,
  target: '**/*.js',
  srcDir: 'js',
  genDir: 'resources/js',
}
tasks.js.path = {
  source: path.join(dir.source, tasks.js.srcDir),
  build: path.join(dir.build, env, config.get('path'), tasks.js.genDir),
}

// Task: jsConcat
tasks.jsConcat = {
  target: '**/*.js',
  srcDir: 'js-concat',
  genDir: 'resources/js',
}
tasks.jsConcat.path = {
  source: path.join(dir.source, tasks.jsConcat.srcDir),
  build: path.join(dir.build, env, config.get('path'), tasks.jsConcat.genDir),
}

export default {
  env,
  dir,
  domain: config.get('domain'),
  cdn: config.get('cdn'),
  path: config.get('path'),
  tasks,
  defaultTasks,
}
