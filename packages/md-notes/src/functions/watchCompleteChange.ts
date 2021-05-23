import { LiftoffEnv } from 'liftoff'
import fsUtil from 'ginlibs-file-util'
import { addChildAndParent } from './addChildAndParent'

export const watchCompleteChange = () => {
  const liftEnv: LiftoffEnv = globalThis._cliLiftEnv || {}
  const { cwd } = liftEnv
  const watcher = fsUtil.watch(cwd)
  watcher.on('change', (path) => {
    addChildAndParent([path])
  })
}
