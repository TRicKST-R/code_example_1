import { SNACK } from './actionTypes'

const initialState = {
  message: ''
}

export const showSnack = message => ({
  type: SNACK,
  payload: {
    message
  }
})

const snackReducers = {
  SNACK: (state, payload) => {
    let snack = payload || {}
    return {
      ...state,
      ...snack
    }
  }
}

export const snackRootReducer = (state = initialState, action) => {
  let reducer = snackReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
