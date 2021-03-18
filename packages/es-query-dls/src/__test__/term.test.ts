import EsQueryDls from '../index'

describe('es query dls build', () => {
  const getBaseDls = (data: any) => {
    return {
      index: 'test',
      type: 'type',
      body: {
        query: {
          bool: data,
        },
      },
    }
  }
  test('must.term', async () => {
    const dls = new EsQueryDls().must
      .term({
        a: 0,
        b: 1,
        c: [2, 3],
      })
      .toQuery('test')
    expect(dls).toStrictEqual(
      expect.objectContaining(
        getBaseDls({
          must: [
            {
              term: {
                a: 0,
              },
            },
            {
              term: {
                b: 1,
              },
            },
            {
              terms: {
                c: [2, 3],
              },
            },
          ],
        })
      )
    )
  })
  test('must.term - keyword', async () => {
    const dls = new EsQueryDls().must
      .term({
        a: {
          value: '0',
          keyword: true,
        },
      })
      .toQuery('test')
    expect(dls).toStrictEqual(
      expect.objectContaining(
        getBaseDls({
          must: [
            {
              term: {
                'a.keyword': '0',
              },
            },
          ],
        })
      )
    )
  })
})
