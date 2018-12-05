/**
 * Gulp Task: js
 * Compress JavaScript files into one file with Webpack
 */
import Registry from 'undertaker-registry'
import gulpIf from 'gulp-if'
import uglify from 'gulp-uglify'
import debug from 'gulp-debug'
import rename from 'gulp-rename'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import path from 'path'
import glob from 'glob'
import config from '../config'

class Js extends Registry {
  init(gulp) {
    gulp.task('js', callback => {
      const taskExecuted = {}
      const jsFiles = glob.sync(
        path.join(config.tasks.js.path.source, '{!(_)*.js,**/!(_)*/!(_)*.js}')
      )
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
        const entry = normalizeFilePath
          .split(path.sep)
          .filter((dir, idx) => {
            const sourceDirs = config.tasks.js.path.source.split(path.sep)
            return dir !== sourceDirs[idx]
          })
          .join(path.sep)

        gulp
          .src(filePath, { base: config.tasks.js.path.source })
          .on('end', () => onEnd(filePath))
          .on('error', function Error(err) {
            process.stdout.write(`Error : ${err.message}`)
            this.emit('end')
            callback()
          })
          .pipe(
            webpackStream(
              {
                mode: config.env === 'stage' ? 'development' : config.env,
                devtool: config.env !== 'production' ? 'inline-source-map' : false,
                module: {
                  rules: [
                    {
                      test: /\.js?$/,
                      exclude: /node_modules/,
                      loader: 'babel-loader',
                    },
                  ],
                },
              },
              webpack
            )
          )
          .pipe(
            rename({
              dirname: path.dirname(entry),
              basename: path.basename(entry, '.js'),
            })
          )
          .pipe(
            gulpIf(
              config.env === 'production',
              uglify({
                output: {
                  comments: /^!/,
                },
              })
            )
          )
          .pipe(gulp.dest(config.tasks.js.path.build))
          .pipe(debug({ title: 'js:file' }))
      })
    })
  }
}

export default new Js()
