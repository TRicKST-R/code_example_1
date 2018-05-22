import {
  SPLITS_GET_MODEL,
  SPLITS_LOAD_MORE,
  SPLITS_FORCE_RENDER,
  SPLITS_SET_COLUMNS,
  SPLITS_APPLY_SETTINGS,
  SPLITS_SHOW_MORE,
  SPLITS_PRESETS_SAVE,
  SPLITS_PRESETS_SET,
  SPLITS_PRESETS_REMOVE,
  SPLITS_PRESETS_GET
} from '../../redux/actionTypes'

const initialState = {
  data: [],
  presets: [],
  showRows: 10,
  canLoadMore: true,
  orderBy: 'id',
  columnFilter: [],
  filters: [],
  panelsExpanded: true,
  presetOn: false
}

export const getSplitsColumns = () => ({
  type: SPLITS_GET_MODEL,
  payload: {}
})

export const applyListSettings = payload => ({
  type: SPLITS_APPLY_SETTINGS,
  payload
})

export const loadMore = payload => ({
  type: SPLITS_LOAD_MORE,
  payload
})

export const savePreset = payload => ({
  type: SPLITS_PRESETS_SAVE,
  payload
})

export const removePreset = payload => ({
  type: SPLITS_PRESETS_REMOVE,
  payload
})

export const getPresets = () => ({
  type: SPLITS_PRESETS_GET
})

export const forceRender = () => ({
  type: SPLITS_FORCE_RENDER
})

const splitsReducers = {
  [SPLITS_SET_COLUMNS]: (state, columns) => {
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
  [SPLITS_APPLY_SETTINGS]: (state, payload) => {
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
  [SPLITS_SHOW_MORE]: (state, { items, canLoadMore }) => ({
    ...state,
    data: [...state.data, ...items],
    canLoadMore
  }),
  [SPLITS_PRESETS_SET]: (state, presets) => ({
    ...state,
    presets
  }),
  [SPLITS_FORCE_RENDER]: state => ({ ...state })
}

export const splitsReducer = (state = initialState, action) => {
  let reducer = splitsReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
