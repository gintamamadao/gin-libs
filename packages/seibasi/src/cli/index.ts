#!/usr/bin/env node
import interpret from 'interpret'
import v8flags from 'v8flags'
import Liftoff from 'liftoff'
import minimist from 'minimist'
import fsUtil from 'ginlibs-file-util'
import { resolve } from 'path'

const processArgv = process.argv.slice(2)
const argv = minimist(processArgv)

const cli = new Liftoff({
  name: 'ginlibs-seibasi',
  extensions: interpret.jsVariants,
  configName: '.seibasi',
  v8flags,
})

const onPrepare = function (liftEnv) {
  const params = argv._ || []
  // cache.write(JSON.stringify(argv, undefined, 2))

  globalThis._cliArgv = argv
  globalThis._cliLiftEnv = liftEnv

  if (argv.v || argv.version) {
    try {
      const pkg = JSON.parse(fsUtil.read(resolve(__dirname, '../package.json')))
      console.log(pkg.version)
    } catch (e) {}
  }

  const fn: any = () => {
    console.log('ginlibs-seibasi')
  }

  cli.execute(liftEnv, () => {
    return fn()
  })
}

cli.prepare({}, onPrepare)
