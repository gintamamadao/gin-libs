import { isNumber, isObject, isArray, isNilVal } from 'ginlibs-type-check'
import { setKey, getKey } from 'ginlibs-set-key'
import { filterNilKey } from 'ginlibs-format'

type AnyObj = Record<string, any>

export type LeafType = 'must' | 'filter' | 'must_not' | 'should'

export interface TermParamsItem {
  value: number | string | number[] | string[]
  keyword?: boolean
}
export interface PagingInfo {
  from?: number
  size?: number
}

export interface TermParams {
  [p: string]: number | string | number[] | string[] | TermParamsItem
}

export const RangeSymbol = {
  gte: true,
  lte: true,
  lt: true,
  gt: true,
}

export type RangeParams = Record<
  string,
  Partial<
    {
      [p in keyof typeof RangeSymbol]: string | number
    }
  >
>

export class LeafClauses {
  private _leafQueryKey = ''
  private _parent: EsQueryDls
  constructor(type: LeafType, parent: EsQueryDls) {
    this._leafQueryKey = `query.bool.${type}`
    this._parent = parent
  }
  public term(obj: TermParams) {
    const curQueryObj = this.getCurQueryObj()
    const newObj = filterNilKey(obj)
    for (const key of Object.keys(newObj)) {
      const value = newObj[key]
      let queryKey = key
      let queryValue = value
      let queryType = 'term'
      if (isObject<TermParamsItem>(value) && value.keyword) {
        queryKey = `${queryKey}.keyword`
        queryValue = value.value
      }
      if (isArray(queryValue)) {
        queryType = 'terms'
      }
      if (isNilVal(queryValue)) {
        continue
      }
      curQueryObj.push({
        [queryType]: {
          [queryKey]: queryValue,
        },
      })
    }
    this.setCurQueryObj(curQueryObj)
    return this._parent
  }

  public like(obj: AnyObj) {
    const curQueryObj = this.getCurQueryObj()
    const newObj = filterNilKey(obj)
    for (const key of Object.keys(newObj)) {
      const value = newObj[key]
      const queryKey = `${key}.keyword`
      const queryValue = `*${value}*`
      const queryType = 'wildcard'
      curQueryObj.push({
        [queryType]: {
          [queryKey]: queryValue,
        },
      })
    }
    this.setCurQueryObj(curQueryObj)
    return this._parent
  }

  public range(obj: RangeParams) {
    const curQueryObj = this.getCurQueryObj()
    const newObj = filterNilKey(obj)
    for (const key of Object.keys(newObj)) {
      const value = newObj[key]
      const isEmpty =
        Object.keys(value).filter((it) => RangeSymbol[it]).length <= 0
      if (isEmpty) {
        continue
      }
      curQueryObj.push({
        range: {
          [key]: value,
        },
      })
    }
    this.setCurQueryObj(curQueryObj)
    return this._parent
  }

  protected getCurQueryObj() {
    const key = this._leafQueryKey
    return getKey(key, this._parent.queryDLS) || []
  }

  protected setCurQueryObj(obj: AnyObj) {
    const key = this._leafQueryKey
    return setKey(key, obj, this._parent.queryDLS)
  }
}

export class EsQueryDls {
  public queryDLS: AnyObj = {}
  public filter: LeafClauses
  public must: LeafClauses
  public not: LeafClauses
  public should: LeafClauses
  protected pagingInfo: PagingInfo

  constructor(queryDLS?: AnyObj, pagingInfo?: PagingInfo) {
    this.queryDLS = queryDLS ?? setKey('query.bool', {}, this.queryDLS)
    this.pagingInfo = pagingInfo ?? {}
    this.filter = new LeafClauses('filter', this)
    this.must = new LeafClauses('must', this)
    this.not = new LeafClauses('must_not', this)
    this.should = new LeafClauses('should', this)
  }

  public sort(key: string, order: 'desc' | 'asc') {
    const saveKey = 'sort'
    const curObj = getKey(saveKey, this.queryDLS) || []
    curObj.push({
      [key]: {
        order,
      },
    })
    setKey(saveKey, curObj, this.queryDLS)
    return this
  }

  public clone() {
    return this.new(this.queryDLS, this.pagingInfo)
  }

  public pagination(cur: number, size: number) {
    this.pagingInfo = this.getESPagination(cur, size)
    return this
  }

  public setScrollSize(size: number) {
    this.pagingInfo = {
      size,
    }
    return this
  }

  public formatDLS(queryDLS: AnyObj) {
    let flag = false
    const boolObj = getKey('query.bool', queryDLS)
    ;['filter', 'must', 'must_not', 'should'].forEach((leafIt: string) => {
      const curLeaf = boolObj[leafIt] || []
      if (curLeaf.length <= 0) {
        delete boolObj[leafIt]
      } else {
        flag = true
      }
    })
    if (!flag) {
      return setKey('query.bool', { must: [{ match_all: {} }] }, queryDLS)
    }
    return queryDLS
  }

  public toQuery(index: string, type = 'type') {
    const query = {
      index,
      type,
      body: {
        ...this.formatDLS(this.queryDLS),
      },
      ...this.pagingInfo,
    }
    this.reset()
    return query
  }

  public reset() {
    this.queryDLS = setKey('query.bool', {})
    this.pagingInfo = {}
    return this
  }

  public new(queryDLS?: AnyObj, pagingInfo?: PagingInfo) {
    return new EsQueryDls(queryDLS, pagingInfo)
  }

  public getData(resp: any = {}) {
    const total: number =
      resp.body?.hits?.total?.value ?? resp.body?.hits?.total ?? 0
    const record =
      resp.body?.hits?.hits?.map((item) => item._source)?.filter?.((v) => v) ??
      []
    return {
      total,
      record,
    }
  }

  public getESPagination(cur: number, size: number) {
    const current = isNumber(cur) ? cur : 1
    const pageSize = isNumber(size) ? size : 10
    return {
      size: pageSize,
      from: (current - 1) * pageSize,
    }
  }
}

export const esQueryDls = new EsQueryDls()
