import Chain from '../index'

describe('链表 Chain', () => {
  test('链表 Chain 查找插入删除节点', () => {
    const chain1 = new Chain()
    chain1.push('a')
    chain1.push('b')
    chain1.push('c')
    expect(chain1.getNodeValues()).toStrictEqual(
      expect.objectContaining(['a', 'b', 'c'])
    )

    const popNode = chain1.pop()
    expect(chain1.getNodeValues()).toStrictEqual(
      expect.objectContaining(['a', 'b'])
    )
    expect(popNode?.value).toBe('c')

    chain1.unshift('a1')
    expect(chain1.getNodeValues()).toStrictEqual(
      expect.objectContaining(['a1', 'a', 'b'])
    )

    const shiftNode = chain1.shift()
    expect(chain1.getNodeValues()).toStrictEqual(
      expect.objectContaining(['a', 'b'])
    )
    expect(shiftNode?.value).toBe('a1')

    chain1.insertBefore('b1', 'b')
    expect(chain1.getNodeValues()).toStrictEqual(
      expect.objectContaining(['a', 'b1', 'b'])
    )

    chain1.insertAfter('a2', 'a')
    expect(chain1.getNodeValues()).toStrictEqual(
      expect.objectContaining(['a', 'a2', 'b1', 'b'])
    )

    expect(chain1.find('a')?.value).toBe('a')

    expect(chain1.findPrevious('b')?.value).toBe('b1')
    expect(chain1.findPrevious('b', 2)?.value).toBe('a2')
    expect(chain1.findPrevious('b', 3)?.value).toBe('a')

    expect(chain1.findNext('a')?.value).toBe('a2')
    expect(chain1.findNext('a', 2)?.value).toBe('b1')
    expect(chain1.findNext('a', 3)?.value).toBe('b')

    chain1.remove('a2')
    chain1.remove('b1')
    expect(chain1.getNodeValues()).toStrictEqual(
      expect.objectContaining(['a', 'b'])
    )
  })
  test('链表 Chain init', () => {
    const chain2 = new Chain(['1', '2', '3'])
    expect(chain2.getNodeValues()).toStrictEqual(
      expect.objectContaining(['1', '2', '3'])
    )

    const chain3 = new Chain(chain2.getFirstNode())
    expect(chain3.getNodeValues()).toStrictEqual(
      expect.objectContaining(['1', '2', '3'])
    )

    const chain4 = chain3.clone()
    chain4.push('4')
    expect(chain3.getNodeValues()).toStrictEqual(
      expect.objectContaining(['1', '2', '3'])
    )
    expect(chain4.getNodeValues()).toStrictEqual(
      expect.objectContaining(['1', '2', '3', '4'])
    )

    // expect(chain4.length).toBe(4)
    expect(chain4.checkLength()).toBe(4)
  })
})
