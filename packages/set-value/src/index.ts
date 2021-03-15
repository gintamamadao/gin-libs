import { isNilVal, isObject, isArray } from 'ginlibs-type-check'

export const getKey = (key: string, obj: any) => {
  let lastObj = obj
  const keyMatch = key.match(/(^\w+\b)|(\.\b(\w+)\b)|(\[\d+\])/g)
  if (!keyMatch || isNilVal(lastObj)) {
    return
  }
  const regx = new RegExp(/\[\d+\]/)
  const keyLen = keyMatch.length
  for (let i = 0; i < keyLen; i++) {
    const matKey = keyMatch[i]
    let trueKey: string | number = matKey
    const isLastKey = i === keyLen - 1
    const isArrIndex = regx.test(matKey)
    if (!isArrIndex && i !== 0) {
      trueKey = matKey.slice(1, matKey.length)
    } else if (isArrIndex) {
      const arrIndexMatch = matKey.match(/^\[(\d)+\]$/) || []
      trueKey = arrIndexMatch[1]
    }
    if (
      !isLastKey &&
      (isObject(lastObj[trueKey]) || isArray(lastObj[trueKey]))
    ) {
      lastObj = lastObj[trueKey]
    } else {
      return lastObj[trueKey]
    }
  }
  return
}

export const setKey = (key: string, value: any, obj: any = {}) => {
  let lastObj = obj
  const backObj = lastObj
  const keyMatch = key.match(/(^\w+\b)|(\.\b(\w+)\b)|(\[\d+\])/g)
  if (!keyMatch) {
    return lastObj
  }
  const regx = new RegExp(/\[\d+\]/)
  const keyLen = keyMatch.length
  keyMatch.forEach((matKey, index) => {
    let trueKey: string | number = matKey
    const isArrIndex = regx.test(matKey)
    const isLastKey = index === keyLen - 1
    const nextKey = keyMatch[index + 1]
    if (!isArrIndex && index !== 0) {
      trueKey = matKey.slice(1, matKey.length)
    } else if (isArrIndex) {
      const arrIndexMatch = matKey.match(/^\[(\d)+\]$/) || []
      trueKey = parseInt(arrIndexMatch[1], 10)
    }
    if (isLastKey) {
      lastObj[trueKey] = value
      return
    }
    if (!regx.test(nextKey) && !isLastKey && !isObject(lastObj[trueKey])) {
      lastObj[trueKey] = {}
    }
    if (regx.test(nextKey) && !isLastKey && !isArray(lastObj[trueKey])) {
      lastObj[trueKey] = []
    }
    lastObj = lastObj[trueKey]
  })

  return backObj
}
