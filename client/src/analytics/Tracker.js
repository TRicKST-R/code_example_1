import ReactGA from 'react-ga'
import config from '../config'
import omit from 'lodash/omit'

/* Events that have private information and will not be tracked */
const blockedEvents = ['socket/SIGN_IN']

/* Events pairs to track load time */
const ref = {
  'socket/SIGN_IN': 'SESSION_STATE'
}

let startTime = {}

console.log('GA init')
ReactGA.initialize(config.TRACKING_ID)

const getCurrentPathname = routing => {
  const { location } = routing
  if (!location) {
    return null
  }
  return location.pathname
}

export const screenTracking = ({ getState }) => dispatch => action => {
  const currentScreen = getCurrentPathname(getState().routing)
  /* Tracking event if it's not blocked */
  if (blockedEvents.indexOf(action.type) === -1) {
    ReactGA.event({
      category: currentScreen,
      action: action.type,
      label: JSON.stringify(action.payload)
    })
  }
  const result = dispatch(action)
  const nextScreen = getCurrentPathname(getState().routing)
  /* Tracking screen if screen changed */
  if (nextScreen !== currentScreen) {
    ReactGA.set({ page: nextScreen })
    ReactGA.pageview(nextScreen)
  }
  return result
}

export const timeTracking = ({ getState }) => dispatch => action => {
  const { type } = action
  /* Assigning start time for action with key of corresponding end event */
  if (ref[type]) {
    startTime[ref[type]] = new Date().getTime()
  }
  /* Calculating duration of event */
  if (startTime[type]) {
    const time = new Date().getTime() - startTime[type]
    startTime = omit(startTime, [type])
    ReactGA.timing({
      category: 'User time tracking',
      variable: 'load',
      value: time, // in milliseconds
      label: type
    })
  }
  return dispatch(action)
}
