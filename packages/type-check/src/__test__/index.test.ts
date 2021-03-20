import {
  isString,
  isArray,
  isBoolean,
  isObject,
  isNilVal,
  isNull,
  isNumber,
  isNumeric,
  isFunc,
  isPromise,
  isUndefined,
  isDate,
  isEmptyObject,
  isEmptyArray,
  isThisType,
} from '../index'

describe('判断是否字符串：isString', () => {
  test('true', () => {
    expect(isString('')).toBe(true)
  })
  test('false', () => {
    expect(isString(1)).toBe(false)
  })
})

describe('判断是否数组：isArray', () => {
  test('true', () => {
    expect(isArray([])).toBe(true)
    expect(isArray([1])).toBe(true)
  })
  test('false', () => {
    expect(isArray({})).toBe(false)
  })
})

describe('判断是否空数组：isEmptyArray', () => {
  test('true', () => {
    expect(isEmptyArray([])).toBe(true)
  })
  test('false', () => {
    expect(isEmptyArray({})).toBe(false)
    expect(isEmptyArray([1])).toBe(false)
  })
})

describe('判断是否布尔型：isBoolean', () => {
  test('true', () => {
    expect(isBoolean(false)).toBe(true)
  })
  test('false', () => {
    expect(isBoolean(0)).toBe(false)
  })
})

describe('判断是否对象：isObject', () => {
  test('true', () => {
    expect(isObject({})).toBe(true)
    expect(
      isObject({
        a: 1,
      })
    ).toBe(true)
  })
  test('false', () => {
    expect(isObject([])).toBe(false)
  })
})

describe('判断是否空对象：isEmptyObject', () => {
  test('true', () => {
    expect(isEmptyObject({})).toBe(true)
  })
  test('false', () => {
    expect(isEmptyObject([])).toBe(false)
    expect(
      isEmptyObject({
        a: 1,
      })
    ).toBe(false)
  })
})

describe('判断是否字是空值：isNilVal', () => {
  test('true', () => {
    expect(isNilVal(null)).toBe(true)
    expect(isNilVal(undefined)).toBe(true)
  })
  test('判断是否字符串：false', () => {
    expect(isNilVal('')).toBe(false)
    expect(isNilVal(0)).toBe(false)
    expect(isNilVal(false)).toBe(false)
  })
})

describe('判断是否数字：isNumber', () => {
  test('true', () => {
    expect(isNumber(1)).toBe(true)
    expect(isNumber(0)).toBe(true)
    expect(isNumber(-1)).toBe(true)
    expect(isNumber(1.1)).toBe(true)
  })
  test('false', () => {
    expect(isNumber(NaN)).toBe(false)
    expect(isNumber(Infinity)).toBe(false)
    expect(isNumber([])).toBe(false)
    expect(isNumber('')).toBe(false)
  })
})

describe('判断是否数字字符串：isNumeric', () => {
  test('true', () => {
    expect(isNumeric('1')).toBe(true)
    expect(isNumeric('2')).toBe(true)
    expect(isNumeric('12')).toBe(true)
    expect(isNumeric('-1')).toBe(true)
    expect(isNumeric('1.2')).toBe(true)
    expect(isNumeric('-1.2')).toBe(true)
    expect(isNumeric('-0001.2000')).toBe(true)
    expect(isNumeric('-1.2e1')).toBe(true)
  })
  test('false', () => {
    expect(isNumeric('a')).toBe(false)
  })
})

describe('判断是否函数：isFunc', () => {
  test('true', () => {
    expect(isFunc(() => {})).toBe(true)
    expect(isFunc(function () {})).toBe(true)
    expect(isFunc(async function () {})).toBe(true)
  })
  test('false', () => {
    expect(isFunc({})).toBe(false)
    expect(isFunc([])).toBe(false)
  })
})

describe('判断是否是 Promise：isPromise', () => {
  test('true', () => {
    expect(isPromise(new Promise(() => {}))).toBe(true)
    expect(isPromise((async function () {})())).toBe(true)
    expect(
      isPromise({
        then: () => {},
      })
    ).toBe(true)
  })
  test('false', () => {
    expect(isPromise(() => {})).toBe(false)
    expect(isPromise({})).toBe(false)
  })
})

describe('判断是否是 undefined：isUndefined', () => {
  test('true', () => {
    expect(isUndefined(undefined)).toBe(true)
  })
  test('false', () => {
    expect(isUndefined(null)).toBe(false)
    expect(isUndefined(0)).toBe(false)
    expect(isUndefined('')).toBe(false)
    expect(isUndefined(NaN)).toBe(false)
  })
})

describe('判断是否是 null：isNull', () => {
  test('true', () => {
    expect(isNull(null)).toBe(true)
  })
  test('false', () => {
    expect(isNull(undefined)).toBe(false)
    expect(isUndefined(0)).toBe(false)
    expect(isUndefined('')).toBe(false)
    expect(isUndefined(NaN)).toBe(false)
  })
})

describe('判断是否是输入类型：isThisType', () => {
  test('true', () => {
    expect(isThisType(new Promise(() => {}), 'Promise')).toBe(true)
    expect(isThisType(() => {}, 'Function')).toBe(true)
    expect(isThisType(new Date(), 'Date')).toBe(true)
  })
  test('false', () => {
    expect(isThisType([], 'Object')).toBe(false)
  })
})

describe('判断是否日期对象：isDate', () => {
  test('true', () => {
    expect(isDate(new Date())).toBe(true)
    expect(isDate(new Date(1))).toBe(true)
  })
  test('false', () => {
    expect(isDate({})).toBe(false)
    expect(isDate(new Date('a'))).toBe(false)
  })
})
