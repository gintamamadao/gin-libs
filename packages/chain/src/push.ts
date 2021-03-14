import { ChainNode } from './node'
import { BaseChain } from './base'

export function push(this: BaseChain, value: string) {
  const node = new ChainNode(value)
  let curNode = this.head
  while (curNode?.next !== null) {
    curNode = curNode.next
  }
  curNode.next = node
  this.length++
  return this
}
