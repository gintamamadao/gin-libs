import { LiftoffEnv } from 'liftoff'
import { PandaArgv } from '@credit/cli-helper'
import genPluginTpl from './genPluginTpl'

const genFile = (
  argv: PandaArgv = {} as any,
  _: any,
  liftEnv: LiftoffEnv = {} as any
) => {
  const { type } = argv
  if (type === 'plugin') {
    genPluginTpl(argv, liftEnv)
  }
}

export default genFile
