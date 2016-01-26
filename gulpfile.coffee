gulp         = require 'gulp'
es           = require 'event-stream'
order        = require 'gulp-order'
concat       = require 'gulp-concat'
coffee       = require 'gulp-coffee'
plumber      = require 'gulp-plumber'
connect      = require 'gulp-connect'
ngClassify   = require 'gulp-ng-classify'
uglify       = require 'gulp-uglify'
sourcemaps   = require 'gulp-sourcemaps'
notify       = require 'gulp-notify'
gutil        = require 'gulp-util'
autoprefixer = require 'gulp-autoprefixer'
del          = require 'del'

gulp.task 'build', ->
  lib =
    gulp.src []

  js =
    gulp.src 'src/**/*.coffee'
    .pipe plumber()
    .pipe ngClassify(appName: 'ng-tiddle')
    .pipe concat('ng-tiddle.js')
    .pipe coffee(bare: no)

  es.merge(lib, js)
    .pipe concat('ng-tiddle.js')
    .pipe gulp.dest 'dist'
    .pipe(uglify())
    .pipe(concat('ng-tiddle.min.js'))
    .pipe(gulp.dest('dist'))

gulp.task 'examples', ->
  gulp.src 'examples/**/*.coffee'
  .pipe plumber()
  .pipe ngClassify(appName: 'ng-tiddle-examples')
  .pipe coffee(bare: no)
  .pipe(gulp.dest("examples"))

gulp.task 'server', ->
  connect.server(root: [__dirname], port: 8888)

gulp.task 'watch', ->
  gulp.watch 'src/**/*', ['build']
  gulp.watch 'examples/**/*.coffee', ['examples']

gulp.task 'default', ['build', 'examples']

gulp.task 'clear', ->
  del 'dist/'
