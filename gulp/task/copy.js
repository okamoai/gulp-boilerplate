/**
 * Gulp Task: copy
 * Execute replace strings and file copy
 */
import Registry from 'undertaker-registry'
import debug from 'gulp-debug'
import through from 'through2'
import replacestream from 'replacestream'
import path from 'path'
import config from '../config'

class Copy extends Registry {
  init(gulp) {
    gulp.task('copy', callback => {
      gulp
        .src(path.join(config.tasks.copy.path.source, config.tasks.copy.target), {
          base: config.tasks.copy.path.source,
        })
        .on('end', callback)
        // Replace the character string set in config.js
        .pipe(
          through.obj(function Tansform(file, encoding, throughCallback) {
            const isTarget = config.tasks.copy.replace.target.some(ext =>
              file.path.match(new RegExp(`${ext}$`)),
            )
            const replace = file
            if (!file.isNull() && isTarget) {
              config.tasks.copy.replace.regex.forEach(regex => {
                if (file.isStream()) {
                  replace.contents = file.contents.pipe(
                    replacestream(regex.pattern, regex.replacement),
                  )
                }
                if (file.isBuffer()) {
                  const str = String(file.contents).replace(regex.pattern, regex.replacement)
                  replace.contents = Buffer.from(str)
                }
              })
            }
            this.push(replace)
            return throughCallback()
          }),
        )
        .pipe(gulp.dest(config.tasks.copy.path.build))
        .pipe(debug({ title: 'copy:file' }))
    })
  }
}

export default new Copy()
