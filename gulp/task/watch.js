/**
 * Gulp Task: watch
 * Execute the build task if files are changed
 */
import Registry from 'undertaker-registry'
import path from 'path'
import browserSync from 'browser-sync'
import config from '../config'

class Watch extends Registry {
  init(gulp) {
    gulp.task('watch', () => {
      // BrowserSync
      browserSync.init({
        ui: false,
        files: path.join(config.dir.build, 'developmentt/**/*'),
        watch: true,
        server: {
          baseDir: path.join(config.dir.build, 'development'),
        },
        ghostMode: false,
        notify: false,
        reloadDebounce: 800,
        reloadThrottle: 800,
      })
      // Watch HTML
      gulp.watch(
        path
          .join(
            config.tasks[config.defaultTasks.html].path.source,
            config.tasks[config.defaultTasks.html].target,
          )
          .replace(/\\/g, '/'),
        gulp.task(config.defaultTasks.html),
      )
      // Wath CSS
      gulp.watch(
        path
          .join(
            config.tasks[config.defaultTasks.css].path.source,
            config.tasks[config.defaultTasks.css].target,
          )
          .replace(/\\/g, '/'),
        gulp.task(config.defaultTasks.css),
      )
      // Watch JavaScript
      gulp.watch(
        path
          .join(
            config.tasks[config.defaultTasks.js].path.source,
            config.tasks[config.defaultTasks.js].target,
          )
          .replace(/\\/g, '/'),
        gulp.series('eslint', config.defaultTasks.js),
      )
      // Watch Web font
      gulp.watch(
        path
          .join(
            config.tasks[config.defaultTasks.font].path.source,
            config.tasks[config.defaultTasks.font].target,
          )
          .replace(/\\/g, '/'),
        gulp.task(config.defaultTasks.font),
      )
      // Watch sprite images
      gulp.watch(
        path
          .join(
            config.tasks[config.defaultTasks.sprite].path.source,
            config.tasks[config.defaultTasks.sprite].target,
          )
          .replace(/\\/g, '/'),
        gulp.task(config.defaultTasks.sprite),
      )
      // Watch images
      gulp.watch(
        path
          .join(
            config.tasks[config.defaultTasks.image].path.source,
            config.tasks[config.defaultTasks.image].target,
          )
          .replace(/\\/g, '/'),
        gulp.task(config.defaultTasks.image),
      )
      // Watch Copy
      gulp.watch(
        path.join(config.tasks.copy.path.source, config.tasks.copy.target).replace(/\\/g, '/'),
        gulp.task('copy'),
      )
    })
  }
}

export default new Watch()
