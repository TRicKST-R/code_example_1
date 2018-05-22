import forOwn from 'lodash/forOwn'
import dotenv from 'dotenv'
dotenv.config()

global.__DEV__ = process.env.__DEV__

/* list all used variables here, overwrite in .env */
let config = {
  jwtSecret: 'simply_secret',
  tokenExpiration: '1 year',
  tokenRenewDelay: 2,
  bcryptSaltRounds: 10,
  bodyLimit: '100kb',
  corsHeaders: ['Link'],
  logLevel: 'DEBUG',
  hostname: 'localhost',
  port: __DEV__ ? 8080 : 80, // 443
  userPassword: 'password',
  POSTGRES_USER: 'app_user',
  POSTGRES_PASSWORD: 'Qq12345',
  POSTGRES_DB: 'gp-analytics',
  DB_SIZE: 1, // Size of random generating database
  DB_DAYS: 5, // Days of work simulation
  DB_HOST: '***',
  uploadFolder: 'files',
  gcsBucket: __DEV__ ? 'gp-mrp-test' : 'gp-mrp-test',
  roles: {
    brewery: 'BREWERY',
    wholesaler: 'WHOLESALER'
  },
  statuses: {
    waiting: 'waiting for accept',
    newStatus: 'new',
    accepted: 'accepted',
    shipped: 'shipped',
    confirmed: 'confirmed'
  }
}

process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './key.json'

forOwn(config, (val, key) => {
  config[key] = process.env[key] || config[key]
})

export default config
