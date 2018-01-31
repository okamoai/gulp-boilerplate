/**
 * Gulp Task: eslint
 * Format checking of JavaScript file with ESLint
 */
import path from 'path'
import gulp from 'gulp'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import eslint from 'gulp-eslint'
import config from '../config'

gulp.task('eslint', () => {
  gulp.src(path.join(
    config.tasks[config.defaultTasks.js].path.source,
    config.tasks[config.defaultTasks.js].target,
  ))
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>'),
    }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
})
