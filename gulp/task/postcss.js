/**
 * Gulp Task:  postcss
 * Compile and output the PostCSS file
 */
import Registry from 'undertaker-registry'
import gulpIf from 'gulp-if'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import filter from 'gulp-filter'
import postcss from 'gulp-postcss'
import rename from 'gulp-rename'
import debug from 'gulp-debug'
import sourcemaps from 'gulp-sourcemaps'
import cssnext from 'postcss-cssnext'
import pimport from 'postcss-partial-import'
import assets from 'postcss-assets'
import cssMqpacker from 'css-mqpacker'
import cssnano from 'cssnano'
import path from 'path'
import config from '../config'

class Postcss extends Registry {
  init(gulp) {
    gulp.task('postcss', () => {
      const processors = [
        pimport({
          prefix: '_',
        }),
        cssnext(),
        assets({
          basePath: path.join(config.dir.build, config.env, config.path),
          cachebuster: true,
        }),
        cssMqpacker(),
      ]
      if (config.env === 'production') {
        processors.push(
          cssnano({
            minifyFontValues: {
              removeQuotes: false,
            },
            zindex: false,
          })
        )
      }
      const gulpSrc = path.join(config.tasks.postcss.path.source, config.tasks.postcss.target)
      return (
        gulp
          .src(gulpSrc, { base: config.tasks.postcss.path.source })
          .pipe(gulpIf(config.env === 'development', sourcemaps.init()))
          .pipe(
            plumber({
              errorHandler: notify.onError('<%= error.message %>'),
            })
          )
          // Skip outputting directories and files with underscores
          .pipe(filter(file => !/[/\\]_/.test(file.path) || !/_/.test(file.relative)))
          .pipe(postcss(processors))
          .pipe(rename({ extname: '.css' }))
          .pipe(gulpIf(config.env === 'development', sourcemaps.write()))
          .pipe(gulp.dest(config.tasks.postcss.path.build))
          .pipe(debug({ title: 'postcss:file' }))
      )
    })
  }
}

export default new Postcss()
