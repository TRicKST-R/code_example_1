import { ACTION } from '../../redux/actionTypes'

const initialState = {
  isConnectedToRedux: true
}

export const usersList = () => ({
  type: ACTION,
  payload: {}
})

const usersListReducers = {
  [ACTION]: (state, payload) => ({
    ...state,
    ...payload
  })
}

export const usersListReducer = (state = initialState, action) => {
  let reducer = usersListReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
