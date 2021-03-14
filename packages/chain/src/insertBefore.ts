import { BaseChain } from './base'
import { ChainNode } from './node'

export function insertBefore(this: BaseChain, value: string, anchor: string) {
  const anchorPrevNode = this.findPrevious(anchor)
  if (!anchorPrevNode) {
    return false
  }
  const node = new ChainNode(value)
  node.next = anchorPrevNode.next
  anchorPrevNode.next = node
  this.length++
  return true
}
