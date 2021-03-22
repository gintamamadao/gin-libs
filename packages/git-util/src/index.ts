import downloadGitRepo from 'download-git-repo'
import fsUtil from 'ginlibs-file-util'
import log from 'ginlibs-log'

export const downloadRepo = (url: string, downloadPath: string) => {
  if (fsUtil.exist(downloadPath)) {
    log.red('文件夹已存在')
    return
  }
  return new Promise((resolve, reject) => {
    log
      .text('正从远端克隆', true)
      .space(1)
      .green(url, true)
      .space(1)
      .green(downloadPath)
    downloadGitRepo(url, downloadPath, { clone: true }, (err: any) => {
      if (err) {
        reject(err)
        return
      }
      resolve(true)
    })
  })
}
