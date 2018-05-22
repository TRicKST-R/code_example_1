import Storage from '@google-cloud/storage'
import config from '../../../config'

const bucket = config.gcsBucket
const folder = config.uploadFolder

// get file of storage
export const getFiles = (prefix, delimiter) => {
  const storage = new Storage()

  const options = {
    prefix: folder + '/'
  }
  if (prefix) {
    options.prefix = folder + '/' + prefix
  }

  if (delimiter) {
    options.delimiter = delimiter
  }

  return new Promise((resolve, reject) => {
    storage
      .bucket(bucket)
      .getFiles(options)
      .then(results => {
        resolve(results[0])
      })
      .catch(err => {
        console.error('ERROR:', err)
      })
  })
}
