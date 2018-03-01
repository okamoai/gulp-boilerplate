/**
 * Gulp Task: watch
 * Execute the build task if files are changed
 */
import path from 'path'
import gulp from 'gulp'
import watch from 'gulp-watch'
import browserSync from 'browser-sync'
import runSequence from 'run-sequence'
import config from '../config'

runSequence.use(gulp)

gulp.task('watch', () => {
  const BROWSER_SYNC_RELOAD_DELAY = 800
  let timer
  config.isWatching = true

  // BrowserSync
  browserSync.init({
    ui: false,
    server: {
      baseDir: path.join(config.dir.build, 'development'),
    },
  })
  // Watch HTML
  watch(
    path.join(
      config.tasks[config.defaultTasks.html].path.source,
      config.tasks[config.defaultTasks.html].target
    ),
    () => gulp.start(config.defaultTasks.html)
  )
  // Wath CSS
  watch(
    path.join(
      config.tasks[config.defaultTasks.css].path.source,
      config.tasks[config.defaultTasks.css].target
    ),
    () => gulp.start(config.defaultTasks.css)
  )
  // Watch JavaScript
  watch(
    path.join(
      config.tasks[config.defaultTasks.js].path.source,
      config.tasks[config.defaultTasks.js].target
    ),
    () => {
      runSequence('eslint', config.defaultTasks.js)
    }
  )
  // Watch Web font
  watch(
    path.join(
      config.tasks[config.defaultTasks.font].path.source,
      config.tasks[config.defaultTasks.font].target
    ),
    () => gulp.start(config.defaultTasks.font)
  )
  // Watch sprite images
  watch(
    path.join(
      config.tasks[config.defaultTasks.sprite].path.source,
      config.tasks[config.defaultTasks.sprite].target
    ),
    () => gulp.start(config.defaultTasks.sprite)
  )
  // Watch images
  watch(
    path.join(
      config.tasks[config.defaultTasks.image].path.source,
      config.tasks[config.defaultTasks.image].target
    ),
    () => gulp.start(config.defaultTasks.image)
  )
  // Watch Copy
  watch(path.join(config.tasks.copy.path.source, config.tasks.copy.target), () =>
    gulp.start('copy'))
  // Excecute Live Reload if files are changed
  watch(path.join(config.dir.build, 'developmen/**/*'), { verbose: true }, file => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      browserSync.reload(file.relative)
    }, BROWSER_SYNC_RELOAD_DELAY)
  })
})
