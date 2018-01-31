/**
 * Gulp Task: copy
 * Execute replace strings and file copy
 */
import path from 'path'
import gulp from 'gulp'
import gulpIf from 'gulp-if'
import changed from 'gulp-changed'
import debug from 'gulp-debug'
import through from 'through2'
import replacestream from 'replacestream'
import config from '../config'

gulp.task('copy', callback => {
  gulp.src(path.join(config.tasks.copy.path.source, config.tasks.copy.target))
    .on('end', callback)
    // While watching, change the timestamp and narrow down the copy target
    .pipe(gulpIf(config.isWatching, changed(config.tasks.copy.path.build)))
    // Replace the character string set in config.js
    .pipe(through.obj(function Tansform(file, encoding, throughCallback) {
      const isTarget = config.tasks.copy.replace.target.some(ext => file.path.match(new RegExp(`${ext}$`)))
      const replace = file
      if (!file.isNull() && isTarget) {
        config.tasks.copy.replace.regex.forEach(regex => {
          if (file.isStream()) {
            replace.contents = file.contents.pipe(replacestream(regex.pattern, regex.replacement))
          }
          if (file.isBuffer()) {
            const str = String(file.contents).replace(regex.pattern, regex.replacement)
            replace.contents = Buffer.from(str)
          }
        })
      }
      this.push(replace)
      return throughCallback()
    }))
    .pipe(gulp.dest(config.tasks.copy.path.build))
    .pipe(debug({ title: 'copy:file' }))
})
