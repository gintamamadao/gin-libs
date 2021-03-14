import { BaseChain } from './base'

export function remove(this: BaseChain, value: string) {
  const curNode = this.find(value)
  if (!curNode) {
    return false
  }
  const prevNode = this.findPrevious(value)
  if (!prevNode) {
    this.head.next = curNode.next
  } else {
    prevNode.next = curNode.next
  }
  this.length--
}
