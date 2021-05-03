import { isFunc } from 'ginlibs-type-check'

const noop = () => {}

export class AsyncLock {
  private promise: Promise<any>
  private resolve: AnyFunction = noop

  constructor() {
    this.lock()
  }

  public lock = () => {
    this.promise = new Promise<any>((resovle) => {
      this.resolve = resovle
    })
    return this.promise
  }

  public lockTime = (time: number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, time)
    })
  }

  public unLock = (params?: any) => {
    isFunc(this.resolve) && this.resolve(params)
    this.resolve = noop
    this.promise = Promise.resolve()
  }

  public getLock = () => {
    return this.promise
  }
}
