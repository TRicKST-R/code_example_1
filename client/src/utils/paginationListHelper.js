import map from 'lodash/map'
import upperFirst from 'lodash/upperFirst'

export const paginationHelper = ({ clientHeight }) => {
  const { innerHeight } = window
  /* 24px padding of search container, 16px padding of list, 60px - height of list item */
  return Math.floor((innerHeight - clientHeight - 24 - 16) / 60)
}

export const getWholesalersOptions = wholesalers => {
  let wholesalersOptions = [
    {
      label: 'Any',
      value: 'any'
    }
  ]
  /* if wholesalers are present - rebuild array */
  if (wholesalers && wholesalers.length > 0) {
    wholesalersOptions = wholesalersOptions.concat(
      map(wholesalers, ({ title, customId }) => ({
        value: customId,
        label: title
      }))
    )
  }
  return wholesalersOptions
}

export const generateTitle = ({ headers, item }) => {
  return headers.reduce((previousHeader, currentHeader) => {
    const { accessKey, header } = currentHeader
    /* generate header: value */
    return `${previousHeader} / ${header}: ${item[accessKey]}`
  }, '')
}

export const getPath = (page, id) => `/${page}/${id}`

export const getListParams = (name, listState, listActions) => {
  const { [`${name}List`]: list, canLoadMore } = listState
  const {
    [`reset${upperFirst(name)}`]: reset,
    [`get${upperFirst(name)}`]: get
  } = listActions

  return {
    list,
    listActions: {
      reset,
      get
    },
    listState: {
      canLoadMore,
      list
    }
  }
}
