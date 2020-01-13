/**
 * Gulp Task: eslint
 * Format checking of JavaScript file with ESLint
 */
import Registry from 'undertaker-registry'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import eslint from 'gulp-eslint'
import path from 'path'
import config from '../config'

class Eslint extends Registry {
  init(gulp) {
    gulp.task('eslint', callback => {
      gulp
        .src(
          path.join(
            config.tasks[config.defaultTasks.js].path.source,
            config.tasks[config.defaultTasks.js].target,
          ),
        )
        .on('end', callback)
        .pipe(
          plumber({
            errorHandler: notify.onError('<%= error.message %>'),
          }),
        )
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError())
    })
  }
}

export default new Eslint()
