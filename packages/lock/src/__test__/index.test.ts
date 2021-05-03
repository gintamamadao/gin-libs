import { Lock, AsyncLock } from '../index'

export const sleep = (time = 0) => {
  return new Promise<void>((reslove) => {
    setTimeout(() => {
      reslove()
    }, time)
  })
}

describe('上锁函数', () => {
  test('同步上锁', async () => {
    const l = new Lock()
    l.lock('test1')
    expect(l.isLocked('test1')).toBe(true)
    l.unLock('test1')
    expect(l.isLocked('test1')).toBe(false)

    const unLock2 = l.lock('test2')
    expect(l.isLocked('test2')).toBe(true)
    unLock2()
    expect(l.isLocked('test2')).toBe(false)
  })

  test('异步上锁', async () => {
    const al = new AsyncLock()

    let a = 'a'
    setTimeout(() => {
      a += 'c'
      al.unLock()
    }, 200)

    setTimeout(() => {
      a += 'b'
    }, 30)

    await al.getLock()

    expect(a).toBe('abc')
  })

  test('异步上锁2', async () => {
    const al = new AsyncLock()

    setTimeout(() => {
      al.unLock('a2')
    }, 200)

    const str = await al.getLock()

    expect(str).toBe('a2')
  })
})
