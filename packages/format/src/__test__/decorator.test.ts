import {
  Exclude,
  Expose,
  transByClass,
  reverseTransByClass,
  getTransKey,
} from '../index'

describe('排除保留属性 key', () => {
  test('只保留属性 key', () => {
    class Example1 {
      @Expose()
      a: string
    }
    const example1 = new Example1()
    expect(
      transByClass(Example1, {
        a: 0,
        b: 1,
      })
    ).toStrictEqual(
      expect.objectContaining({
        a: 0,
      })
    )
    expect(
      transByClass(example1, {
        a: 0,
        b: 1,
      })
    ).toStrictEqual(
      expect.objectContaining({
        a: 0,
      })
    )
  })
  test('映射保留属性 key', () => {
    class Example1 {
      @Expose({
        name: 'b',
      })
      a: string
    }
    const transData = transByClass(Example1, {
      a: 0,
      b: 1,
    })
    expect(transData).toStrictEqual(
      expect.objectContaining({
        a: 1,
      })
    )
    expect(reverseTransByClass(Example1, transData)).toStrictEqual(
      expect.objectContaining({
        b: 1,
      })
    )
    expect(getTransKey(Example1, 'b')).toBe('a')
    expect(getTransKey(Example1, 'a', true)).toBe('b')
  })
  test('只排除属性 key', () => {
    class Example1 {
      @Exclude()
      a: string
    }
    expect(
      transByClass(Example1, {
        a: 0,
        b: 1,
      })
    ).toStrictEqual(
      expect.objectContaining({
        b: 1,
      })
    )
  })
})
