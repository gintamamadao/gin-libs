import { LiftoffEnv } from 'liftoff'
import { join, basename } from 'path'
import cfg from '../config'
import fsUtil from 'ginlibs-file-util'

export const getDocsPath = (docsDir: string = cfg.docsDirName) => {
  const liftEnv: LiftoffEnv = globalThis._cliLiftEnv || {}
  const { cwd } = liftEnv
  const docsPath = join(cwd, docsDir)
  return docsPath
}

export const findAllNotes = (docsDir: string = cfg.docsDirName) => {
  const docsPath = getDocsPath(docsDir)
  const notesFiles = fsUtil.find(docsPath, './*.md')
  return notesFiles.map((it) => {
    const key = basename(it)
    return {
      key,
      url: it,
    }
  })
}
