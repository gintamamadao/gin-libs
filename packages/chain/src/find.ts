import { BaseChain } from './base'

export function find(this: BaseChain, value: string) {
  let curNode = this.head.next
  if (curNode == null) {
    return null
  }
  if (curNode.value === value) {
    return curNode
  }
  while (curNode.next) {
    curNode = curNode.next
    if (curNode.value === value) {
      return curNode
    }
  }
  return null
}
