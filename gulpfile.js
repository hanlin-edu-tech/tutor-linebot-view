const gulp = require('gulp')
const gcPub = require('gulp-gcloud-publish')
const cache = require('gulp-cache')
const imageMin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')

const minifyImage = sourceImage => {
  return gulp
    .src(sourceImage, {
      base: './src'
    })
    .pipe(cache(imageMin({
      use: [pngquant({
        speed: 7
      })]
    })))
    .pipe(gulp.dest('./dist'))
}

const uploadGCS = () => {
  return gulp
    .src([
      './dist/index.html',
      './dist/css/**/*.css',
      './dist/js/**/*.js',
      './dist/img/**/*.@(jpg|png|gif|svg)'
    ], {base: `${__dirname}/dist/`})
    .pipe(gcPub({
      bucket: 'tutor-events-test',
      keyFilename: 'tutor.json',
      base: 'event/line-bot/',
      projectId: 'tutor-204108',
      public: true,
      metadata: {
        cacheControl: 'private, no-transform',
      }
    }))
}

gulp.task('minifyImage', minifyImage.bind(minifyImage, './src/img/**/*.@(jpg|png)'))
gulp.task('uploadGCS', uploadGCS)
