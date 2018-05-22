import { TRANSFERS_LOAD, TRANSFERS_SHOW } from '../../redux/actionTypes'

const initialState = {
  transfers: [],
  hasMore: true
}

export const loadTransfers = ({ brwId = null, offset = 0 }) => ({
  type: TRANSFERS_LOAD,
  payload: {
    brwId,
    offset
  }
})

export const showMoreTransfers = payload => ({
  type: TRANSFERS_SHOW,
  payload
})

const transfersReducers = {
  [TRANSFERS_SHOW]: (state, payload) => ({
    ...state,
    transfers: state.transfers.concat(payload.transfers),
    hasMore: payload.canLoadMore
  })
}

export const transfersReducer = (state = initialState, action) => {
  let reducer = transfersReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
