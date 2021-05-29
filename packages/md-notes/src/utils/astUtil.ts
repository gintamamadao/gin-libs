import { compose } from 'ginlibs-utils'
import { isString, isArray } from 'ginlibs-type-check'
import { basename, resolve } from 'path'
import fromMarkdown from 'mdast-util-from-markdown'
import fsUtil from 'ginlibs-file-util'
import cache from 'ginlibs-cache'

export const getEntryLink = (ast: any) => {
  return compose(getListItemLinkUrl, getFirstChld, getFirstChld)(ast)
}

export const getEntryName = (ast: any) => {
  return compose(getListItemLinkName, getFirstChld, getFirstChld)(ast)
}

export const getFirstChld = (ast: any) => {
  return ast?.children?.[0]
}

export const getListItemLinkUrl = (ast: any) => {
  return ast?.children?.[0]?.children?.[0]?.url
}

export const getListItemLinkName = (ast: any) => {
  return ast?.children?.[0]?.children[0]?.children?.[0]?.value
}

export const isHeadDepthOne = (ast: any) => {
  const title = getFirstChld(ast)?.value
  if (ast.type !== 'heading' || ast.depth !== 1 || !title || !isString(title)) {
    return false
  }
  return true
}

export const isListAst = (ast: any) => {
  if (!ast || ast.type !== 'list') {
    return false
  }
  return true
}

export const getHeadTitle = (ast: any) => {
  const title = getFirstChld(ast)?.value
  if (!isHeadDepthOne(ast)) {
    return ''
  }
  return title
}

export const getHDTLEntryList = (ast: any, title: string) => {
  if (!isArray(ast) || ast.length <= 0) {
    return []
  }
  const result: any = []
  let count = 0
  for (let i = 0; i < ast.length; i++) {
    const chld = ast[i]
    const chldHT = getHeadTitle(chld)
    if (isHeadDepthOne(chld) && chldHT === title) {
      count++
      continue
    }

    if (isHeadDepthOne(chld) && count > 0) {
      count = 0
      continue
    }

    if (isListAst(chld) && count > 0) {
      Array.prototype.push.apply(result, getAllListItem(chld))
    }
  }
  return result
}

export const getAllListItem = (listAst: any) => {
  const result: any[] = []
  if (!listAst || listAst.type !== 'list') {
    return []
  }
  for (const ltItemChld of listAst.children) {
    if (ltItemChld.type !== 'listItem') {
      continue
    }
    const url = getListItemLinkUrl(ltItemChld)
    const name = getListItemLinkName(ltItemChld)
    if (!url || !name) {
      continue
    }
    result.push({
      key: basename(url),
      url,
      name,
      children: [],
      parent: [],
    })
  }
  return result
}

export const getHDTLEntryListChldObj = (ast: any, title: string) => {
  if (!isArray(ast) || ast.length <= 0) {
    return []
  }
  for (let i = 0; i < ast.length; i++) {
    const chld = ast[i]
    const chldHT = getHeadTitle(chld)
    if (chldHT !== title) {
      continue
    }
    const listChld = ast[i + 1]
    if (!listChld || listChld.type !== 'list') {
      return []
    }
    return listChld
  }
}

export const getNotesPntChldInfo = (url: string, name: string, cwd: string) => {
  const contStr = fsUtil.read(resolve(cwd, url))
  if (!contStr) {
    return null
  }
  const notesData = fromMarkdown(contStr)
  const parentChldEntryList = getHDTLEntryList(notesData.children, 'parent')
  const chldChldEntryList = getHDTLEntryList(notesData.children, 'children')

  const topObj: any = {
    key: basename(url),
    url,
    name,
    parent: parentChldEntryList,
    children: chldChldEntryList,
  }
  return topObj
}

export const checkChildren = (
  ast: any,
  map: any,
  cwd: string,
  count: number
) => {
  const checkFn = (children: any[], cnt: number) => {
    for (const item of children) {
      const { url, name } = item
      const chldObj: any = getNotesPntChldInfo(url, name, cwd)
      if (!chldObj) {
        continue
      }
      map[chldObj.key] = item
      item.parent = chldObj.parent
      item.children = chldObj.children
      if (cnt < count) {
        checkFn(item.children, ++cnt)
      }
    }
  }
  checkFn(ast.children, 0)
}

export const addListItem = (itMdStr: string, ast: any) => {
  const itData = fromMarkdown(itMdStr)
  ast.children.push(compose(getFirstChld, getFirstChld)(itData))
  return ast
}

export const delListItemByKey = (listAst: any, key: string) => {
  const result: any[] = []
  if (!listAst || listAst.type !== 'list') {
    return []
  }
  const index = listAst.children.findIndex((ltIt) => {
    if (ltIt.type !== 'listItem') {
      return false
    }
    const url = getListItemLinkUrl(ltIt)

    // cache.write(url)
    return key === basename(url)
  })
  if (index >= 0) {
    listAst.children.splice(index, 1)
  }
  return result
}

export const setNextHDTLNode = (ast: any, title: string, node: any) => {
  if (!isArray(ast) || ast.length <= 0) {
    return []
  }
  const result: any = []
  let count = 0
  let index = 0
  for (let i = 0; i < ast.length; i++) {
    const chld = ast[i]
    const chldHT = getHeadTitle(chld)
    if (isHeadDepthOne(chld) && chldHT === title) {
      count++
      continue
    }

    if (isHeadDepthOne(chld) && count > 0) {
      count++
      index = i
      break
    }
  }
  if (count === 2) {
    // cache.write(JSON.stringify(ast[index], undefined, 2))
    ast[index] = node
  } else if (count === 1) {
    ast.push(node)
  }
  return result
}
