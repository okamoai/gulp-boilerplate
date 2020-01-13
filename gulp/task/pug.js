/**
 * Gulp Task:  pug
 * Compile and output the Pug file
 */
import Registry from 'undertaker-registry'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import filter from 'gulp-filter'
import rename from 'gulp-rename'
import pug from 'gulp-pug'
import data from 'gulp-data'
import debug from 'gulp-debug'
import fs from 'fs'
import path from 'path'
import config from '../config'

class Pug extends Registry {
  init(gulp) {
    gulp.task('pug', callback => {
      gulp
        .src(path.join(config.tasks.pug.path.source, config.tasks.pug.target), {
          base: config.tasks.pug.path.source,
        })
        .on('end', callback)
        .pipe(
          plumber({
            errorHandler: notify.onError('<%= error.message %>'),
          }),
        )
        // Skip outputting directories and files with underscores
        .pipe(filter(file => !/[/\\]_/.test(file.path) || !/^_/.test(file.relative)))
        // Refer to the JSON file described in the pug file
        .pipe(
          data(file => {
            const json = {}
            const pugData = {}
            String(file.contents)
              .split('\n')
              .forEach(line => {
                if (line.match(/^\/\/-\s*?data\s+?(.+?)$/)) {
                  const dataFileName = RegExp.$1
                  const dataFile = fs.readFileSync(
                    path.join(process.cwd(), config.tasks.pug.path.source, dataFileName),
                    'utf8',
                  )
                  Object.assign(json, JSON.parse(dataFile))
                }
              })
            pugData[config.tasks.pug.dataName] = json
            pugData.env = {
              mode: config.env,
              domain: config.domain,
              cdn: config.cdn,
              path: config.path,
            }
            return pugData
          }),
        )
        .pipe(
          pug({
            basedir: config.tasks.pug.path.source,
            pretty: config.tasks.pug.pretty,
          }),
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
        .pipe(gulp.dest(config.tasks.pug.path.build))
        .pipe(debug({ title: 'pug:file' }))
    })
  }
}

export default new Pug()
