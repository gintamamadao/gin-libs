import { ChainNode } from './node'
import { push } from './push'
import { pop } from './pop'
import { shift } from './shift'
import { unshift } from './unshift'
import { insertAfter } from './insertAfter'
import { insertBefore } from './insertBefore'
import { remove } from './remove'
import { BaseChain } from './base'
import { isArray } from 'ginlibs-type-check'

class Chain extends BaseChain {
  public push: typeof push = push
  public pop: typeof pop = pop
  public shift: typeof shift = shift
  public unshift: typeof unshift = unshift
  public insertAfter: typeof insertAfter = insertAfter
  public insertBefore: typeof insertBefore = insertBefore
  public remove: typeof remove = remove

  constructor(node?: ChainNode | string[] | null) {
    super()
    this.init(node)
  }

  public init(node?: ChainNode | string[] | null) {
    if (!node) {
      return
    }
    if (isArray(node)) {
      let value = node.shift()
      while (value) {
        this.push(value)
        value = node.shift()
      }
      this.checkLength()
      return
    }

    if (node && node.value) {
      let curNode: any = node
      while (curNode) {
        this.push(curNode.value)
        curNode = curNode.next
      }
      this.checkLength()
      return
    }
  }

  public clone() {
    let curNode = this.head.next
    const newChain = new Chain()
    if (!curNode) {
      return newChain
    }
    let cloneNode = new ChainNode(curNode.value)
    newChain.head.next = cloneNode
    while (curNode.next) {
      curNode = curNode.next
      cloneNode.next = new ChainNode(curNode.value)
      cloneNode = cloneNode.next
    }
    newChain.checkLength()
    return newChain
  }
}

export { ChainNode }

export default Chain
