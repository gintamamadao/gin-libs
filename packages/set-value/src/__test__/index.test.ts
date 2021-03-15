import { setKey, getKey } from '../index'

describe('按字符串的 key 信息赋值 setKey', () => {
  test('正确分析 key 并赋值', async () => {
    expect(setKey('a.b[0]', 0)).toStrictEqual(
      expect.objectContaining({
        a: {
          b: [0],
        },
      })
    )
    expect(setKey('a.b.c.d[0]', 0)).toStrictEqual(
      expect.objectContaining({
        a: {
          b: {
            c: {
              d: [0],
            },
          },
        },
      })
    )
    expect(setKey('a.b1b[0]', 0)).toStrictEqual(
      expect.objectContaining({
        a: {
          b1b: [0],
        },
      })
    )
    expect(setKey('a.b1b.c_c[0]', 0)).toStrictEqual(
      expect.objectContaining({
        a: {
          b1b: {
            c_c: [0],
          },
        },
      })
    )
    expect(JSON.stringify(setKey('...', 0))).toBe('{}')
  })
})

describe('按字符串的 key 信息获取值 getKey', () => {
  test('正确分析 key 并赋值', async () => {
    const data1 = {
      a: {
        b: ['a'],
      },
    }
    expect(getKey('a.b[0]', data1)).toBe('a')

    const data2 = {
      a: {
        b: {
          c: {
            d: ['b'],
          },
        },
      },
    }
    expect(getKey('a.b.c.d[0]', data2)).toBe('b')

    const data3 = {
      a: {
        b1b: ['c'],
      },
    }
    expect(getKey('a.b1b[0]', data3)).toBe('c')

    const data4 = {
      a: {
        b1b: {
          c_c: ['d'],
        },
      },
    }
    expect(getKey('a.b1b.c_c[0]', data4)).toBe('d')

    expect(getKey('...', {})).toBe(undefined)
    expect(getKey('key', {})).toBe(undefined)
  })
})
