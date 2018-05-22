import http from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import initializeDb from './db'
import config from './config'
import socket from './socket'

let app = express()
app.server = http.createServer(app)

if (__DEV__) {
  app.server = http.createServer(app)
} else {
  // https should be here
  app.server = http.createServer(app)
}

// logger
app.use(morgan('dev'))

app.use(
  cors({
    exposedHeaders: config.corsHeaders
  })
)

app.use(
  bodyParser.json({
    limit: config.bodyLimit
  })
)

console.log('completed!')

// connect to db
initializeDb(db => {
  // internal middleware
  app.get('/health', (req, res) => {
    res.send(true)
  })

  app.server.listen(config.port, '::', () => {
    socket(app.server, config.port, config.hostname, db)
    console.log(
      `Started ${__DEV__
        ? 'DEV'
        : 'PROD'} environment on port ${app.server.address().port}`,
      __DEV__ ? `\nconfig: ${JSON.stringify(config, null, 2)}` : ''
    )
  })
})

export default app
