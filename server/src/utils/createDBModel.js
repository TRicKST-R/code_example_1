const Sequelize = require('sequelize')

// helper object for short and clean code
const t = {
  INT: () => ({
    type: Sequelize.INTEGER
  }),
  STR: () => ({
    type: Sequelize.STRING(256)
  }),
  JSONB: () => ({
    type: Sequelize.JSONB
  }),
  DATE: () => ({
    type: Sequelize.DATEONLY
  }),
  NOSTAMP: {
    timestamps: false
  }
}

const createDBModel = sequelize => {
  // Database Scheme object
  const DS = {
    sequelize,
    User: sequelize.define('user', {
      user_name: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: "User's name must be not empty!"
          },
          len: {
            args: [0, 255],
            msg: "User's name is too long!"
          }
        }
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: {
            msg: "User's email must be a correct email-address!"
          }
        }
      },
      password: {
        type: Sequelize.STRING
      },
      companyId: {
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: {
            msg: "User's without a company are deprecated!"
          },
          isInt: {
            msg: 'Only integer values allowed'
          }
        }
      }
    }),

    Company: sequelize.define(
      'company',
      {
        company_name: {
          type: Sequelize.STRING,
          validate: {
            notEmpty: {
              msg: "Company name can't be empty"
            },
            len: {
              args: [0, 255],
              msg: 'Company name is too long'
            }
          }
        },
        role: {
          type: Sequelize.ENUM('WHOLESALER', 'BREWERY')
        }
      },
      t.NOSTAMP
    ),

    State: sequelize.define(
      'state',
      {
        state_name: t.STR()
      },
      t.NOSTAMP
    ),

    SearchPreset: sequelize.define('search_preset', {
      scene: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: 'Empty scene name not allowed!'
          },
          len: {
            args: [0, 255],
            msg: 'Scene name is too long'
          }
        },
        unique: 'preset_unique'
      },
      name: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: 'Empty preset name not allowed!'
          },
          len: {
            args: [0, 255],
            msg: 'Preset name is too long'
          }
        },
        unique: 'preset_unique'
      },
      ownerId: {
        type: Sequelize.INTEGER,
        unique: 'preset_unique'
      },
      preset: {
        type: Sequelize.JSONB,
        validate: {
          presetValidation (preset) {
            const check = p => {
              // TODO: Add here validation for preset object
              return false
            }
            if (check(preset)) throw new Error('Invalid preset JSON object')
          }
        }
      }
    }),

    Velocity: sequelize.define('velocity', {
      week: t.DATE(),
      quantity: t.INT()
    }),

    Product: sequelize.define(
      'product',
      {
        gpa: t.STR(),
        brand: t.STR(),
        package: {
          type: Sequelize.ENUM('DFT', 'PKG')
        },
        size: t.STR(),
        group: {
          type: Sequelize.ENUM('core', 'season', 'experimental')
        },
        brew: t.STR()
      },
      t.NOSTAMP
    ),

    Order: sequelize.define('order', {
      count: t.INT(),
      type: {
        type: Sequelize.ENUM('order', 'offer')
      },
      status: {
        type: Sequelize.ENUM(
          'new',
          'waiting for accept',
          'accepted',
          'confirmed',
          'shipped'
        )
      },
      order_date: t.DATE(),
      accept_date: t.DATE(),
      confirm_date: t.DATE(),
      ship_date: t.DATE(),
      pseudoId: t.STR()
    }),

    DistributionCenter: sequelize.define(
      'distribution_center',
      {
        dc_name: t.STR(),
        brewery: t.INT(),
        main: {
          type: Sequelize.BOOLEAN
        }
      },
      t.NOSTAMP
    ),

    Inventory: sequelize.define(
      'inventory',
      {
        date: t.DATE(),
        net: t.INT(),
        add: t.INT(),
        ship: t.INT(),
        sales: {
          type: Sequelize.INTEGER,
          validate: {
            isLessThanNull (value) {
              if (value < 0) throw new Error('Sales cannot be less than 0!!!')
            }
          }
        }
      },
      t.NOSTAMP
    ),

    Transfer: sequelize.define('transfer', {
      count: {
        type: Sequelize.INTEGER,
        validate: {
          isLessThanNull (value) {
            if (value < 0) {
              throw new Error('Transfer count cannot be less than 0!!!')
            }
          }
        }
      },
      date: t.DATE()
    }),

    Guideline: sequelize.define('guideline', {
      title: t.STR(),
      content: {
        type: Sequelize.TEXT,
        validate: {
          notEmpty: true
        }
      },
      tags: t.STR()
    })
  }

  // Relations
  DS.User.belongsTo(DS.Company)

  DS.Transfer.belongsTo(DS.DistributionCenter, { as: 'sender' })
  DS.Transfer.belongsTo(DS.DistributionCenter, { as: 'receiver' })
  DS.Transfer.belongsTo(DS.Product)

  DS.Company.belongsToMany(DS.DistributionCenter, {
    through: 'distribution_network',
    as: 'distribution_center',
    timestamps: false
  })

  DS.DistributionCenter.belongsTo(DS.State)

  DS.Product.belongsTo(DS.Company, { as: 'brewery' })

  DS.Company.belongsTo(DS.State)

  DS.Order.belongsTo(DS.Company, { as: 'wholesaler' })
  DS.Order.belongsTo(DS.Product)

  DS.Velocity.belongsTo(DS.Product)
  DS.Velocity.belongsTo(DS.Company, { as: 'wholesaler' })

  DS.Inventory.belongsTo(DS.Company)
  DS.Inventory.belongsTo(DS.Product)
  DS.Inventory.belongsTo(DS.DistributionCenter)

  DS.SearchPreset.belongsTo(DS.User, { as: 'owner' })
  return DS
}

export default createDBModel
