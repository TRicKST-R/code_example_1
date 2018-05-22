import { ACTION } from '../../redux/actionTypes'

const initialState = {
  isConnectedToRedux: true
}

export const splits = () => ({
  type: ACTION,
  payload: {}
})

const inventoryReducers = {
  [ACTION]: (state, payload) => ({
    ...state,
    ...payload
  })
}

export const inventoryReducer = (state = initialState, action) => {
  let reducer = inventoryReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
