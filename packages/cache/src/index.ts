import os from 'os'
import crypto from 'crypto'
import { join } from 'path'
import fsUtil from 'ginlibs-file-util'

const CACHE_FILE_NAME = '.ginlibs.cache'

const HASH = crypto
  .createHash('md5')
  .update('ginlibs_cache_key')
  .digest('base64')

export class Cache {
  filePath: string = os.tmpdir()
  fileName = `${HASH}${CACHE_FILE_NAME}.txt`

  constructor(options?: { filePath: string; fileName: string }) {
    this.filePath = options?.filePath || this.filePath
    this.fileName = options?.fileName || this.fileName
  }

  read(filePath?: string, fileName?: string) {
    return fsUtil.read(
      join(filePath || this.filePath, fileName || this.fileName)
    )
  }
  write(content: string, filePath?: string, fileName?: string) {
    const cacheFilePath = join(
      filePath || this.filePath,
      fileName || this.fileName
    )
    const oldContent = fsUtil.read(cacheFilePath)
    const newContent = `${oldContent}\n${content}`
    if (newContent.length > Math.pow(1024, 3)) {
      console.log(`cache file size over ${Math.pow(1024, 3)}`)
    }
    fsUtil.write(cacheFilePath, newContent)
  }
}

export default new Cache()
