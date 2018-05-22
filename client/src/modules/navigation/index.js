import { createSelector } from 'reselect'
import { replace } from 'react-router-redux'

const queryToString = query =>
  Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

export const updateQuery = changes => (dispatch, getState) => {
  const state = getState()
  const { pathname } = state.routing.location
  const query = { ...getQuery(state), ...changes }
  const location = pathname + '?' + queryToString(query)
  dispatch(replace(location))
}

export const getQuery = createSelector(
  state => state.routing.location.search,
  search => (search.length > 0 ? getObjOfURLParams(search) : search)
)

export const getObjOfURLParams = url => {
  /* initialize URL handler  */
  const searchParams = new URLSearchParams(url)
  /* create array from iterator, and after create object from url params */
  return Array.from(searchParams.keys()).reduce(
    (accumulator, filterHeaderKey) => ({
      ...accumulator,
      [filterHeaderKey]: searchParams.get(filterHeaderKey)
    }),
    {}
  )
}

export const setFilter = filter => dispatch => dispatch(updateQuery(filter))
