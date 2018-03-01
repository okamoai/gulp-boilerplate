/**
 * Gulp Task:  clean
 * Delete all the files that were built
 */
import path from 'path'
import gulp from 'gulp'
import del from 'del'
import chalk from 'chalk'
import config from '../config'

const deleteTarget = [
  path.join(config.dir.build, config.env),
  config.dir.sample,
  config.tasks.font.path.css,
  config.tasks.sprite.path.css,
]

gulp.task('clean', callback => {
  del(deleteTarget).then(paths => {
    process.stdout.write('Deleted files and Directories:\n')
    paths.forEach(filePath => {
      const fileProjectPath = filePath.replace(process.cwd() + path.sep, '')
      process.stdout.write(`- ${chalk.blue(fileProjectPath)}\n`)
    })
    callback()
  })
})
