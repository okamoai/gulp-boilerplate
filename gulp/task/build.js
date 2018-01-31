/**
 * Gulp Task: build
 * Clear and build all the data
 */
import gulp from 'gulp'
import runSequence from 'run-sequence'
import config from '../config'

runSequence.use(gulp)

gulp.task('build', callback => {
  runSequence(
    'clean',
    'copy',
    config.defaultTasks.font,
    config.defaultTasks.sprite,
    config.defaultTasks.image,
    'eslint',
    config.defaultTasks.js,
    config.defaultTasks.html,
    config.defaultTasks.css,
    callback,
  )
})
