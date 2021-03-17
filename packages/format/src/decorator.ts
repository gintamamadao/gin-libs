export interface ExcludeOptions {
  when?: string
}

export interface ExcludeInfo {
  key: string
  when?: string
}

export function Exclude(options: ExcludeOptions = {}) {
  return function (target: any, propertyName?: string | symbol) {
    target.$$excludeKeys = (target.$$excludeKeys || []) as ExcludeInfo[]
    target.$$excludeKeys.push({
      key: propertyName,
      when: options.when,
    })
  }
}

export interface ExposeOptions {
  name?: string
}

export interface ExposeItem {
  from: string
  to: string
}

export function Expose(options: ExposeOptions = {}) {
  return function (target: any, propertyName?: string | symbol) {
    target.$$exposeItems = (target.$$exposeItems || []) as ExposeItem[]
    target.$$exposeItems.push({
      to: propertyName,
      from: options.name || propertyName,
    })
  }
}
