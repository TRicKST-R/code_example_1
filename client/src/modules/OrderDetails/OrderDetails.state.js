import {
  UPDATE_ORDER,
  GET_THIS_ORDER,
  SHOW_ORDER,
  ORDER_SET_NAME
} from '../../redux/actionTypes'

const initialState = {
  header: ''
}

export const updateOrder = payload => ({
  type: UPDATE_ORDER,
  payload
})

export const getThisOrder = payload => ({
  type: GET_THIS_ORDER,
  payload
})

const orderDetailsReducers = {
  [SHOW_ORDER]: (state, order) => ({
    ...state,
    order
  }),
  [ORDER_SET_NAME]: (state, header) => ({
    ...state,
    header
  })
}

export const orderDetailsReducer = (state = initialState, action) => {
  let reducer = orderDetailsReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
