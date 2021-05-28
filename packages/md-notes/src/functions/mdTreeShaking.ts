import { LiftoffEnv } from 'liftoff'
import fsUtil from 'ginlibs-file-util'
import { basename, join } from 'path'
import fromMarkdown from 'mdast-util-from-markdown'
import { NodeNameMap } from '../types/map'
import { isArray } from 'ginlibs-type-check'
import {
  getHDTLEntryList,
  getHDTLEntryListChldObj,
  delListItemByKey,
} from '../utils/astUtil'
import cache from 'ginlibs-cache'
import prettier from 'prettier'
import toMarkdown from 'mdast-util-to-markdown'
import { addChildAndParent } from './addChildAndParent'

const EntryMDFiles = ['root.md']

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
    if (EntryMDFiles.includes(key)) {
      continue
    }
    const noteAst = fromMarkdown(contStr)
    const itParentEntryList = getHDTLEntryList(
      noteAst.children,
      NodeNameMap.parentNode
    )
    // cache.write(JSON.stringify(itParentEntryList, undefined, 2))
    let changeFlag = false
    for (const parentIt of itParentEntryList) {
      const exsitParent = notesList.find((it) => {
        return it.key === parentIt.key
      })
      if (exsitParent) {
        if (EntryMDFiles.includes(exsitParent.key)) {
          continue
        }
        // getHDTLEntryList 获取的路径是相对路径
        const parentContStr = fsUtil.read(exsitParent.url)
        const parentAst = fromMarkdown(parentContStr)
        const parentChldEntryList = getHDTLEntryList(
          parentAst.children,
          NodeNameMap.childNode
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
        NodeNameMap.parentNode
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

export const mdTreeShaking = () => {
  const liftEnv: LiftoffEnv = globalThis._cliLiftEnv || {}
  const { cwd } = liftEnv
  const docsPath = join(cwd, '/docs')

  const notesFiles = fsUtil.find(docsPath, './*.md')
  const notesFileMap = notesFiles.reduce((memo, itFile) => {
    const key = basename(itFile)
    memo[key] = {
      key,
      url: itFile,
      count: 0,
    }
    return memo
  }, {})

  const entryItems = EntryMDFiles.map((key) => {
    notesFileMap[key].count++
    return {
      key,
      url: join(docsPath, key),
    }
  })

  const checkItems = (items: any[]) => {
    for (const it of items) {
      // cache.write(JSON.stringify(items, undefined, 2))
      const entryCont = fsUtil.read(join(docsPath, it.key))
      if (!entryCont) {
        continue
      }
      const notesData = fromMarkdown(entryCont)
      // cache.write(JSON.stringify(notesData, undefined, 2))
      const chldChldEntryList = getHDTLEntryList(
        notesData.children,
        NodeNameMap.childNode
      )
      // cache.write(JSON.stringify(chldChldEntryList, undefined, 2))
      if (!isArray(chldChldEntryList) || chldChldEntryList.length <= 0) {
        continue
      }

      for (const itChld of chldChldEntryList) {
        notesFileMap[itChld.key].count++
      }
      checkItems(chldChldEntryList)
    }
  }
  checkItems(entryItems)
  // cache.write(JSON.stringify(notesFileMap, undefined, 2))
  for (const key of Object.keys(notesFileMap)) {
    const it = notesFileMap[key]
    if (it.count <= 0) {
      fsUtil.del(join(docsPath, it.key))
    }
  }
  delNotExistParent()
  addChildAndParent()
}
