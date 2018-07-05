const gulp = require('gulp')
const replace = require('gulp-replace')
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

const uploadGCS = bucket => {
  return gulp
    .src([
      './dist/index.html',
      './dist/css/**/*.css',
      './dist/js/**/*.js',
      './dist/img/**/*.@(jpg|png|gif|svg)'
    ], {base: `${__dirname}/dist/`})
    .pipe(gcPub({
      bucket: bucket,
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
/* 開發 */
gulp.task('buildEnvToDev', () => {
  return gulp
    .src(['./src/modules/axios-config.js'], {
      base: './'
    })
    .pipe(
      replace(/axios.defaults.baseURL = ''/g, match => {
        let dev = `axios.defaults.baseURL = 'http://localhost:8080'`
        console.log(`baseURL => ${match} to ${dev}`)
        return dev
      })
    )
    .pipe(gulp.dest('./'))
})

/* 正式 */
gulp.task('buildDevToEnv', () => {
  return gulp
    .src(['./src/modules/axios-config.js'], {
      base: './'
    })
    .pipe(
      replace(/axios.defaults.baseURL = 'http:\/\/localhost:8080'/g, match => {
        let buildEnv = 'axios.defaults.baseURL = \'\''
        console.log(`baseURL => ${match} to ${buildEnv}`)
        return buildEnv
      })
    )
    .pipe(gulp.dest('./'))
})

/* 上傳 GCS */
gulp.task('uploadTestGCS', uploadGCS.bind(uploadGCS, 'tutor-events-test'))
gulp.task('uploadProdGCS', uploadGCS.bind(uploadGCS, 'tutor-events'))

/* 部署 */
gulp.task('deployToTest', ['minifyImage', 'buildDevToEnv', 'uploadTestGCS'], () => {
  console.log('Package and upload files to test GCS')
})

gulp.task('deployToProd', ['minifyImage', 'buildDevToEnv', 'uploadProdGCS'], () => {
  console.log('Package and upload files to prod GCS')
})
