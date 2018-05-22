import config from './config'
import Sequelize from 'sequelize'
import { generatePass } from './utils/generateDefaultPass'
import log from './utils/log'
import fillDB from './utils/fillDB'
import createDBModel from './utils/createDBModel'

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  DB_SIZE,
  DB_HOST,
  DB_DAYS
} = config

const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
})

const DB_RECONNECT_INTERVAL = 3000
var DB_RECONNECT_TRY = 0

export const getConnection = () => sequelize

const connect = async callback => {
  try {
    await sequelize.authenticate()
    log.debug('connected!')

    // Get database model object
    const DB = await createDBModel(sequelize)
    // Sync to DB
    await sequelize.sync()
    // Check DB state
    const usersCount = await sequelize.query('SELECT COUNT(id) FROM users', {
      type: Sequelize.QueryTypes.SELECT
    })
    // If new base
    if (usersCount[0].count < 1) {
      // change to > 1 to refill every restart
      callback(await fillDB(sequelize, DB_SIZE, DB_DAYS)) // eslint-disable-line

      // Additional test users
      const testUsers = ['brewery', 'wh']
      for (const name of testUsers) {
        await DB.User.create({
          user_name: name,
          email: `${name}@test.com`,
          password: await generatePass(),
          permissions: {
            role: name
          },
          companyId: testUsers.indexOf(name) + 2
        })
      }
    } else {
      callback(DB)
    }
  } catch (err) {
    log.err(
      `Unable to connect to the database. Try to reconnect after ${DB_RECONNECT_INTERVAL} ms`
    )
    if (DB_RECONNECT_TRY > 10) log.err(err)
    setTimeout(async () => {
      log.info(`Try to connect to the database again. #${++DB_RECONNECT_TRY}.`)
      await connect(callback)
    }, DB_RECONNECT_INTERVAL)
  }
}

export default connect
