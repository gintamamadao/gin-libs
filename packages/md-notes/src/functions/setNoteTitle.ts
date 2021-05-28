import fsUtil from 'ginlibs-file-util'
import { resolve, basename } from 'path'
import fromMarkdown from 'mdast-util-from-markdown'
import { NodeNameMap } from '../types/map'
import { setNextHDTLNode } from '../utils/astUtil'
import { getDocsPath, findAllNotes } from '../utils'
import cache from 'ginlibs-cache'
import prettier from 'prettier'
import toMarkdown from 'mdast-util-to-markdown'
import { EntryMDFiles } from '../types/constant'
import { getParentName } from './setParentName'

export const setNoteTitle = (url?: string) => {
  const docsPath = getDocsPath()
  const notesList = url ? [{ url, key: basename(url) }] : findAllNotes()

  for (const noteIt of notesList) {
    const { url, key } = noteIt
    const contStr = fsUtil.read(resolve(docsPath, url))
    if (!contStr) {
      fsUtil.del(url)
      continue
    }
    if (EntryMDFiles.includes(key)) {
      continue
    }

    const noteAst = fromMarkdown(contStr)
    const title = getParentName(url)
    const titleNode = fromMarkdown(`# ${title}`)

    // cache.write(JSON.stringify(titleNode, undefined, 2))
    // cache.write(JSON.stringify(noteAst.children, undefined, 2) + ' mmmm')
    setNextHDTLNode(noteAst.children, NodeNameMap.childNode, titleNode)

    const prettierCont = prettier.format(toMarkdown(noteAst) || '', {
      parser: 'markdown',
    })
    fsUtil.write(url, prettierCont)
  }
}
