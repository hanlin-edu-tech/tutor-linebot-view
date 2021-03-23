const gulp = require('gulp')
const { Storage } = require('@google-cloud/storage')
const cache = require('gulp-cache')
const imageMin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')

const fs = require('fs').promises
const path = require('path')

const distDir = path.join(__dirname, 'dist/')
const bucketNameProd = 'tutor-apps'
const bucketNameTest = 'tutor-test-apps'
const prodStorage = new Storage({
  projectId: 'tutor-204108',
  keyFilename: './tutor.json'
})
const testStorage = new Storage({
  projectId: 'tutor-test-238709',
  keyFilename: './tutor-test.json'
})

const cleanGCS = async (bucketName, storage) => {
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
  const storage = bucketName === bucketNameProd? prodStorage: testStorage
  await cleanGCS(bucketName, storage)

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

/* 上傳 GCS */
gulp.task('uploadToGcsTest', uploadToGCS.bind(uploadToGCS, bucketNameTest))
gulp.task('uploadToGcsProduction', uploadToGCS.bind(uploadToGCS, bucketNameProd))

/* 部署 */
gulp.task('deployToTest',
  gulp.series('minifyImage', 'uploadToGcsTest')
)

gulp.task('deployToProduction',
  gulp.series('minifyImage', 'uploadToGcsProduction')
)
