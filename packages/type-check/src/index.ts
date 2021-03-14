export const isString = (v: any): v is string => {
  return typeof v === 'string'
}

export const isFinite = (v: any): boolean => {
  return v !== Infinity && v !== -Infinity
}

export const isNumber = (v: any): v is number => {
  return typeof v === 'number' && !Number.isNaN(v) && isFinite(v)
}

export const isUndefined = (v: any): v is undefined => {
  return typeof v === 'undefined'
}

export const isBoolean = (v: any): v is boolean => {
  return !!v === v
}

export const isObject = <T = Record<string, any>>(v: any): v is T => {
  return Object.prototype.toString.call(v) === '[object Object]'
}

export const isArray = <T = any[]>(v: any): v is T => {
  return Array.isArray(v)
}

export const isNilVal = (v: any, ...args: any[]): v is undefined | null => {
  args.push(v)
  return args.every((val) => val === undefined || val === null)
}

export const isNumeric = (value: any): boolean => {
  return (
    isString(value) &&
    /^-{0,1}[0-9]+(\.{0,1}[0-9]+){0,1}(e{0,1}[0-9]+){0,1}$/.test(value)
  )
}

export const isDate = (v: any): v is Date => {
  return Object.prototype.toString.call(v) === '[object Date]'
}

export const isFunc = <T = AnyFunction>(v: any): v is T => {
  return typeof v === 'function'
}

export const isPromise = <T = Promise<any>>(v: any): v is T => {
  return (v && isFunc(v.then)) || isThisType(v, 'Promise')
}

export const isThisType = (val: any, type: string) => {
  const valType = Object.prototype.toString.call(val)
  const trueType = valType.slice(8, valType.length - 1)
  return type === trueType
}
