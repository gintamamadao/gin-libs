import { BaseChain } from './base'

export function pop(this: BaseChain) {
  let prevNode = this.head
  let curNode = this.head.next
  if (!curNode) {
    return null
  }
  while (curNode.next) {
    prevNode = curNode
    curNode = curNode.next
  }
  prevNode.next = null
  return curNode
}
