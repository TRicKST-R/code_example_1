import {
  GET_DISTRIBUTION_CENTERS,
  SET_DISTRIBUTION_CENTERS,
  GET_BREWERIES_WH,
  SET_BREWERIES_WH,
  RESET_BREWERIES_WH,
  SET_BREWERIES_PRODUCTS
} from '../../redux/actionTypes'

const initialState = {
  distributionCentersList: [],
  wholesalers: {
    list: [],
    hasMore: true
  },
  products: {
    list: [],
    hasMore: true
  }
}

export const getDistributionsCenters = payload => ({
  type: GET_DISTRIBUTION_CENTERS,
  payload
})

export const loadMore = payload => ({
  type: GET_BREWERIES_WH,
  payload
})

export const resetBreweriesWH = () => ({
  type: RESET_BREWERIES_WH
})

const dashboardReducers = {
  [SET_DISTRIBUTION_CENTERS]: (state, payload) => ({
    ...state,
    ...payload
  }),
  [SET_BREWERIES_WH]: (
    { wholesalers: { list: presentList }, ...state },
    { list, hasMore }
  ) => ({
    ...state,
    wholesalers: {
      list: presentList.concat(list),
      hasMore
    }
  }),
  [SET_BREWERIES_PRODUCTS]: (
    { products: { list: presentList }, ...state },
    { list, hasMore }
  ) => ({
    ...state,
    products: {
      list: presentList.concat(list),
      hasMore
    }
  }),
  [RESET_BREWERIES_WH]: state => ({
    ...state,
    wholesalers: initialState.wholesalers,
    products: initialState.products
  })
}

export const dashboardReducer = (state = initialState, action) => {
  let reducer = dashboardReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
