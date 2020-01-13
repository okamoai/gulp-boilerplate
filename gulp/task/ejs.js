/**
 * Gulp Task: ejs
 * Compile and output the EJS file
 */
import Registry from 'undertaker-registry'
import gulpIf from 'gulp-if'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import filter from 'gulp-filter'
import rename from 'gulp-rename'
import ejs from 'gulp-ejs'
import prettify from 'gulp-prettify'
import debug from 'gulp-debug'
import path from 'path'
import config from '../config'

class Ejs extends Registry {
  init(gulp) {
    gulp.task('ejs', callback => {
      gulp
        .src(path.join(config.tasks.ejs.path.source, config.tasks.ejs.target), {
          base: config.tasks.ejs.path.source,
        })
        .on('end', callback)
        .pipe(
          plumber({
            errorHandler: notify.onError('<%= error.message %>'),
          }),
        )
        // Skip outputting directories and files with underscores
        .pipe(filter(file => !/[/\\]_/.test(file.path) || !/^_/.test(file.relative)))
        .pipe(
          ejs(
            {
              env: {
                mode: config.env,
                domain: config.domain,
                cdn: config.cdn,
                path: config.path,
              },
            },
            {
              root: config.tasks.ejs.path.source,
            },
            {
              ext: '.html',
            },
          ),
        )
        // Rename if file name has extension specification
        .pipe(
          rename(filePath => {
            const replacePath = filePath
            if (filePath.basename.match(/(.+?)(\..+?)$/)) {
              replacePath.basename = RegExp.$1
              replacePath.extname = RegExp.$2
            }
            return replacePath
          }),
        )
        .pipe(gulpIf(config.tasks.ejs.prettify, prettify(config.tasks.ejs.prettify)))
        .pipe(gulp.dest(config.tasks.ejs.path.build))
        .pipe(debug({ title: 'ejs:file' }))
    })
  }
}

export default new Ejs()
