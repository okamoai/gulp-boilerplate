import gulp from 'gulp'
import clean from './gulp/task/clean'
import copy from './gulp/task/copy'
import pug from './gulp/task/pug'
import ejs from './gulp/task/ejs'
import imagemin from './gulp/task/imagemin'
import sprite from './gulp/task/sprite'
import font from './gulp/task/font'
import eslint from './gulp/task/eslint'
import js from './gulp/task/js'
import jsConcat from './gulp/task/jsConcat'
import sass from './gulp/task/sass'
import postcss from './gulp/task/postcss'
import build from './gulp/task/build'
import watch from './gulp/task/watch'

gulp.registry(clean)
gulp.registry(copy)
gulp.registry(pug)
gulp.registry(ejs)
gulp.registry(imagemin)
gulp.registry(sprite)
gulp.registry(font)
gulp.registry(eslint)
gulp.registry(js)
gulp.registry(jsConcat)
gulp.registry(sass)
gulp.registry(postcss)
gulp.registry(build)
gulp.registry(watch)
