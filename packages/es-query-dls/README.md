# ginlibs-es-query-dls

[![NPM version](https://badgen.net/npm/v/ginlibs-es-query-dls)](https://www.npmjs.com/package/ginlibs-es-query-dls)
[![NPM Weekly Downloads](https://badgen.net/npm/dw/ginlibs-es-query-dls)](https://www.npmjs.com/package/ginlibs-es-query-dls)
[![License](https://badgen.net/npm/license/ginlibs-es-query-dls)](https://www.npmjs.com/package/ginlibs-es-query-dls)

## 项目简介

> 生成 es 查询 dls 的工具类

## 安装

```sh
npm i ginlibs-es-query-dls --save
```

## 使用例子

```js
import EsQueryDls from 'ginlibs-es-query-dls'

const dls = new EsQueryDls().must
  .term({
    name: {
      value: 'apple',
      keyword: true,
    },
  })
  .toQuery('fruit_es', 'type')

console.log(dls)

/**
{
  "index": "test",
  "type": "type",
  "body": {
    "query": {
      "bool": {
        "must": [
          {
            "term": {
              "name.keyword": "apple"
            }
          }
        ]
      }
    }
  }
}
**/
```
