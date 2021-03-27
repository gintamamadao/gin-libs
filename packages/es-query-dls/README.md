[![NPM version](https://badgen.net/npm/v/ginlibs-es-query-dls)](https://www.npmjs.com/package/ginlibs-es-query-dls)
[![NPM Weekly Downloads](https://badgen.net/npm/dw/ginlibs-es-query-dls)](https://www.npmjs.com/package/ginlibs-es-query-dls)
[![License](https://badgen.net/npm/license/ginlibs-es-query-dls)](https://www.npmjs.com/package/ginlibs-es-query-dls)

# ginlibs-es-query-dls

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
  .toQuery('fruit_es', 'fruit_type')

console.log(dls)

/**
{
  "index": "fruit_es",
  "type": "fruit_type",
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

## API

### `.must.term(data)`

#### 参数：data

- Type: `Object`
- Desc:
  - data 的 键名 是要筛选的字段名，键值是要查询的 字段值
  - 键值 也可以是一个对象，{value: 'any', keyword: true}, value 是查询的 字段值， keyword 表示是否制定为 keyword 类型


