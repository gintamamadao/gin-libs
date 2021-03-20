export interface ExcludeOptions {
  when?: string
}

export interface ExcludeInfo {
  key: string
  when?: string
}

export enum DecoratorPropKeys {
  exclude = '$$excludeKeys',
  expose = '$$exposeItems',
}

export function Exclude(options: ExcludeOptions = {}) {
  return function (target: any, propertyName?: string | symbol) {
    const excludeKey = DecoratorPropKeys.exclude
    target[excludeKey] = target[excludeKey] || []
    target[excludeKey].push({
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
    const exposeKey = DecoratorPropKeys.expose
    target[exposeKey] = target[exposeKey] || []
    target[exposeKey].push({
      to: propertyName,
      from: options.name || propertyName,
    })
  }
}
