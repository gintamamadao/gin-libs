import { LiftoffEnv } from 'liftoff'
import fsUtil from 'ginlibs-file-util'
import { join } from 'path'
import prettier from 'prettier'

export const mdPretty = () => {
  const liftEnv: LiftoffEnv = globalThis._cliLiftEnv || {}
  const { cwd } = liftEnv
  const docsPath = join(cwd, '/docs')
  const notesFiles = fsUtil.find(docsPath, './*.md')
  for (const noteFile of notesFiles) {
    const contStr = fsUtil.read(noteFile)
    if (!contStr) {
      fsUtil.del(noteFile)
      continue
    }
    const prettierCont = prettier.format(contStr, {
      parser: 'markdown',
    })
    fsUtil.write(noteFile, prettierCont)
  }
}
