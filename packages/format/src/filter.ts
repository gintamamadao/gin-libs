import { isNilVal, isArray, isObject } from 'ginlibs-type-check'

export const filterNilKey = (data: any = {}) => {
  if (isNilVal(data)) {
    return {}
  }
  if (isArray(data)) {
    return data.filter((it) => !isNilVal(it)).map((it) => filterNilKey(it))
  }
  for (const key of Object.keys(data)) {
    const value = data[key]
    if (isNilVal(value)) {
      delete data[key]
      continue
    }
    if (isObject(value)) {
      filterNilKey(value)
    }
  }
  return data
}
