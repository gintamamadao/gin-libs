import { ChainNode } from './node'
import { BaseChain } from './base'

export function shift(this: BaseChain, value: string) {
  const node = new ChainNode(value)
  const nextNode = this.head.next
  this.head.next = node
  node.next = nextNode
  return this
}
