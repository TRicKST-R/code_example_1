import StackTrace from 'stacktrace-js'
import { StackdriverErrorReporter } from 'stackdriver-errors-js'
import config from '../../config'

window.StackTrace = StackTrace
let errorHandler = new StackdriverErrorReporter()
errorHandler.start({
  key: config.STACKDRIVER_API_KEY,
  projectId: config.projectId
})

export default errorHandler
