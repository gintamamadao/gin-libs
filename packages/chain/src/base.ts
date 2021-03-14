import { ChainNode } from './node'
import { isFunc } from 'ginlibs-type-check'

export class BaseChain {
  public head: ChainNode
  public length = 0
  constructor() {
    this.head = new ChainNode('__chain_head__')
  }

  find(value: string | ((value: string) => boolean)) {
    let curNode = this.head.next
    if (!curNode) {
      return null
    }
    const vailCheck = isFunc(value)
      ? value
      : (nodeVale: string) => {
          return nodeVale === value
        }
    if (vailCheck(curNode.value)) {
      return curNode
    }
    while (curNode.next) {
      curNode = curNode.next
      if (vailCheck(curNode.value)) {
        return curNode
      }
    }
    return null
  }

  findPrevious(value: string | ((value: string) => boolean), cnt = 1) {
    let curNode = this.head.next
    if (!curNode) {
      return null
    }
    const vailCheck = isFunc(value)
      ? value
      : (nodeVale: string) => {
          return nodeVale === value
        }
    if (vailCheck(curNode.value)) {
      return null
    }
    const prevNodeList: ChainNode[] = []
    while (curNode.next) {
      prevNodeList.unshift(curNode)
      curNode = curNode.next
      if (vailCheck(curNode.value)) {
        return prevNodeList[cnt - 1] ? prevNodeList[cnt - 1] : null
      }
      if (prevNodeList.length > cnt) {
        prevNodeList.pop()
      }
    }
    return null
  }

  getNodeValues() {
    let curNode = this.head.next
    const values: string[] = []
    if (!curNode) {
      return values
    }
    values.push(curNode.value)
    while (curNode.next) {
      curNode = curNode.next
      values.push(curNode.value)
    }
    return values
  }
}
