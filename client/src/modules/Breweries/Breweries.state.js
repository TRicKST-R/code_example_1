import {
  BREWERIES_LOAD,
  BREWERIES_SHOW,
  BREWERIES_RESET
} from '../../redux/actionTypes'

const initialState = {
  breweries: [],
  hasMore: true
}

export const loadBreweries = ({
  whsId = null,
  offset = 0,
  orderBy = 'id',
  direction = 'ASC'
}) => ({
  type: BREWERIES_LOAD,
  payload: {
    whsId,
    offset,
    orderBy,
    direction
  }
})

export const resetBreweries = () => ({
  type: BREWERIES_RESET
})

export const showMoreBreweries = payload => ({
  type: BREWERIES_SHOW,
  payload
})

const breweriesReducers = {
  [BREWERIES_SHOW]: (state, payload) => ({
    ...state,
    breweries: state.breweries.concat(payload.breweries),
    hasMore: payload.canLoadMore
  }),
  [BREWERIES_RESET]: () => initialState
}

export const breweriesReducer = (state = initialState, action) => {
  let reducer = breweriesReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
