/**
 * Gulp Task:  sass
 * SASS ファイルをコンパイルして出力
 */
import Registry from 'undertaker-registry'
import gulpIf from 'gulp-if'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import filter from 'gulp-filter'
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import assets from 'postcss-assets'
import cssMqpacker from 'css-mqpacker'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import sourcemaps from 'gulp-sourcemaps'
import debug from 'gulp-debug'
import path from 'path'
import config from '../config'

class Sass extends Registry {
  init(gulp) {
    gulp.task('sass', callback => {
      const processors = [
        cssMqpacker(),
        assets({
          relative: config.tasks.sass.genDir,
          basePath: path.join(config.dir.build, config.env, config.path),
        }),
        autoprefixer(),
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
      gulp
        .src(path.join(config.tasks.sass.path.source, config.tasks.sass.target), {
          base: config.tasks.sass.path.source,
        })
        .on('end', callback)
        .pipe(
          plumber({
            errorHandler: notify.onError('<%= error.message %>'),
          })
        )
        .pipe(gulpIf(config.env === 'development', sourcemaps.init()))
        // Skip outputting directories and files with underscores
        .pipe(filter(file => !/[/\\]_/.test(file.path) || !/^_/.test(file.relative)))
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(gulpIf(config.env === 'development', sourcemaps.write()))
        .pipe(gulp.dest(config.tasks.sass.path.build))
        .pipe(debug({ title: 'sass:file' }))
    })
  }
}

export default new Sass()
