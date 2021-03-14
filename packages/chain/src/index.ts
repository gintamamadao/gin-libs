import { ChainNode } from './node'
import { push } from './push'
import { find } from './find'

class Chain {
  public head: ChainNode
  public length = 0
  constructor() {
    this.head = new ChainNode('__chain_head__')
  }
  public push: typeof push = push
  public find: typeof find = find
}

export default Chain
