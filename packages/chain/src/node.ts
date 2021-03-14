export type NodeType = ChainNode | null

export class ChainNode {
  public next: NodeType = null
  public value = ''
  constructor(value = '__chain_node__', next: NodeType = null) {
    this.value = value
    this.next = next
  }
}
