#!/usr/bin/env node
import interpret from 'interpret'
import v8flags from 'v8flags'
import Liftoff from 'liftoff'
import minimist from 'minimist'
import {
  addChildAndParent,
  watchCompleteChange,
  mdTreeShaking,
  mdPretty,
  setParentName,
  setNoteTitle,
} from '../index'
import fsUtil from 'ginlibs-file-util'
import { resolve } from 'path'

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
    try {
      const pkg = JSON.parse(fsUtil.read(resolve(__dirname, '../package.json')))
      console.log(pkg.version)
    } catch (e) {}
  }

  let fn: any = () => {
    console.log(`
    -w 监听
    -w tree shaking
    -p pretty
    -s set parent node
    -n set note tile
`)
  }

  if (argv.w) {
    fn = watchCompleteChange
  }

  if (argv.t) {
    fn = mdTreeShaking
  }

  if (argv.p) {
    fn = mdPretty
  }

  if (argv.s) {
    fn = setParentName
  }

  if (argv.n) {
    fn = setNoteTitle
  }

  cli.execute(liftEnv, () => {
    return fn()
  })
}

cli.prepare({}, onPrepare)
