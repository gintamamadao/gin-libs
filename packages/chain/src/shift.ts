import { BaseChain } from './base'

export function shift(this: BaseChain) {
  const prevNode = this.head
  const curNode = this.head.next
  if (!curNode) {
    return null
  }
  prevNode.next = curNode.next
  return curNode
}
