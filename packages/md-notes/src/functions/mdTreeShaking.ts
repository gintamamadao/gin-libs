import { LiftoffEnv } from 'liftoff'
import fsUtil from 'ginlibs-file-util'
import { basename, join, resolve } from 'path'
import fromMarkdown from 'mdast-util-from-markdown'
import { NodeNameMap } from '../types/map'
import { isArray } from 'ginlibs-type-check'
import {
  getHDTLEntryList,
  getHDTLEntryListChldObj,
  addListItem,
} from '../utils/astUtil'
import cache from 'ginlibs-cache'

const EntryMDFiles = ['root.md']

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
      cache.write(JSON.stringify(items, undefined, 2))
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
      return checkItems(chldChldEntryList)
    }
  }
  checkItems(entryItems)
  cache.write(JSON.stringify(notesFileMap, undefined, 2))
}
