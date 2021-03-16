import { isNilVal, isArray, isObject } from 'ginlibs-type-check'

export const filterNilKey = (data: any) => {
  if (!isObject(data) && !isArray(data)) {
    return data
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

export const filterNoKeyObj = (data: any) => {
  if (!isObject(data) && !isArray(data)) {
    return data
  }
  if (isArray(data)) {
    return data
      .filter((it) => {
        if (!isObject(it) && !isArray(it)) {
          return true
        }
        if (isArray(it)) {
          return it.length >= 1
        }
        return Object.keys(it).length >= 1
      })
      .map((it) => {
        if (!isObject(it) && !isArray(it)) {
          return it
        }
        return filterNoKeyObj(it)
      })
  }
  for (const key of Object.keys(data)) {
    const value = data[key]
    if (!isObject(value) && !isArray(value)) {
      continue
    }
    if (isObject(value) && Object.keys(value).length < 1) {
      delete data[key]
      continue
    }
    if (isArray(value) && it.length < 1) {
      delete data[key]
      continue
    }
    if (isObject(value) || isArray(it)) {
      data[key] = filterNoKeyObj(it)
    }
  }
  return data
}
