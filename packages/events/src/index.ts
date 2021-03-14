import { isFunc } from 'ginlibs-type-check'

class Events {
  private eventsMap: any = {}
  private config: any = {}
  constructor(config?: any) {
    this.config = config || {}
  }

  on = (taskName: string, handle: AnyFunction) => {
    const eventsMap = this.eventsMap
    const handleList = eventsMap[taskName] || []
    if (isFunc(handle)) {
      handleList.push(handle)
    }
    eventsMap[taskName] = handleList
    this.eventsMap = eventsMap
    return () => {
      this.off(taskName, handle)
    }
  }

  emit = <T = any>(taskName: string, ...arg: any[]): T => {
    const eventsMap = this.eventsMap
    const handleList = eventsMap[taskName] || []
    const res = handleList.map((handle) =>
      handle.apply(null, [...arg, this.config])
    )
    if (res.length <= 1) {
      return res[0]
    } else {
      return res
    }
  }

  off = (taskName: string, handle?: AnyFunction) => {
    const eventsMap = this.eventsMap || {}
    let handleList = eventsMap[taskName] || []
    if (!isFunc(handle)) {
      eventsMap[taskName] = []
    } else {
      handleList = handleList.filter((eventFn) => {
        return eventFn !== handle
      })
      eventsMap[taskName] = handleList
    }
    this.eventsMap = eventsMap
  }
}

export default Events
