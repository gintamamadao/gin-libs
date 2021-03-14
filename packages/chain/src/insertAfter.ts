import { BaseChain } from './base'
import { ChainNode } from './node'

export function insertAfter(this: BaseChain, value: string, anchor: string) {
  const anchorNode = this.find(anchor)
  if (!anchorNode) {
    return false
  }
  const node = new ChainNode(value)
  node.next = anchorNode.next
  anchorNode.next = node
  this.length++
  return true
}
