/**
 * Gulp Task: jsConcat
 * Join JavaScript files in one file and compress
 */
import Registry from 'undertaker-registry'
import gulpIf from 'gulp-if'
import uglify from 'gulp-uglify'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import debug from 'gulp-debug'
import concat from 'gulp-concat'
import rename from 'gulp-rename'
import sourcemaps from 'gulp-sourcemaps'
import path from 'path'
import glob from 'glob'
import config from '../config'

class JsConcat extends Registry {
  init(gulp) {
    gulp.task('jsConcat', callback => {
      const taskExecuted = {}
      const jsSource = path.join(config.tasks.jsConcat.path.source, config.tasks.jsConcat.target)
      const jsPaths = glob.sync(jsSource)
      if (!jsPaths.length) {
        callback()
      }
      const concatObject = {}
      jsPaths.forEach(filePath => {
        const normalizeFilePath = path.normalize(filePath)
        const file = path.parse(normalizeFilePath)
        const dirs = file.dir.split(path.sep)
        const lastDir = dirs.pop()
        if (lastDir.match(/^_(.+?)$/)) {
          const fileName = path.join(dirs.join(path.sep), RegExp.$1 + file.ext)
          if (fileName in concatObject) {
            concatObject[fileName].push(normalizeFilePath)
          } else {
            concatObject[fileName] = [normalizeFilePath]
            taskExecuted[fileName] = false
          }
        } else {
          concatObject[normalizeFilePath] = [normalizeFilePath]
          taskExecuted[normalizeFilePath] = false
        }
      })

      // Notify end of task
      const onEnd = name => {
        taskExecuted[name] = true
        if (Object.keys(taskExecuted).every(key => taskExecuted[key])) {
          callback()
        }
      }

      Object.keys(concatObject).forEach(outputFile => {
        const concatFiles = concatObject[outputFile]
        const outputFileName = path.basename(outputFile)
        const outputDirs = path.dirname(outputFile).split(path.sep)
        const outputDir = outputDirs
          .filter((dir, idx) => {
            const sourceDirs = config.tasks.jsConcat.path.source.split(path.sep)
            return dir !== sourceDirs[idx]
          })
          .join(path.sep)

        gulp
          .src(concatFiles, { base: config.tasks.jsConcat.path.source })
          .pipe(gulpIf(config.env === 'development', sourcemaps.init()))
          .pipe(
            plumber({
              errorHandler: notify.onError('<%= error.message %>'),
            }),
          )
          .on('end', () => onEnd(outputFile))
          .pipe(concat(outputFileName))
          .pipe(rename({ dirname: outputDir }))
          .pipe(
            gulpIf(
              config.env === 'production',
              uglify({
                output: {
                  comments: /^!/,
                },
              }),
            ),
          )
          .pipe(gulpIf(config.env === 'development', sourcemaps.write()))
          .pipe(gulp.dest(config.tasks.jsConcat.path.build))
          .pipe(debug({ title: 'jsConcat:file' }))
      }, concatObject)
    })
  }
}

export default new JsConcat()
