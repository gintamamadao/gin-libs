import { addChildAndParent } from './addChildAndParent'
import { mdPretty } from './mdPretty'
import { delNotExistParent } from './delNotExistParent'
import { delNotExistChild } from './delNotExistChild'
import { setNoteTitle } from './setNoteTitle'
import { setParentName } from './setParentName'

export const mdTreeShaking = async () => {
  delNotExistChild()
  delNotExistParent()
  addChildAndParent()
  setParentName()
  setNoteTitle()
  mdPretty()
}
