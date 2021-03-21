/* eslint-disable @typescript-eslint/no-unused-vars */
import { join } from 'path'
import { LiftoffEnv } from 'liftoff'
import { renderTplFile, PandaArgv, fsUtil } from '@credit/cli-helper'

const TPL_FILE_DIR = join(__dirname, './tplFile/plugin-tpl')

const genPluginTpl = (
  argv: PandaArgv = {} as any,
  liftEnv: LiftoffEnv = {} as any
) => {
  const { pkg_name: pkgName } = argv
  const { cwd } = liftEnv
  const pkgDir = join(cwd, `packages/${pkgName}`)
  const srcDir = join(pkgDir, '/src')
  const indexPath = join(srcDir, 'index.ts')
  const pkgJsonPath = join(pkgDir, 'package.json')
  const readMePath = join(pkgDir, 'README.md')
  const rollupPath = join(pkgDir, 'rollup.config.js')
  const tsCfgPath = join(pkgDir, 'tsconfig.json')

  const indexCont = fsUtil.read(join(TPL_FILE_DIR, 'index.tpl'))
  const pkgJsonCont = renderTplFile(join(TPL_FILE_DIR, 'package.tpl'), {
    pkgName,
  })
  const readMeCont = renderTplFile(join(TPL_FILE_DIR, 'readme.tpl'), {
    pkgName,
  })
  const rollupCont = fsUtil.read(join(TPL_FILE_DIR, 'rollup.config.tpl'))
  const tsCfgCont = fsUtil.read(join(TPL_FILE_DIR, 'tsconfig.tpl'))

  fsUtil.write(indexPath, indexCont)
  fsUtil.write(pkgJsonPath, pkgJsonCont || '')
  fsUtil.write(readMePath, readMeCont || '')
  fsUtil.write(rollupPath, rollupCont)
  fsUtil.write(tsCfgPath, tsCfgCont)
}

export default genPluginTpl
