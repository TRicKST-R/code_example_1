import { GET_FILES_LIST, FILES_LIST } from '../../redux/actionTypes'

const initialState = {
  isConnectedToRedux: true
}

export const getFiles = () => ({
  type: GET_FILES_LIST,
  payload: {}
})

const filesReducers = {
  [FILES_LIST]: (state, payload) => ({
    ...state,
    files: payload
  })
}

export const filesReducer = (state = initialState, action) => {
  let reducer = filesReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
