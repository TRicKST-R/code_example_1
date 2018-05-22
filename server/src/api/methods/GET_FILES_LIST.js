import log from '../../utils/log'
import { getFiles } from './sharedCode/gcs'
import config from '../../config'

const { gcsBucket, uploadFolder } = config

export default async ({ socket, emitAction }) => {
  try {
    let files = await getFiles()

    let resFiles = []

    files = files.filter(file => file.name.slice(-1) !== '/')

    files.map((file, index) => {
      const name = file.name.replace(/.+?\//, '')
      resFiles[index] = {
        name,
        size: file.metadata.size,
        date: file.metadata.updated,
        link: `https://storage.cloud.google.com/${gcsBucket}/${uploadFolder}/${name}`
      }
    })

    emitAction('GET_FILES_LIST', resFiles)
  } catch (err) {
    emitAction('GET_FILES_LIST', {})
    log.err(`GET_FILES_LIST, ${err}`)
  }
}
