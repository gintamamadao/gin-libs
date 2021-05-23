#!/usr/bin/env node
import interpret from 'interpret'
import v8flags from 'v8flags'
import Liftoff from 'liftoff'
import minimist from 'minimist'
import { addChildAndParent, watchCompleteChange, mdTreeShaking } from '../index'
import cache from 'ginlibs-cache'
import pkg from '../../package.json'

const processArgv = process.argv.slice(2)
const argv = minimist(processArgv)

const cli = new Liftoff({
  name: 'md.notes',
  extensions: interpret.jsVariants,
  configName: 'md.notes.config',
  v8flags,
})

const onPrepare = function (liftEnv) {
  const params = argv._ || []
  // cache.write(JSON.stringify(argv, undefined, 2))

  globalThis._cliArgv = argv
  globalThis._cliLiftEnv = liftEnv

  if (argv.v || argv.version) {
    console.log(pkg.version)
  }

  let fn = addChildAndParent

  if (argv.w) {
    fn = watchCompleteChange
  }

  if (argv.t) {
    fn = mdTreeShaking
  }

  cli.execute(liftEnv, () => {
    return fn()
  })
}

cli.prepare({}, onPrepare)
