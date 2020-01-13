/**
 * Gulp Task:  sprite
 * Generate Sprite File, CSS and sample from PNG files
 */
import Registry from 'undertaker-registry'
import gulpIf from 'gulp-if'
import rename from 'gulp-rename'
import sprite from 'gulp.spritesmith'
import imagemin from 'gulp-imagemin'
import pngquant from 'imagemin-pngquant'
import consolidate from 'gulp-consolidate'
import debug from 'gulp-debug'
import buffer from 'vinyl-buffer'
import fs from 'fs'
import crc from 'crc'
import path from 'path'
import glob from 'glob'
import config from '../config'

class Sprite extends Registry {
  init(gulp) {
    gulp.task('sprite', callback => {
      const taskExecuted = { base: false }
      // Notify end of task
      const onEnd = name => {
        taskExecuted[name] = true
        if (Object.keys(taskExecuted).every(key => taskExecuted[key])) {
          callback()
        }
      }
      // Get a information of sprite image resource
      const sprites = {}
      const pngFilePath = glob.sync(
        path.join(config.tasks.sprite.path.source, config.tasks.sprite.target),
        {
          ignore: config.tasks.sprite.retina ? null : config.tasks.sprite.target2x,
        },
      )
      pngFilePath.forEach(filePath => {
        const normalizeFilePath = path.normalize(filePath)
        const file = path.parse(normalizeFilePath)
        const dirs = file.dir.split(path.sep)
        const lastDir = dirs.pop()

        if (lastDir.match(/^_(.+?)$/)) {
          const spriteName = RegExp.$1
          const spritePath = dirs.join(path.sep)
          const key = path.join(spritePath, lastDir)
          if (key in sprites) {
            sprites[key].items.push(normalizeFilePath)
          } else {
            sprites[key] = {
              name: spriteName,
              path: spritePath,
              items: [normalizeFilePath],
            }
            taskExecuted[`css:${key}`] = false
            taskExecuted[`sprite:${key}`] = false
          }
        }
      })

      // Generate Based CSS Extends
      gulp
        .src(config.tasks.sprite.template[config.defaultTasks.css].base, {
          base: config.tasks.sprite.path.template,
        })
        .on('end', () => onEnd('base'))
        .pipe(consolidate('lodash', { className: config.tasks.sprite.className }))
        .pipe(
          rename({
            prefix: '_',
            basename: 'base',
          }),
        )
        .pipe(gulp.dest(config.tasks.sprite.path.css))
        .pipe(debug({ title: `sprite:${config.defaultTasks.css}-base` }))

      // Generate CSS Extends, Sprite images, Sample files
      Object.keys(sprites).forEach(key => {
        const spriteName = sprites[key].name
        const spriteFiles = sprites[key].items
        const spritePath = sprites[key].path
          .split(path.sep)
          .filter((dir, idx) => {
            const sourceDirs = config.tasks.sprite.path.source.split(path.sep)
            return dir !== sourceDirs[idx]
          })
          .join(path.sep)
        const spriteRetinaPath = config.tasks.sprite.retina
          ? path.join(
              config.tasks.sprite.path.source,
              spritePath
                .split(path.sep)
                .map(dir => {
                  if (dir === spriteName) {
                    return `_${spriteName}`
                  }
                  return dir
                })
                .join(path.sep),
              config.tasks.sprite.target2x,
            )
          : null

        const spriteData = gulp
          .src(spriteFiles, {
            base: config.tasks.sprite.path.source,
          })
          .pipe(
            sprite({
              imgName: `sprites_${spriteName}.png`,
              cssName: `${spriteName}.css`,
              padding: 4,
              cssTemplate: data => {
                // for CRC Hash
                const filesData = spriteFiles.reduce(
                  (concat, fPath) => concat + fs.readFileSync(fPath),
                )
                const cssSpritePath = path.join(config.tasks.sprite.genDir, spritePath)
                // CSS Template Option
                const consolidateOption = {
                  spriteName,
                  data,
                  spritePath: cssSpritePath.split(path.sep).join('/'),
                  className: config.tasks.sprite.className,
                  retina: config.tasks.sprite.retina,
                  hash: crc.crc32(filesData),
                }
                // Generate CSS Extends
                const cssExtendPath = spritePath
                  .split(path.sep)
                  .filter(dir => dir !== spriteName)
                  .join(path.sep)
                gulp
                  .src(config.tasks.sprite.template[config.defaultTasks.css].sprite, {
                    base: config.tasks.sprite.path.template,
                  })
                  .on('end', () => onEnd(`css:${key}`))
                  .pipe(consolidate('lodash', consolidateOption))
                  .pipe(
                    rename({
                      prefix: '_',
                      basename: spriteName,
                    }),
                  )
                  .pipe(gulp.dest(path.join(config.tasks.sprite.path.css, cssExtendPath)))
                  .pipe(debug({ title: `sprite:${config.defaultTasks.css}-extend` }))
                // Generate sample files
                if (config.env === 'development') {
                  // CSS
                  gulp
                    .src(config.tasks.sprite.template.sample.css, {
                      base: config.tasks.sprite.path.template,
                    })
                    .pipe(consolidate('lodash', consolidateOption))
                    .pipe(rename({ basename: spriteName }))
                    .pipe(gulp.dest(path.join(config.tasks.sprite.path.sample, spritePath)))
                    .pipe(debug({ title: 'sprite:sampleCSS' }))
                  // HTML
                  gulp
                    .src(config.tasks.sprite.template.sample.html, {
                      base: config.tasks.sprite.path.template,
                    })
                    .pipe(consolidate('lodash', consolidateOption))
                    .pipe(rename({ basename: spriteName }))
                    .pipe(gulp.dest(path.join(config.tasks.sprite.path.sample, spritePath)))
                    .pipe(debug({ title: 'sprite:sampleHTML' }))
                }
                return ''
              },
              ...(spriteRetinaPath
                ? {
                    retinaSrcFilter: spriteRetinaPath,
                    retinaImgName: spriteRetinaPath ? `sprites_${spriteName}@2x.png` : null,
                  }
                : {}),
            }),
          )

        spriteData.img
          .pipe(buffer())
          .on('end', () => onEnd(`sprite:${key}`))
          .pipe(imagemin([pngquant({ speed: 1 })]))
          .pipe(rename({ dirname: spritePath }))
          .pipe(gulp.dest(config.tasks.sprite.path.build))
          .pipe(debug({ title: 'sprite:file' }))
          .pipe(
            gulpIf(
              config.env === 'development',
              gulp.dest(path.join(config.tasks.sprite.path.sample)),
            ),
          )
      })
    })
  }
}

export default new Sprite()
