/**
 * Gulp Task: imagemin
 * Compress the image files
 */
import Registry from 'undertaker-registry'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import imagemin from 'gulp-imagemin'
import pngquant from 'imagemin-pngquant'
import debug from 'gulp-debug'
import path from 'path'
import config from '../config'

class Imagemin extends Registry {
  init(gulp) {
    gulp.task('imagemin', callback => {
      gulp
        .src(path.join(config.tasks.imagemin.path.source, config.tasks.imagemin.target), {
          base: config.tasks.imagemin.path.source,
        })
        .on('end', callback)
        .pipe(
          plumber({
            errorHandler: notify.onError('<%= error.message %>'),
          })
        )
        .pipe(
          imagemin([
            imagemin.gifsicle(),
            imagemin.jpegtran(),
            pngquant({ speed: 1 }),
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
          ])
        )
        .pipe(gulp.dest(config.tasks.imagemin.path.build))
        .pipe(debug({ title: 'imagemin:file' }))
    })
  }
}

export default new Imagemin()
