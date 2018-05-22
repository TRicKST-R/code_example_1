import { ACTION } from '../../redux/actionTypes'

const initialState = {
  isConnectedToRedux: true
}

export const profileDetails = () => ({
  type: ACTION,
  payload: {}
})

const profileDetailsReducers = {
  [ACTION]: (state, payload) => ({
    ...state,
    ...payload
  })
}

export const profileDetailsReducer = (state = initialState, action) => {
  let reducer = profileDetailsReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
