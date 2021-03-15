import { BaseChain } from './base'
import { ChainNode } from './node'

export function unshift(this: BaseChain, value: string) {
  const node = new ChainNode(value)
  const nextNode = this.head.next
  this.head.next = node
  node.next = nextNode
  return this
}
