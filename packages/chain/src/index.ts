import { ChainNode } from './node'
import { push } from './push'
import { pop } from './pop'
import { shift } from './shift'
import { unshift } from './unshift'
import { insertAfter } from './insertAfter'
import { insertBefore } from './insertBefore'
import { remove } from './remove'
import { BaseChain } from './base'

class Chain extends BaseChain {
  public push: typeof push = push
  public pop: typeof pop = pop
  public shift: typeof shift = shift
  public unshift: typeof unshift = unshift
  public insertAfter: typeof insertAfter = insertAfter
  public insertBefore: typeof insertBefore = insertBefore
  public remove: typeof remove = remove

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
    return newChain
  }
}

export default Chain
