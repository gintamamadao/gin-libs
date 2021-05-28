import { LiftoffEnv } from 'liftoff'
import { join, basename } from 'path'
import { DocsDirName } from '../types/constant'
import fsUtil from 'ginlibs-file-util'

export const getDocsPath = () => {
  const liftEnv: LiftoffEnv = globalThis._cliLiftEnv || {}
  const { cwd } = liftEnv
  const docsPath = join(cwd, DocsDirName)
  return docsPath
}

export const findAllNotes = () => {
  const docsPath = getDocsPath()
  const notesFiles = fsUtil.find(docsPath, './*.md')
  return notesFiles.map((it) => {
    const key = basename(it)
    return {
      key,
      url: it,
    }
  })
}
