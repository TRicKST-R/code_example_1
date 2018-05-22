import Generator from './generator'
import USA from './statesOfUSA'
import CreateDBModel from './createDBModel'
// import simulateInventory from './simulateInventory'

/** Helper function
 * Create a multiple instances of selected model on syncronous mode
 * @param {Int} count - number of added rows
 * @param {Sequelize.Model} model - Sequelize.Model of row
 * @param {Function} fillFunc - must return object for Model.Create
 * @param {Array} args - optional, if we need non-random parameters
 */
const fill = async (count, model, fillFunc, args = null) => {
  if (count === 0) return true
  await model.create(fillFunc(args))
  return fill(count - 1, model, fillFunc)
}

/** Main function
 * Create database and fill it with random data
 * @param {Sequelize} sequelize - Sequelize object with db connection
 * @param {Int} DB_SIZE - A multiplier for database rows count
 */

const fillDB = async (sequelize, DB_SIZE = 1, DAYS_COUNT = 1) => {
  let startTime = Date.now()
  // We can't fill with 0 or <1 data size
  if (DB_SIZE < 1) DB_SIZE = 1

  // Get models of db tables
  const DS = await CreateDBModel(sequelize)

  // Build/Rebuild DB Structure
  await sequelize.sync({ force: true })

  // States (50)
  for (const state of USA) {
    DS.State.create({
      state_name: state
    })
  }
  // Our default companies

  await DS.Company.create({
    company_name: 'Drunken Coders Inc.',
    role: 'BREWERY',
    stateId: 32
  })
  await DS.Company.create({
    company_name: '"Null pointer" pub',
    role: 'BREWERY',
    stateId: 22
  })
  await DS.Company.create({
    company_name: '"Teamlead Beer Sale" LLC',
    role: 'WHOLESALER',
    stateId: 22
  })

  // Companies (25 * SIZE)
  await fill(25 * DB_SIZE, DS.Company, () => ({
    company_name: Generator.genText(Generator.genInt(0, 1, 5), 3, 8),
    role: ['WHOLESALER', 'BREWERY'][Generator.genInt(0, 0, 1)],
    stateId: Generator.genInt(0, 1, USA.length - 1) // LOL
  }))

  // Get breweries from DB
  const breweries = Array.from(
    await DS.Company.findAll({
      where: {
        role: 'BREWERY'
      }
    }),
    item => item.dataValues
  )

  // Add products & DC for each brewery
  for (const brewery of breweries) {
    // Products (beer, etc...) (1-10 for each brewery)
    await fill(Generator.genInt(0, 1, 20), DS.Product, () => ({
      gpa: Generator.genText(1, 3, 10),
      brand: Generator.genText(Generator.genInt(0, 1, 3), 3, 10),
      package: ['DFT', 'PKG'][Generator.genInt(0, 0, 1)],
      size: Generator.genText(1, 2, 5),
      group: ['core', 'season', 'experimental'][Generator.genInt(1, 0, 2)],
      brew: Generator.genText(1, 5, 8),
      breweryId: brewery.id
    }))
  }
  for (const brewery of breweries) {
    // Distribution centers (1-20 for each brewery)
    await fill(Generator.genInt(0, 1, 20), DS.DistributionCenter, () => ({
      dc_name: Generator.genText(1) + Generator.genInt(3),
      stateId: Generator.genInt(0, 1, USA.length - 1),
      brewery: brewery.id
    }))
  }
  // Get wholesalers from database
  const wholesalers = Array.from(
    await DS.Company.findAll({
      where: {
        role: 'WHOLESALER'
      }
    }),
    item => item.dataValues
  )

  // Get distribution centers from database
  const dcs = Array.from(
    await DS.DistributionCenter.findAll(),
    item => item.dataValues
  )

  // Distribution network (3-15 avaliable distribution centers for each wholesaler)
  for (const whs of wholesalers) {
    for (let i = 0; i < Generator.genInt(0, 3, 15); i += 1) {
      await sequelize.query(
        'INSERT INTO distribution_network ("companyId", "distributionCenterId") VALUES (?, ?) ON CONFLICT DO NOTHING',
        {
          replacements: [
            whs.id,
            dcs[Generator.genInt(0, 0, dcs.length - 1)].id
          ],
          returning: true,
          type: sequelize.QueryTypes.UPSERT
        }
      )
    }
  }

  // Get all companies (breweries and wholesalers)
  const companies = Array.from(
    await DS.Company.findAll(),
    item => item.dataValues
  )

  // Users (1-5 for each company)
  for (const company of companies) {
    await fill(Generator.genInt(0, 1, 5), DS.User, () => ({
      user_name: Generator.genText(2, 3, 12),
      companyId: company.id
    }))
  }

  // Index of avaliable products
  const index = await sequelize.query(
    'SELECT distribution_network."companyId" AS whs_id, companies.id AS brw_id, distribution_centers.id AS dc_id, products.id as product_id FROM companies, distribution_centers, distribution_network, products WHERE companies.id = distribution_centers.brewery AND distribution_network."distributionCenterId" = distribution_centers.id AND companies.id = products."breweryId" ORDER BY distribution_network,"companyId"',
    {
      returning: true,
      type: sequelize.QueryTypes.SELECT
    }
  )

  // Helper function - for clean code
  const getProductsByBreweryID = async id => {
    const answer = await sequelize.query(
      'SELECT products.id FROM products WHERE products."breweryId" = ?',
      {
        replacements: [id],
        returning: true,
        type: sequelize.QueryTypes.SELECT
      }
    )
    return answer
  }

  // Helper function - for clean code
  const getDistCentersByBreweryID = async id => {
    const answer = await sequelize.query(
      'SELECT distribution_centers.id FROM distribution_centers WHERE distribution_centers.brewery = ?',
      {
        replacements: [id],
        returning: true,
        type: sequelize.QueryTypes.SELECT
      }
    )
    return answer
  }

  const getRandomDate = (base, direction = -1) => {
    return new Date(
      +base +
        direction *
          (60000 *
            Generator.genInt(0, 0, 60) *
            Generator.genInt(0, 12, 24) *
            Generator.genInt(1)) +
        direction
    )
  }

  // Orders & Transfers (one day forward from tomorrow)
  let date = new Date()
  for (let i = 0; i < DAYS_COUNT; i += 1) {
    date.setDate(date.getDate() + 1) // Next day

    // We try to create orders for all products in a database
    for (const row of index) {
      //eslint-disable-line
      const count = Generator.genInt(0, 0, 50)
      if (count > 0) {
        const T1 = getRandomDate(Date.now())
        const T2 = getRandomDate(T1)
        const T3 = getRandomDate(T2)
        const T4 = getRandomDate(T3)

        let dates = [T4, T3, T2, T1]

        const current = Generator.genInt(0, 0, 4)

        for (let i = 1; i < current; i++) {
          dates[dates.length - i] = null
        }
        /*
        await DS.Order.create({
          count,
          type: [
            'order',
            'order',
            'order',
            'order',
            'order',
            'order',
            'order',
            'offer'
          ][Generator.genInt(0, 0, 7)],
          status: statuses[statuses.length - current - (current === 0 ? 1 : 0)],
          order_date: dates[0],
          accept_date: dates[1],
          confirm_date: dates[2],
          ship_date: dates[3],
          wholesalerId: row.whs_id,
          productId: row.product_id
        }) */
      }
    }
    // We try to create ONE transfer for each brewery
    // between two distribution centers of this brewery
    for (const brw of breweries) {
      const products = await getProductsByBreweryID(brw.id)
      const dc = await getDistCentersByBreweryID(brw.id)
      const senderId = dc[Generator.genInt(0, 0, dc.length - 1)].id
      const receiverId = dc[Generator.genInt(0, 0, dc.length - 1)].id
      if (senderId !== receiverId) {
        const pid = products[Generator.genInt(0, 0, products.length - 1)].id
        await DS.Transfer.create({
          count: Generator.genInt(3),
          date,
          senderId,
          receiverId,
          productId: pid
        })
      }
    }
  }

  // Inventory (fill up for one day (today) with random net value for each distribution center)
  /* let result = await sequelize.query(
    'SELECT order_date FROM orders ORDER BY orders.order_date ASC LIMIT 1',
    {}
  )

  date = new Date(result[0][0].order_date) */

  date.setDate(date.getDate() - 1)
  /* for (const dc of dcs) {
    const products = await getProductsByBreweryID(dc.brewery)
    for (const product of products) {
      await DS.Inventory.create({
        date,
        net: Generator.genInt(2),
        add: 0,
        sales: 0,
        companyId: dc.brewery,
        productId: product.id,
        distributionCenterId: dc.id
      })
    }
  } */

  await fill(150, DS.Guideline, () => ({
    title: Generator.genText(Generator.genInt(0, 1, 3)),
    content: Generator.genText(Generator.genInt(2)),
    tags: '#development #blablabla'
  }))

  // await simulateInventory(sequelize, DS)

  const finishTime = Date.now()
  console.log(
    `Database filled in ${((finishTime - startTime) / 1000).toFixed(
      3
    )} seconds (${((finishTime - startTime) / 60000).toFixed(1)} min)`
  )

  return DS
}

export default fillDB
