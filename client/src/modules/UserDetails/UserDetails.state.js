import { ACTION } from '../../redux/actionTypes'

const initialState = {
  isConnectedToRedux: true
}

export const userDetails = () => ({
  type: ACTION,
  payload: {}
})

const userDetailsReducers = {
  [ACTION]: (state, payload) => ({
    ...state,
    ...payload
  })
}

export const userDetailsReducer = (state = initialState, action) => {
  let reducer = userDetailsReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
