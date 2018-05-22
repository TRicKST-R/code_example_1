import {
  PRODUCTS_PRESETS_SET,
  SHOW_MORE_PRODUCTS,
  SET_PRODUCTS_COLUMNS,
  LOAD_MORE_PRODUCTS,
  DELETE_PRODUCTS,
  UPDATE_PRODUCT,
  UPDATE_PRODUCTS_LIST,
  FORCE_RENDER,
  APPLY_PRODUCTS_LIST_SETTINGS,
  ADD_PRODUCT,
  GET_PRODUCT_MODEL,
  ADD_TO_ORDER,
  PRESETS_GET,
  PRESETS_SAVE,
  PRESETS_REMOVE,
  GET_WHOLESALERS,
  SET_WHOLESALERS
} from '../../redux/actionTypes'

const initialState = {
  presets: [],
  showRows: 10,
  canLoadMore: true,
  orderBy: 'id',
  columnFilter: [],
  filters: [],
  panelsExpanded: true,
  wholesalers: []
}

export const getWholesalers = payload => ({
  type: GET_WHOLESALERS,
  payload
})

export const savePreset = payload => ({
  type: PRESETS_SAVE,
  payload
})

export const getPresets = payload => ({
  type: PRESETS_GET,
  payload
})

export const removePreset = payload => ({
  type: PRESETS_REMOVE,
  payload
})

export const showMoreProducts = payload => ({
  type: SHOW_MORE_PRODUCTS,
  payload
})

export const loadMoreProducts = payload => ({
  type: LOAD_MORE_PRODUCTS,
  payload
})

export const setProductsColumns = payload => ({
  type: SET_PRODUCTS_COLUMNS,
  payload
})

export const deleteProducts = payload => ({
  type: DELETE_PRODUCTS,
  payload
})

export const updateProduct = payload => ({
  type: UPDATE_PRODUCT,
  payload
})

export const updateProductsList = payload => ({
  type: UPDATE_PRODUCTS_LIST,
  payload
})

export const forceRender = () => ({
  type: FORCE_RENDER
})

export const applyProductsListSettings = payload => ({
  type: APPLY_PRODUCTS_LIST_SETTINGS,
  payload
})

export const addProduct = payload => ({
  type: ADD_PRODUCT,
  payload
})

export const getProductModel = payload => ({
  type: GET_PRODUCT_MODEL,
  payload
})

export const addToOrder = payload => ({
  type: ADD_TO_ORDER,
  payload
})

export const setWholesalers = payload => ({
  type: SET_WHOLESALERS,
  payload
})

const productsListReducers = {
  [PRODUCTS_PRESETS_SET]: (state, presets) => ({
    ...state,
    presets
  }),

  [SET_WHOLESALERS]: (state, wholesalers) => {
    console.log(wholesalers)
    return {
      ...state,
      wholesalers
    }
  },

  [SET_PRODUCTS_COLUMNS]: (state, columns) => {
    // By default all columns are active
    // We need to set active columns explicitly and pass as props for the data grid to be rendered correctly
    // We also might need all columns as a model if we are planning to add new products
    let activeColumns = state.activeColumns ? [...state.activeColumns] : columns
    let columnFilter = activeColumns.map(column => column.key)

    return {
      ...state,
      columns,
      activeColumns,
      columnFilter
    }
  },

  [SHOW_MORE_PRODUCTS]: (state, payload) => {
    if (state.canLoadMore) {
      let newState = Object.assign({}, state)
      newState.data = newState.data
        ? newState.data.concat(payload.products)
        : payload.products
      newState.canLoadMore = payload.canLoadMore
      newState.productsLoaded = newState.data.length
      return newState
    } else {
      return state
    }
  },

  [UPDATE_PRODUCTS_LIST]: (state, payload) => {
    // clone current state
    let newState = Object.assign({}, state)

    switch (payload.action) {
      case 'delete':
        if (payload.deletedProducts) {
          // remove deleted products from state
          payload.deletedProducts.forEach(id => {
            const idx = newState.data.findIndex(product => product.id === id)
            newState.data.splice(idx, 1)
          })
          // adjust loaded products count accordingly
          newState.productsLoaded -= payload.deletedProducts.length
        } else {
          // if no ids are passed, the data in current state is cleared
          newState.data = []
        }

        return newState

      case 'update':
        const { id, updated } = payload.payload

        // find product to be updated
        const idx = newState.data.findIndex(product => product.id === id)
        // update its properties
        for (let key in updated) {
          newState.data[idx][key] = updated[key]
        }

        return newState

      case 'add':
        newState.data.unshift(payload)
        newState.productsLoaded += 1

        return newState

      default:
        return state
    }
  },

  [APPLY_PRODUCTS_LIST_SETTINGS]: (state, payload) => {
    const {
      products,
      orderBy,
      columnFilter,
      filters,
      canLoadMore,
      name,
      presetOn
    } = payload

    const columns = [...state.columns]
    const activeColumns = columnFilter
      ? columns.filter(column => columnFilter.indexOf(column.key) > -1)
      : [...state.activeColumns]

    return {
      ...state,
      data: products,
      activeColumns,
      orderBy,
      columnFilter,
      filters,
      canLoadMore,
      presetName: name,
      presetOn
    }
  },

  [FORCE_RENDER]: state => {
    return {
      ...state
    }
  }
}

export const productsListReducer = (state = initialState, action) => {
  let reducer = productsListReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
