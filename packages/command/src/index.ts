import { spawnSync, SpawnOptions, spawn } from 'child_process'
import shelljs from 'shelljs'
import log from 'ginlibs-log'

export const spawnInherit = (
  command: string,
  args: string[],
  options: SpawnOptions = {}
) => {
  log.label('command: ').yellow(`${command} ${args.join(' ')}`)
  return spawn(command, args, { stdio: 'inherit', ...options })
}

export const spawnSyncInherit = (
  command: string,
  args: string[],
  options: SpawnOptions = {}
) => {
  log.label('command').yellow(`${command} ${args.join(' ')}`)
  return spawnSync(command, args, { stdio: 'inherit', ...options })
}

export const execCommand = (
  command: string,
  options: {
    showLog?: boolean
  } = {}
) => {
  const { showLog = true } = options
  showLog && log.yellow(command)
  const result = shelljs.exec(command, { silent: true })
  const { stdout, stderr } = result || {}
  if (stderr) {
    log.red(`error: ${stderr}`)
    return false
  }
  showLog && log.green(stdout)
  return true
}

export const execPromise = (command: string): Promise<string> => {
  log.label('command: ').yellow(command)
  return new Promise((resolve, reject) => {
    shelljs.exec(command, (_, stdout, stderr) => {
      if (stderr) {
        log.red(stderr)
        reject(stderr)
        return
      }
      log.text(stdout)
      resolve(stdout)
    })
  })
}
