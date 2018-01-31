/**
 * Gulp Task: js
 * Compress JavaScript files into one file with Browserify
 */
import path from 'path'
import glob from 'glob'
import gulp from 'gulp'
import gulpIf from 'gulp-if'
import uglify from 'gulp-uglify'
import debug from 'gulp-debug'
import rename from 'gulp-rename'
import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import config from '../config'

gulp.task('js', callback => {
  const taskExecuted = {}
  const jsFiles = glob.sync(path.join(config.tasks.js.path.source, '{!(_)*.js,**/!(_)*/!(_)*.js}'))
  if (!jsFiles.length) {
    callback()
  }

  // Notify end of task
  const onEnd = name => {
    taskExecuted[name] = true
    if (Object.keys(taskExecuted).every(key => taskExecuted[key])) {
      callback()
    }
  }

  jsFiles.forEach(filePath => {
    taskExecuted[filePath] = false
    const normalizeFilePath = path.normalize(filePath)
    const file = path.parse(normalizeFilePath)
    const entry = normalizeFilePath.split(path.sep).filter((dir, idx) => {
      const sourceDirs = config.tasks.js.path.source.split(path.sep)
      return dir !== sourceDirs[idx]
    }).join(path.sep)

    const browserifyObject = browserify({
      basedir: config.tasks.js.path.source,
      entries: entry,
      debug: config.env === 'development',
    })
    if (config.tasks.js.babel) {
      browserifyObject.transform(babelify)
    }
    browserifyObject
      .bundle()
      .on('end', () => onEnd(filePath))
      .on('error', function Error(err) {
        process.stdout.write(`Error : ${err.message}`)
        this.emit('end')
        callback()
      })
      .pipe(source(file.base))
      .pipe(buffer())
      .pipe(rename({
        dirname: path.dirname(entry),
      }))
      .pipe(gulpIf(config.env === 'production', uglify({ preserveComments: 'some' })))
      .pipe(gulp.dest(config.tasks.js.path.build))
      .pipe(debug({ title: 'js:file' }))
  })
})
