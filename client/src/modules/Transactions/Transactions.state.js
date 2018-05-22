import { ACTION } from '../../redux/actionTypes'

const initialState = {
  isConnectedToRedux: true
}

export const transactions = () => ({
  type: ACTION,
  payload: {}
})

const transactionsReducers = {
  [ACTION]: (state, payload) => ({
    ...state,
    ...payload
  })
}

export const transactionsReducer = (state = initialState, action) => {
  let reducer = transactionsReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
