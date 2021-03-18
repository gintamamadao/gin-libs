import EventQueue from '../index'
import Lock from 'ginlibs-lock'

describe('串行队列事件', () => {
  const q = new EventQueue()

  test('自动事件队列', async () => {
    const al = new Lock()
    let str = ''
    const fn = (v: string) => {
      str += v
    }
    q.add(() => fn('1'))
      .add(() => fn('2'))
      .add(() => fn('3'))
      .add(() => fn('4'))
      .add(() => al.break())
      .trigger()

    await al.blocking()
    expect(str).toBe('1234')
  })

  test('按设置的时间间隔执行', async () => {
    const al = new Lock()
    const bl = new Lock()
    let str = ''
    const fn = (v: string) => {
      str += v
    }
    q.add(() => fn('1'), 100)
      .add(() => fn('2'), 100)
      .add(() => al.break())
      .add(() => fn('3'), 100)
      .add(() => fn('4'))
      .add(() => bl.break())
      .trigger()

    await al.blocking()
    expect(str).toBe('12')

    await al.sleep(60)
    expect(str).toBe('12')

    await bl.blocking()
    expect(str).toBe('1234')
  })

  test('多次触发不会打乱执行顺序', async () => {
    const al = new Lock()
    const bl = new Lock()
    let str = ''
    const fn = (v: string) => {
      str += v
    }
    q.add(() => fn('1'), 30)
      .add(() => fn('2'), 30)
      .add(() => fn('3'), 30)
      .add(() => al.break())
      .add(() => fn('4'), 30)
      .add(() => fn('5'), 30)
      .add(() => bl.break())

    q.trigger()
    q.trigger()
    q.trigger()

    await al.blocking()
    expect(str).toBe('123')

    q.trigger()
    q.trigger()
    q.trigger()

    await bl.blocking()
    expect(str).toBe('12345')
  })

  test('如果事件返回的结果是 Promise 会等 Promise 执行完才进入下一步', async () => {
    const al = new Lock()
    let str = ''
    const fn = (v: string) => {
      str += v
    }
    q.add(() => fn('1'))
      .add(() => al.sleep(100), 0)
      .add(() => fn('2'))
      .add(() => fn('3'))
      .add(() => al.break())
      .trigger()

    await al.sleep(80)
    expect(str).toBe('1')
    await al.sleep(30)
    expect(str).toBe('123')
  })

  test('清空事件', async () => {
    const al = new Lock()
    let str = ''
    const fn = (v: string) => {
      str += v
    }
    q.add(() => fn('1'))
      .add(() => fn('2'))
      .add(() => fn('3'))

    q.empty()
    q.add(() => al.break()).trigger()

    await al.blocking()
    expect(str).toBe('')
  })

  test('停止和重启事件', async () => {
    const al = new Lock()
    let str = ''
    const fn = (v: string) => {
      str += v
    }
    q.add(() => fn('1'))
      .add(() => fn('2'))
      .add(() => fn('3'))

    q.stop()
    q.add(() => fn('1'))
      .add(() => al.break())
      .trigger()

    await al.sleep(20)
    expect(str).toBe('')

    q.restart()
    q.add(() => fn('2'))
      .add(() => al.break())
      .trigger()

    await al.blocking()
    expect(str).toBe('2')
  })

  test('暂停和继续事件', async () => {
    const al = new Lock()
    const bl = new Lock()
    let str = ''
    const fn = (v: string) => {
      str += v
    }
    q.add(() => fn('1'), 20)
      .add(() => al.break())
      .add(() => fn('2'))
      .add(() => fn('3'))
      .add(() => bl.break())
      .trigger()

    await al.blocking()
    expect(str).toBe('1')
    q.pause()
    q.trigger()

    await al.sleep(40)
    expect(str).toBe('1')

    q.continus()
    await bl.blocking()
    expect(str).toBe('123')
  })
})
