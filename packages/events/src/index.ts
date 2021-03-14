import { isFunc } from 'ginlibs-type-check'

class Events {
  private eventsMap: any = {}
  private globalConfig: any = {}
  constructor(config?: any) {
    this.globalConfig = config || {}
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

  emit = async (taskName: string, ...arg: any[]): Promise<any> => {
    const eventsMap = this.eventsMap
    const handleList = eventsMap[taskName] || []
    const res = await Promise.all(
      handleList.map((handle) =>
        handle.apply(null, [...arg, this.globalConfig])
      )
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
    if (isFunc(handle)) {
      eventsMap[taskName] = []
    } else {
      handleList = handleList.filter((eventFn) => {
        return eventFn !== handle
      })
      eventsMap[taskName] = handleList
    }
  }
}

export default Events
