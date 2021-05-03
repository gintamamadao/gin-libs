export class Lock {
  private lockMap: Record<string, boolean> = {}

  public isLocked = (key: string) => {
    return this.lockMap[key]
  }
  public lock = (key: string) => {
    this.lockMap[key] = true
    return () => this.unLock(key)
  }

  public unLock = (key: string) => {
    this.lockMap[key] = false
  }
}
