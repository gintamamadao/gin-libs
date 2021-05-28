import { addChildAndParent } from './addChildAndParent'
import { mdPretty } from './mdPretty'
import { delNotExistParent } from './delNotExistParent'
import { delNotExistChild } from './delNotExistChild'

export const mdTreeShaking = async () => {
  delNotExistChild()
  delNotExistParent()
  addChildAndParent()
  mdPretty()
}
