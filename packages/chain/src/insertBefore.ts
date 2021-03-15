import { BaseChain } from './base'
import { ChainNode } from './node'

export function insertBefore(this: BaseChain, value: string, anchor: string) {
  const anchorNode = this.find(anchor)
  if (!anchorNode) {
    return false
  }
  const anchorPrevNode = this.findPrevious(anchor) || this.head
  const node = new ChainNode(value)
  node.next = anchorNode
  anchorPrevNode.next = node
  this.length++
  return true
}
