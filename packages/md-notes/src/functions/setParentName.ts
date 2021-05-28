import { LiftoffEnv } from 'liftoff'
import fsUtil from 'ginlibs-file-util'
import { resolve, basename } from 'path'
import fromMarkdown from 'mdast-util-from-markdown'
import { NodeNameMap } from '../types/map'
import {
  getHDTLEntryList,
  getHDTLEntryListChldObj,
  delListItemByKey,
  addListItem,
} from '../utils/astUtil'
import { getDocsPath, findAllNotes } from '../utils'
import cache from 'ginlibs-cache'
import prettier from 'prettier'
import toMarkdown from 'mdast-util-to-markdown'
import { EntryMDFiles } from '../types/constant'

export const getParentName = (url: string) => {
  const docsPath = getDocsPath()
  const contStr = fsUtil.read(resolve(docsPath, url))
  const noteAst = fromMarkdown(contStr)
  const parentEntryList = getHDTLEntryList(
    noteAst.children,
    NodeNameMap.parentNode
  )
  const key = basename(url)
  for (const parentIt of parentEntryList) {
    const parentContStr = fsUtil.read(resolve(docsPath, parentIt.url))
    const parentAst = fromMarkdown(parentContStr)
    const parentChldEntryList = getHDTLEntryList(
      parentAst.children,
      NodeNameMap.childNode
    )
    const exsitNoteSelf = parentChldEntryList.find((it) => {
      return it.key === key
    })
    if (!exsitNoteSelf) {
      continue
    }
    return exsitNoteSelf.name
  }
}

export const setParentName = () => {
  const notesList = findAllNotes()

  for (const noteIt of notesList) {
    const { url, key } = noteIt
    const contStr = fsUtil.read(url)
    if (!contStr) {
      fsUtil.del(url)
      continue
    }
    if (EntryMDFiles.includes(key)) {
      continue
    }
    const noteAst = fromMarkdown(contStr)
    const itParentEntryList = getHDTLEntryList(
      noteAst.children,
      NodeNameMap.parentNode
    )
    for (const parentIt of itParentEntryList) {
      if (EntryMDFiles.includes(parentIt.key)) {
        continue
      }
      // cache.write(JSON.stringify(parentIt, undefined, 2))
      const listChld = getHDTLEntryListChldObj(
        noteAst.children,
        NodeNameMap.parentNode
      )
      // cache.write(JSON.stringify(listChld, undefined, 2))
      delListItemByKey(listChld, parentIt.key)
      addListItem(
        `- [${getParentName(parentIt.url)}](./${parentIt.key})`,
        listChld
      )
    }
    const prettierCont = prettier.format(toMarkdown(noteAst) || '', {
      parser: 'markdown',
    })
    fsUtil.write(url, prettierCont)
  }
}
