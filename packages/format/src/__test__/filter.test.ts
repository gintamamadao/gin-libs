import { filterNilKey, filterNoKeyObj } from '../index'

describe('清除键值为空的键', () => {
  test('清除 null & undefined', async () => {
    expect(
      filterNilKey({
        a: 0,
        b: null,
        c: undefined,
        d: '',
        e: false,
      })
    ).toStrictEqual(
      expect.objectContaining({
        a: 0,
        d: '',
      })
    )
  })
  test('多层嵌套清除', async () => {
    expect(
      filterNilKey({
        layout1: {
          a: 0,
          b: null,
          layout2: {
            c: undefined,
            d: '',
            e: false,
          },
        },
      })
    ).toStrictEqual(
      expect.objectContaining({
        layout1: {
          a: 0,
          layout2: {
            d: '',
            e: false,
          },
        },
      })
    )
  })
  test('数组清除', async () => {
    expect(
      filterNilKey([
        null,
        undefined,
        1,
        {
          a: 0,
          b: null,
        },
      ])
    ).toStrictEqual(
      expect.objectContaining([
        1,
        {
          a: 0,
        },
      ])
    )
  })
})

describe('清除键值为空对象或者空数组的键', () => {
  test('清除空对象或者空数组', async () => {
    const testData1 = filterNoKeyObj({
      a: 0,
      b: {},
      c: [],
    })
    expect(JSON.stringify(testData1)).toBe('{"a":0}')

    const testData2 = filterNoKeyObj({
      a: 0,
      b: {
        c: [],
      },
    })
    expect(JSON.stringify(testData2)).toBe('{"a":0,"b":{}}')

    const testData3 = filterNoKeyObj(
      {
        a: 0,
        b: {
          c: [],
        },
      },
      2
    )
    expect(JSON.stringify(testData3)).toBe('{"a":0}')

    const testData4 = filterNoKeyObj(
      {
        a: 0,
        b: {
          c: [{}],
        },
      },
      3
    )
    expect(JSON.stringify(testData4)).toBe('{"a":0}')
  })
})
