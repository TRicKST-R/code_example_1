import {
  LOAD_MORE_GUIDES,
  GET_GUIDES,
  RESET_GUIDES
} from '../../redux/actionTypes'

const initialState = {
  guidelines: [],
  hasMore: true
}

export const reset = () => ({
  type: RESET_GUIDES
})

export const loadGuides = ({ offset = 0, searchQuery = '' }) => ({
  type: LOAD_MORE_GUIDES,
  payload: {
    offset,
    searchQuery
  }
})

const loadGuidesReducers = {
  [GET_GUIDES]: (state, { guidelines, hasMore }) => ({
    ...state,
    hasMore,
    guidelines: state.guidelines.concat(guidelines)
  }),
  [RESET_GUIDES]: state => ({
    ...state,
    guidelines: [],
    hasMore: true
  })
}

export const loadGuidesRootReducer = (state = initialState, action) => {
  let reducer = loadGuidesReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
