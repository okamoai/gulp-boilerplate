/**
 * Gulp Task: build
 * Clear and build all the data
 */
import Registry from 'undertaker-registry'
import config from '../config'

class Build extends Registry {
  init(gulp) {
    gulp.task(
      'build',
      gulp.series(
        'clean',
        'copy',
        config.defaultTasks.font,
        config.defaultTasks.sprite,
        config.defaultTasks.image,
        'eslint',
        config.defaultTasks.js,
        config.defaultTasks.html,
        config.defaultTasks.css
      )
    )
  }
}

export default new Build()
