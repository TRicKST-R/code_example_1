import config from '../config'
import moment from 'moment-timezone'
const tz = 'America/New_York'

const now = () =>
  moment()
    .tz(tz)
    .format('MM/DD, hh:mm:ss a')

export default {
  info: text => {
    console.log(`${now()} | INFO: `, text)
  },
  debug: text => {
    if (config.logLevel === 'DEBUG') {
      console.log(`${now()} | DEBUG: `, text)
    }
  },
  err: text => {
    console.log(`${now()} | ERR: `, text)
  }
}
