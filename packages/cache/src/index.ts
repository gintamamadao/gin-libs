import os from 'os'
import crypto from 'crypto'
import { join } from 'path'
import fsUtil from 'ginlibs-file-util'

const CACHE_FILE_NAME = '.ginlibs.cache'

const HASH = crypto
  .createHash('md5')
  .update('ginlibs_cache_key')
  .digest('base64')

const FileTypeMap = {
  json: '.json',
  yaml: '.yaml',
  text: '.txt',
}

export class Cache {
  read(key: string = HASH, fileType: keyof typeof FileTypeMap = 'text') {
    const cacheFilePath = join(
      os.tmpdir(),
      `${key}${CACHE_FILE_NAME}${FileTypeMap[fileType] || ''}`
    )
    return fsUtil.read(cacheFilePath)
  }
  write(
    content: string,
    key: string = HASH,
    fileType: keyof typeof FileTypeMap = 'text'
  ) {
    const cacheFilePath = join(
      os.tmpdir(),
      `${key}${CACHE_FILE_NAME}${FileTypeMap[fileType] || ''}`
    )
    console.log(cacheFilePath)
    const oldContent = fsUtil.read(cacheFilePath)
    const newContent = `${oldContent}\n${content}`
    if (newContent.length > Math.pow(1024, 3)) {
      console.log(`cache file size over ${Math.pow(1024, 3)}`)
    }
    fsUtil.write(cacheFilePath, newContent)
  }
}

export default new Cache()
