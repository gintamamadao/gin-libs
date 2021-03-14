import { ChainNode } from './node'

export class BaseChain {
  public head: ChainNode
  public length = 0
  constructor() {
    this.head = new ChainNode('__chain_head__')
  }
}
