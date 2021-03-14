import { ChainNode } from './node'
import { push } from './push'
import { insertAfter } from './insertAfter'
import { insertBefore } from './insertBefore'
import { remove } from './remove'

class Chain {
  public head: ChainNode
  public length = 0
  constructor() {
    this.head = new ChainNode('__chain_head__')
  }
  public push: typeof push = push
  public insertAfter: typeof insertAfter = insertAfter
  public insertBefore: typeof insertBefore = insertBefore
  public remove: typeof remove = remove
}

export default Chain
