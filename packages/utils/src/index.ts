import { isFunc } from 'ginlibs-type-check'

export const compose = (...args: AnyFunction[]) => {
  const funcs = args.reverse()
  let result: any = void 0
  return function (arg) {
    result = arg
    for (const it of funcs) {
      if (!isFunc(it)) {
        continue
      }
      result = it(result)
    }
    return result
  }
}

export const sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
