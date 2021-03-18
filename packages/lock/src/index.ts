export const noop = () => {}
import { isFunc } from 'ginlibs-type-check'

export class Lock {
  private lockMap: Record<string, boolean> = {}
  private resolve: AnyFunction = noop

  public isLocked = (key: string) => {
    return this.lockMap[key]
  }
  public lock = (key: string) => {
    this.lockMap[key] = true
    return () => this.unLock(key)
  }
  public blocking = () => {
    const promise = new Promise((resovle) => {
      this.resolve = resovle
    })
    return promise
  }
  public break = () => {
    isFunc(this.resolve) && this.resolve()
    this.resolve = noop
  }

  public sleep = (time: number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, time)
    })
  }

  public unLock = (key: string) => {
    this.lockMap[key] = false
  }
}

export default Lock
