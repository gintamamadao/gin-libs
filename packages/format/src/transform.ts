import { isArray, isFunc } from 'ginlibs-type-check'
import { ExposeItem, ExcludeInfo } from './decorator'

export function transByClass<T = any>(
  target: any,
  data: Record<string, any>,
  type?: string
): T {
  let newData: any = {}
  const proto = isFunc(target) ? target.prototype : target.__proto__
  const exposeItems: ExposeItem[] = proto.$$exposeItems
  const excludeKeys: ExcludeInfo[] = proto.$$excludeKeys

  if (isArray(exposeItems)) {
    for (const it of exposeItems) {
      const { from, to } = it
      if (data.hasOwnProperty(from)) {
        newData[to] = data[from]
      }
    }
  } else {
    newData = { ...data }
  }

  if (isArray(excludeKeys)) {
    for (const it of excludeKeys) {
      const { key, when } = it
      if (when && type !== when) {
        continue
      }
      delete newData[key]
    }
  }

  return newData
}

export function getTransKey(target: any, key: string, reverse = false): string {
  const proto = isFunc(target) ? target.prototype : target.__proto__
  const exposeItems: ExposeItem[] = proto.$$exposeItems
  if (!isArray(exposeItems)) {
    return ''
  }
  for (const it of exposeItems) {
    const { from, to } = it
    if (!reverse && from === key) {
      return to
    }
    if (reverse && to === key) {
      return from
    }
  }
  return ''
}

export function reverseTransByClass<T = any>(
  target: any,
  data: Record<string, any>
): T {
  const newData: any = {}
  const proto = isFunc(target) ? target.prototype : target.__proto__
  const exposeItems: ExposeItem[] = proto.$$exposeItems
  if (isArray(exposeItems)) {
    for (const it of exposeItems) {
      const { from, to } = it
      if (data.hasOwnProperty(to)) {
        newData[from] = data[to]
      }
    }
  }
  return newData
}
