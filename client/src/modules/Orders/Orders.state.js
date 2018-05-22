import {
  FORCE_RENDER,
  APPLY_ORDERS_LIST_SETTINGS,
  ORDERS_PRESETS_SET,
  SET_ORDERS_COLUMNS,
  GET_ORDER_MODEL,
  LOAD_MORE_ORDERS,
  SHOW_MORE_ORDERS,
  REQUIRE_ORDER_UPDATE,
  PRESETS_GET,
  PRESETS_SAVE,
  PRESETS_REMOVE
} from '../../redux/actionTypes'

const initialState = {
  presets: [],
  showRows: 10,
  canLoadMore: true,
  orderBy: 'id',
  columnFilter: [],
  filters: [],
  type: 'order',
  panelsExpanded: true
}

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

export const showMoreOrders = payload => ({
  type: SHOW_MORE_ORDERS,
  payload
})

export const loadMoreOrders = payload => ({
  type: LOAD_MORE_ORDERS,
  payload
})

export const setOrdersColumns = payload => ({
  type: SET_ORDERS_COLUMNS,
  payload
})

export const forceRender = () => ({
  type: FORCE_RENDER
})

export const applyOrdersListSettings = payload => ({
  type: APPLY_ORDERS_LIST_SETTINGS,
  payload
})

export const getOrderModel = payload => ({
  type: GET_ORDER_MODEL,
  payload
})

export const requireOrderUpdate = payload => ({
  type: REQUIRE_ORDER_UPDATE,
  payload
})

const ordersReducers = {
  [ORDERS_PRESETS_SET]: (state, presets) => ({
    ...state,
    presets
  }),

  [SET_ORDERS_COLUMNS]: (state, columns) => {
    // By default all columns are active
    // We need to set active columns explicitly and pass as props for the data grid to be rendered correctly
    // We also might need all columns as a model if we are planning to add new products
    columns = columns.filter(item => item.key !== 'type')
    let activeColumns = state.activeColumns ? [...state.activeColumns] : columns
    let columnFilter = activeColumns.map(column => column.key)

    return {
      ...state,
      columns,
      activeColumns,
      columnFilter
    }
  },

  [SHOW_MORE_ORDERS]: (state, payload) => {
    if (state.requireUpdate) {
      const { canLoadMore, orders } = payload
      return {
        ...state,
        data: orders,
        canLoadMore,
        ordersLoaded: orders.length,
        requireUpdate: false
      }
    } else if (state.canLoadMore) {
      const { canLoadMore, orders } = payload
      const data = state.data ? [...state.data].concat(orders) : orders
      return {
        ...state,
        data,
        canLoadMore,
        ordersLoaded: data.length
      }
    } else {
      return state
    }
  },

  [APPLY_ORDERS_LIST_SETTINGS]: (state, payload) => {
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

  [REQUIRE_ORDER_UPDATE]: (state, payload) => {
    const { requireUpdate } = payload
    return {
      ...state,
      requireUpdate
    }
  },

  [FORCE_RENDER]: state => {
    return {
      ...state
    }
  }
}

export const ordersReducer = (state = initialState, action) => {
  let reducer = ordersReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
