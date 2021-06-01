import { LiftoffEnv } from 'liftoff'
import fsUtil from 'ginlibs-file-util'
import { basename, join } from 'path'
import fromMarkdown from 'mdast-util-from-markdown'
import {
  getHDTLEntryList,
  getHDTLEntryListChldObj,
  delListItemByKey,
} from '../utils/astUtil'
import cache from 'ginlibs-cache'
import prettier from 'prettier'
import toMarkdown from 'mdast-util-to-markdown'
import cfg from '../config'

export const delNotExistParent = () => {
  const liftEnv: LiftoffEnv = globalThis._cliLiftEnv || {}
  const { cwd } = liftEnv
  const docsPath = join(cwd, '/docs')
  const notesFiles = fsUtil.find(docsPath, './*.md')
  const notesList = notesFiles.map((itFile) => {
    const key = basename(itFile)
    return {
      key,
      url: itFile,
    }
  })
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
    // cache.write(JSON.stringify(itParentEntryList, undefined, 2))
    let changeFlag = false
    for (const parentIt of itParentEntryList) {
      const exsitParent = notesList.find((it) => {
        return it.key === parentIt.key
      })
      if (exsitParent) {
        if (cfg.rootInfo.key === exsitParent.key) {
          continue
        }
        // getHDTLEntryList 获取的路径是相对路径
        const parentContStr = fsUtil.read(exsitParent.url)
        const parentAst = fromMarkdown(parentContStr)
        const parentChldEntryList = getHDTLEntryList(
          parentAst.children,
          cfg.nodeName.childNode
        )
        // cache.write(JSON.stringify(parentChldEntryList, undefined, 2))
        const exsitNoteSelf = parentChldEntryList.find((it) => {
          return it.key === noteIt.key
        })
        if (exsitNoteSelf) {
          continue
        }
      }
      changeFlag = true
      // cache.write(JSON.stringify(parentIt, undefined, 2))
      const listChld = getHDTLEntryListChldObj(
        noteAst.children,
        cfg.nodeName.parentNode
      )
      // cache.write(JSON.stringify(listChld, undefined, 2))
      delListItemByKey(listChld, parentIt.key)
    }
    if (changeFlag) {
      const prettierCont = prettier.format(toMarkdown(noteAst) || '', {
        parser: 'markdown',
      })
      fsUtil.write(url, prettierCont)
    }
  }
}
