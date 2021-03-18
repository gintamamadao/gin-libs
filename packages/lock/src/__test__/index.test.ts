import Lock from '../index'

export const sleep = (time = 0) => {
  return new Promise<void>((reslove) => {
    setTimeout(() => {
      reslove()
    }, time)
  })
}

describe('上锁函数', () => {
  const l = new Lock()

  test('上锁', async () => {
    l.lock('test1')
    expect(l.isLocked('test1')).toBe(true)
    l.unLock('test1')
    expect(l.isLocked('test1')).toBe(false)

    const unLock2 = l.lock('test2')
    expect(l.isLocked('test2')).toBe(true)
    unLock2()
    expect(l.isLocked('test2')).toBe(false)

    let a = 'a'
    setTimeout(() => {
      l.break()
      a += 'c'
    }, 500)

    setTimeout(() => {
      a += 'b'
    }, 100)
    await l.blocking()

    expect(a).toBe('abc')
  })
})
