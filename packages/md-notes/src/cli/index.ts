#!/usr/bin/env node
import interpret from 'interpret'
import v8flags from 'v8flags'
import Liftoff from 'liftoff'
import minimist from 'minimist'
import { addChildAndParent, watchCompleteChange } from '../index'

const processArgv = process.argv.slice(2)
const argv = minimist(processArgv)

const cli = new Liftoff({
  name: 'md.notes',
  extensions: interpret.jsVariants,
  configName: 'md.notes.config',
  v8flags,
})

const getConfig = (liftEnv) => {
  const configPath = liftEnv.configPath
  if (!configPath) {
    return {}
  }
  const config = require(configPath)
  return config
}

const onPrepare = function (liftEnv) {
  // const config = getConfig(liftEnv)
  const fn = argv?.w ? watchCompleteChange : addChildAndParent
  cli.execute(liftEnv, () => {
    return fn.apply(null, [liftEnv])
  })
}

cli.prepare({}, onPrepare)
