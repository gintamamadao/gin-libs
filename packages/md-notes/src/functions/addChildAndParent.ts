import fromMarkdown from 'mdast-util-from-markdown'
import toMarkdown from 'mdast-util-to-markdown'
import fsUtil from 'ginlibs-file-util'
import { isArray } from 'ginlibs-type-check'
import { renderTplFile } from 'ginlibs-template'
import {
  getHDTLEntryList,
  getHDTLEntryListChldObj,
  addListItem,
} from '../utils/astUtil'
import { LiftoffEnv } from 'liftoff'
import { basename, join, resolve } from 'path'
import { TPL_FILE_DIR } from '../types/constant'
import prettier from 'prettier'

export const addChildAndParent = (
  liftEnv: LiftoffEnv,
  checkFiles?: string[]
) => {
  const { cwd } = liftEnv
  const docsPath = join(cwd, '/docs')
  const notesFiles = fsUtil.find(docsPath, './*.md')
  const checkFilesArr =
    checkFiles && checkFiles.length > 0 ? checkFiles : notesFiles
  const notesFilesKey = notesFiles.map((itFile) => basename(itFile))

  for (const url of checkFilesArr) {
    const contStr = fsUtil.read(url)
    if (!contStr) {
      fsUtil.del(url)
      continue
    }
    const notesData = fromMarkdown(contStr)
    const chldChldEntryList = getHDTLEntryList(notesData.children, 'Child Node')
    if (!isArray(chldChldEntryList) || chldChldEntryList.length <= 0) {
      continue
    }
    for (const it of chldChldEntryList) {
      const { key, url: childUrl } = it
      const exsitUrl = notesFilesKey.find((itKey: string) => {
        return itKey === key
      })
      if (!exsitUrl) {
        const newCont = renderTplFile(join(TPL_FILE_DIR, 'base-md-notes.tpl'), {
          parentKey: basename(url),
        })
        const prettierCont = prettier.format(newCont || '', {
          parser: 'markdown',
        })
        fsUtil.write(resolve(docsPath, childUrl), prettierCont)
      } else {
        const itContStr = fsUtil.read(resolve(docsPath, childUrl))
        if (!itContStr) {
          fsUtil.del(exsitUrl)
          continue
        }
        const itNotesData = fromMarkdown(itContStr)
        const itParentEntryList = getHDTLEntryList(
          itNotesData.children,
          'Parent Node'
        )
        const exsitParent = itParentEntryList.find((itPnt) => {
          return itPnt.key === basename(url)
        })
        if (!exsitParent) {
          const listChld = getHDTLEntryListChldObj(
            itNotesData.children,
            'Parent Node'
          )
          if (listChld && isArray(listChld.children)) {
            addListItem(`- [../](./${basename(url)})`, listChld)
            const prettierCont = prettier.format(
              toMarkdown(itNotesData) || '',
              {
                parser: 'markdown',
              }
            )
            fsUtil.write(resolve(docsPath, childUrl), prettierCont)
          }
        }
      }
    }
  }
}
