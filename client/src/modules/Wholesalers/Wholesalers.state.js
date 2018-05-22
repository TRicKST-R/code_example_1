import { WHOLESALERS_LOAD, WHOLESALERS_SHOW } from '../../redux/actionTypes'

const initialState = {
  wholesalers: [],
  hasMore: true
}

export const loadWholesalers = ({
  brwId = null,
  offset = 0,
  orderBy = 'company_id',
  direction = 'ASC'
}) => ({
  type: WHOLESALERS_LOAD,
  payload: {
    brwId,
    offset,
    orderBy,
    direction
  }
})

export const showMoreWholesalers = payload => ({
  type: WHOLESALERS_SHOW,
  payload
})

const wholesalersReducers = {
  [WHOLESALERS_SHOW]: (state, payload) => ({
    ...state,
    wholesalers: state.wholesalers.concat(payload.wholesalers),
    hasMore: payload.hasMore
  })
}

export const wholesalersReducer = (state = initialState, action) => {
  let reducer = wholesalersReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
