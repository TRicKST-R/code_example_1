import { SIGN_IN } from '../../redux/actionTypes'

const initialState = {}

export const signIn = ({ email, password, full }) => ({
  type: SIGN_IN,
  payload: { email, password, full }
})

const signInReducers = {
  [SIGN_IN]: (state, payload) => ({
    ...state,
    ...payload
  })
}

export const signInRootReducer = (state = initialState, action) => {
  let reducer = signInReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
