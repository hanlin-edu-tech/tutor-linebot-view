const gulp = require('gulp')
const replace = require('gulp-replace')
const { Storage } = require('@google-cloud/storage')
const cache = require('gulp-cache')
const imageMin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')

const fs = require('fs').promises
const path = require('path')

const distDir = path.join(__dirname, 'dist/')
const storage = new Storage({
  projectId: 'tutor-204108',
  keyFilename: './tutor.json'
})

const cleanGCS = async bucketName => {
  const options = {
    prefix: 'app/linebot/',
  }

  const [files] = await storage.bucket(bucketName).getFiles(options)
  for (let file of files) {
    await storage.bucket(bucketName)
      .file(file.name)
      .delete()
    console.log(`${file.name} is deleted`)
  }
}

const findAllUploadFilesPath = async (dir, multiDistEntireFilePath = []) => {
  const files = await fs.readdir(dir)

  for (let file of files) {
    const entireFilepath = path.join(dir, file)
    const fileStatus = await fs.stat(entireFilepath)

    if (fileStatus.isDirectory()) {
      multiDistEntireFilePath = await findAllUploadFilesPath(entireFilepath, multiDistEntireFilePath)
    } else {
      multiDistEntireFilePath.push(entireFilepath)
    }
  }

  return multiDistEntireFilePath
}

const uploadToGCS = async bucketName => {
  await cleanGCS(bucketName)

  const multiDistEntireFilePath = await findAllUploadFilesPath(distDir)
  multiDistEntireFilePath.forEach(distEntireFilePath => {
    storage.bucket(bucketName)
      .upload(distEntireFilePath,
        {
          destination: `/app/linebot/${distEntireFilePath.replace(distDir, '')}`,
          metadata: {
            cacheControl: 'no-store',
          },
          public: true
        },
        (err, file) => {
          console.log(`Upload ${file.name} successfully`)
        }
      )
  })
}

const minifyImage = sourceImage => {
  return gulp
    .src(sourceImage, {base: './src'})
    .pipe(cache(imageMin({
      use: [pngquant({
        speed: 7
      })]
    })))
    .pipe(gulp.dest('./dist'))
}


gulp.task('minifyImage', minifyImage.bind(minifyImage, './src/img/**/*.@(jpg|png)'))
/* 開發 */
gulp.task('switchDev', () => {
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
gulp.task('switchEnv', () => {
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
gulp.task('uploadToGcsTest', uploadToGCS.bind(uploadToGCS, 'tutor-apps-test/'))
gulp.task('uploadToGcsProduction', uploadToGCS.bind(uploadToGCS, 'tutor-apps/'))

/* 部署 */
gulp.task('deployToTest',
  gulp.series('minifyImage', 'uploadToGcsTest')
)

gulp.task('deployToProduction',
  gulp.series('minifyImage', 'uploadToGcsProduction')
)
