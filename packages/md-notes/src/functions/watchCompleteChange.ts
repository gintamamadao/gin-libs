import { LiftoffEnv } from 'liftoff'
import fsUtil from 'ginlibs-file-util'
import { addChildAndParent } from './addChildAndParent'

export const watchCompleteChange = (liftEnv: LiftoffEnv) => {
  const { cwd } = liftEnv
  const watcher = fsUtil.watch(cwd)
  watcher.on('change', (path) => {
    addChildAndParent(liftEnv, [path])
  })
}
