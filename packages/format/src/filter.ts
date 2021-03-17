import { isNilVal, isArray, isObject } from 'ginlibs-type-check'

export function filterNilKey(data: any) {
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

export function filterNoKeyObj(data: any, cnt = 1) {
  let newData = data
  if (!isObject(data) && !isArray(data)) {
    return data
  }
  if (isArray(data)) {
    newData = data
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
        return filterNoKeyObj(it, 1)
      })
  }
  if (isObject(data)) {
    newData = { ...data }
    for (const key of Object.keys(newData)) {
      const value = newData[key]
      if (!isObject(value) && !isArray(value)) {
        continue
      }
      if (isObject(value) && Object.keys(value).length < 1) {
        delete newData[key]
        continue
      }
      if (isArray(value) && value.length < 1) {
        delete newData[key]
        continue
      }
      newData[key] = filterNoKeyObj(value, 1)
    }
  }

  if (cnt - 1 > 0) {
    return filterNoKeyObj(newData, cnt - 1)
  }

  return newData
}
