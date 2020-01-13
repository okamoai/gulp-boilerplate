/**
 * Gulp Task:  font
 * Generate web font, CSS and sample from SVG files
 */
import Registry from 'undertaker-registry'
import gulpIf from 'gulp-if'
import rename from 'gulp-rename'
import iconfont from 'gulp-iconfont'
import imagemin from 'gulp-imagemin'
import consolidate from 'gulp-consolidate'
import debug from 'gulp-debug'
import fs from 'fs'
import crc from 'crc'
import path from 'path'
import glob from 'glob'
import config from '../config'

class Font extends Registry {
  init(gulp) {
    gulp.task('font', callback => {
      const taskExecuted = { base: false }
      // Notify end of task
      const onEnd = name => {
        taskExecuted[name] = true
        if (Object.keys(taskExecuted).every(key => taskExecuted[key])) {
          callback()
        }
      }
      // Get a information of web font resource
      const fonts = {}
      const fontFilePath = glob.sync(
        path.join(config.tasks.font.path.source, config.tasks.font.target),
      )
      fontFilePath.forEach(filePath => {
        const normalizeFilePath = path.normalize(filePath)
        const file = path.parse(normalizeFilePath)
        const dirs = file.dir.split(path.sep)
        const lastDir = dirs.pop()
        if (lastDir.match(/^_(.+?)$/)) {
          const fontName = RegExp.$1
          const fontPath = dirs.join(path.sep)
          const key = path.join(fontPath, lastDir)
          if (key in fonts) {
            fonts[key].items.push(normalizeFilePath)
          } else {
            fonts[key] = {
              name: fontName,
              path: fontPath,
              items: [normalizeFilePath],
            }
            taskExecuted[`css:${key}`] = false
            taskExecuted[`font:${key}`] = false
          }
        }
      })
      // Generate Based CSS Extends
      gulp
        .src(config.tasks.font.template[config.defaultTasks.css].base, {
          base: config.tasks.font.path.template,
        })
        .on('end', () => onEnd('base'))
        .pipe(consolidate('lodash', { className: config.tasks.font.className }))
        .pipe(
          rename({
            prefix: '_',
            basename: 'base',
          }),
        )
        .pipe(gulp.dest(config.tasks.font.path.css))
        .pipe(debug({ title: `font:${config.defaultTasks.css}-base` }))

      // Generate CSS Extends, Web fonts, Sample files
      Object.keys(fonts).forEach(key => {
        const fontName = fonts[key].name
        const fontFiles = fonts[key].items
        const fontPath = fonts[key].path
          .split(path.sep)
          .filter((dir, idx) => {
            const sourceDirs = config.tasks.font.path.source.split(path.sep)
            return dir !== sourceDirs[idx]
          })
          .join(path.sep)
        gulp
          .src(fontFiles, { base: config.tasks.font.path.source })
          .on('end', () => onEnd(`font:${key}`))
          .pipe(
            gulpIf(
              config.env === 'development',
              imagemin([
                imagemin.svgo({
                  plugins: [
                    { removeRasterImages: true },
                    { cleanupListOfValues: true },
                    { sortAttrs: true },
                    { removeUselessStrokeAndFill: true },
                    { convertPathData: false },
                    { removeTitle: true },
                    { removeDesc: true },
                  ],
                }),
              ]),
            ),
          )
          .pipe(
            iconfont({
              fontName,
              prependUnicode: true,
              startUnicode: 0xf000,
              formats: ['woff2', 'woff', 'ttf'],
              normalize: true,
              fontHeight: 1000,
              timestamp: 0,
            }),
          )
          .on('glyphs', glyphs => {
            // for CRC Hash
            const fontsData = fontFiles.reduce(
              (concat, filePath) => concat + fs.readFileSync(filePath),
            )
            const cssfontPath = path.join(config.tasks.font.genDir, fontPath)
            // CSS Template Option
            const consolidateOption = {
              fontName,
              glyphs: glyphs.map(glyph => {
                const fontInfo = {
                  name: glyph.name,
                  codepoint: glyph.unicode[0].charCodeAt(),
                }
                return fontInfo
              }),
              fontPath: cssfontPath.split(path.sep).join('/'),
              className: config.tasks.font.className,
              hash: crc.crc32(fontsData),
            }
            // Generate CSS Extends
            const cssExtendPath = fontPath
              .split(path.sep)
              .filter(dir => dir !== fontName)
              .join(path.sep)
            gulp
              .src(config.tasks.font.template[config.defaultTasks.css].font, {
                base: config.tasks.font.path.template,
              })
              .on('end', () => onEnd(`css:${key}`))
              .pipe(consolidate('lodash', consolidateOption))
              .pipe(
                rename({
                  prefix: '_',
                  basename: fontName,
                }),
              )
              .pipe(gulp.dest(path.join(config.tasks.font.path.css, cssExtendPath)))
              .pipe(debug({ title: `font:${config.defaultTasks.css}-extend` }))
            // Generate sample files
            if (config.env === 'development') {
              // CSS
              gulp
                .src(config.tasks.font.template.sample.css, {
                  base: config.tasks.font.path.template,
                })
                .pipe(consolidate('lodash', consolidateOption))
                .pipe(rename({ basename: fontName }))
                .pipe(gulp.dest(path.join(config.tasks.font.path.sample, fontPath)))
                .pipe(debug({ title: 'font:sampleCSS' }))
              // HTML
              gulp
                .src(config.tasks.font.template.sample.html, {
                  base: config.tasks.font.path.template,
                })
                .pipe(consolidate('lodash', consolidateOption))
                .pipe(rename({ basename: fontName }))
                .pipe(gulp.dest(path.join(config.tasks.font.path.sample, fontPath)))
                .pipe(debug({ title: 'font:sampleHTML' }))
            }
          })
          .pipe(rename({ dirname: fontPath }))
          .pipe(gulp.dest(config.tasks.font.path.build))
          .pipe(debug({ title: 'font:file' }))
          .pipe(gulpIf(config.env === 'development', gulp.dest(config.tasks.font.path.sample)))
      }, fonts)
    })
  }
}

export default new Font()
