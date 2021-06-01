import fsUtil from 'ginlibs-file-util'
import { resolve, basename } from 'path'
import fromMarkdown from 'mdast-util-from-markdown'
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
import cfg from '../config'

export const getParentName = (url: string) => {
  const docsPath = getDocsPath()
  const contStr = fsUtil.read(resolve(docsPath, url))
  const noteAst = fromMarkdown(contStr)
  const parentEntryList = getHDTLEntryList(
    noteAst.children,
    cfg.nodeName.parentNode
  )
  const key = basename(url)
  for (const parentIt of parentEntryList) {
    const parentContStr = fsUtil.read(resolve(docsPath, parentIt.url))
    const parentAst = fromMarkdown(parentContStr)
    const parentChldEntryList = getHDTLEntryList(
      parentAst.children,
      cfg.nodeName.childNode
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
    if (cfg.rootInfo.key === key) {
      continue
    }
    const noteAst = fromMarkdown(contStr)
    const itParentEntryList = getHDTLEntryList(
      noteAst.children,
      cfg.nodeName.parentNode
    )
    const listChld = getHDTLEntryListChldObj(
      noteAst.children,
      cfg.nodeName.parentNode
    )
    for (const parentIt of itParentEntryList) {
      if (cfg.rootInfo.key === parentIt.key) {
        delListItemByKey(listChld, parentIt.key)
        addListItem(`- [ROOT](./${parentIt.key})`, listChld)
        continue
      }
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
