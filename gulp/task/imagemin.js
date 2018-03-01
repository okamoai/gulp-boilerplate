/**
 * Gulp Task: imagemin
 * Compress the image files
 */
import path from 'path'
import gulp from 'gulp'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import imagemin from 'gulp-imagemin'
import pngquant from 'imagemin-pngquant'
import debug from 'gulp-debug'
import config from '../config'

gulp.task('imagemin', callback => {
  gulp
    .src(path.join(config.tasks.imagemin.path.source, config.tasks.imagemin.target))
    .on('end', callback)
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>'),
    }))
    .pipe(imagemin([
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
    ]))
    .pipe(gulp.dest(config.tasks.imagemin.path.build))
    .pipe(debug({ title: 'imagemin:file' }))
})
