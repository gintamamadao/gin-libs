#!/usr/bin/env node
import interpret from 'interpret'
import v8flags from 'v8flags'
import Liftoff from 'liftoff'
import minimist from 'minimist'
import { addChildAndParent, watchCompleteChange } from '../index'
import cache from 'ginlibs-cache'

const processArgv = process.argv.slice(2)
const argv = minimist(processArgv)

const cli = new Liftoff({
  name: 'md.notes',
  extensions: interpret.jsVariants,
  configName: 'md.notes.config',
  v8flags,
})

const onPrepare = function (liftEnv) {
  cache.write(JSON.stringify(liftEnv, undefined, 2))
  cache.write(JSON.stringify(argv, undefined, 2))
  cache.write(JSON.stringify(process.env, undefined, 2), 'dsaf')
  const fn = argv?.w ? watchCompleteChange : addChildAndParent
  cli.execute(liftEnv, () => {
    return fn.apply(null, [liftEnv])
  })
}

cli.prepare({}, onPrepare)
