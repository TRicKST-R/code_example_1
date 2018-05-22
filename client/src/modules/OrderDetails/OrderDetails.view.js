import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'
import DataGrid from '../../components/DataGrid'
import qs from 'query-string'
import config from '../../config'
import moment from 'moment'

let ignoreColums = ['type', 'createdAt', 'updatedAt', 'wholesalerId']

const {
  roles: { brewery, wholesaler },
  statuses: { waiting, newStatus, accepted, shipped, confirmed }
} = config

const disableUpdate = {
  [brewery]: [accepted, newStatus, confirmed, shipped],
  [wholesaler]: [waiting, confirmed, shipped, accepted]
}

const styles = {
  toolbar: {
    justifyContent: 'space-between'
  },
  xScroll: {
    overflowX: 'scroll'
  }
}

class OrderDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      order: null,
      columns: [],
      controls: [],
      type: ''
    }
    this.id = ''
    this.setControls = this.setControls.bind(this)
  }

  componentWillMount () {
    let { id } = qs.parse(this.props.location.search)
    id = decodeURI(id)
    this.id = id
    this.props.getThisOrder(id)
  }

  componentWillReceiveProps (next) {
    const { order } = next.orderDetailsState
    if (order && order.length > 0) {
      const { status, type } = order[0]
      /* save id's - we need them to perform update  */
      const { role } = this.props.session
      this.updateControls(status, role, type)
      /* if editing is disabled for this role for orders with status */
      let editable = true
      if (
        type === 'order' &&
        role === wholesaler &&
        disableUpdate[role].indexOf(status) >= 0
      ) {
        editable = false
      }
      this.setState({
        order,
        columns: this.getColumns(order, editable)
      })
    }
  }

  getColumns (raw, editable = true) {
    let columns = []

    for (let key in raw[0]) {
      // temporary solution, find out which columns should actually be editable
      switch (key) {
        case 'count':
          columns.push({
            name: key,
            key,
            editable
          })
          break
        default:
          columns.push({
            name: key,
            key
          })
      }
    }

    return columns.filter(({ name }) => ignoreColums.indexOf(name) === -1)
  }

  updateControls (status, role, type) {
    let param = {}
    switch (status) {
      case 'new':
        if (role === wholesaler && type === 'order') {
          param = {
            details: {
              name: 'Send to brewery',
              message: 'Order sent to brewery'
            },
            updates: {
              status: 'waiting for accept',
              order_date: new Date()
            }
          }
        } else if (role === brewery && type === 'offer') {
          param = {
            details: {
              name: 'Send to wholesaler',
              message: 'Offer sent to wholesaler'
            },
            updates: {
              status: 'waiting for accept',
              order_date: new Date()
            }
          }
        }
        this.setControls({ ...param, type })
        break
      case 'waiting for accept':
        if (role === brewery && type === 'order') {
          param = {
            details: {
              name: 'Accept',
              message: 'Order accepted'
            },
            updates: {
              status: 'accepted',
              accept_date: new Date()
            }
          }
        } else if (role === wholesaler && type === 'offer') {
          param = {
            details: {
              name: 'Accept',
              message: 'Offer accepted'
            },
            updates: {
              status: 'accepted',
              accept_date: new Date()
            }
          }
        }
        this.setControls({ ...param, type })
        break
      case 'accepted':
        if (role === wholesaler && type === 'order') {
          param = {
            details: {
              name: 'Confirm',
              message: 'Order confirmed'
            },
            updates: {
              status: 'confirmed',
              confirm_date: new Date()
            }
          }
        } else if (role === brewery && type === 'offer') {
          param = {
            details: {
              name: 'Confirm',
              message: 'Offer confirmed'
            },
            updates: {
              status: 'confirmed',
              confirm_date: new Date()
            }
          }
        }
        this.setControls({ ...param, type })
        break
      case 'confirmed':
        if (role === brewery) {
          param = {
            details: {
              name: 'Confirm shipment',
              message: 'Shipment confirmed'
            },
            updates: {
              status: 'shipped',
              ship_date: new Date()
            }
          }
        }
        this.setControls({ ...param, type })
        break
      default:
        this.setControls({ type })
        break
    }
  }

  setControls ({ details = null, updates = null, type }) {
    let link = ''

    switch (type) {
      case 'order':
        link = 'orders'
        break
      case 'offer':
        link = 'allocations'
        break
      default:
        break
    }

    const controls = [
      {
        name: `Back to ${link}`,
        cb: () => {
          this.props.push(`/${link}`)
        }
      }
    ]

    if (details && updates) {
      const { name, message } = details

      controls.push({
        name,
        cb: () => {
          let { order } = { ...this.state }
          const { id } = order

          this.props.updateOrder({
            id,
            updated: {
              ...updates
            },
            message,
            pseudoId: this.id //eslint-disable-line
          })

          for (let key in updates) {
            if (updates[key] instanceof Date) {
              updates[key] = updates[key].toLocaleString()
            }
          }

          if (updates.status) {
            const { role } = this.props.session
            this.updateControls(updates.status, role)
          }
        }
      })
    }

    this.setState({
      controls
    })
  }

  updateOrder (payload) {
    const { updateOrder } = this.props
    payload.message = 'Order updated'
    payload.pseudoId = this.id
    updateOrder(payload)
  }

  render () {
    let { order, columns } = this.state
    if (order && order.length > 0) {
      order = order.map(
        ({
          order_date,
          accept_date,
          confirm_date,
          ship_date,
          ...orderDetails
        }) => {
          order_date = order_date ? moment(order_date).format('MMM Do') : '' // eslint-disable-line
          accept_date = accept_date ? moment(accept_date).format('MMM Do') : '' // eslint-disable-line
          confirm_date = confirm_date // eslint-disable-line
            ? moment(confirm_date).format('MMM Do') // eslint-disable-line
            : ''
          ship_date = ship_date ? moment(ship_date).format('MMM Do') : '' // eslint-disable-line
          return {
            ...orderDetails,
            order_date, // eslint-disable-line
            accept_date, // eslint-disable-line
            confirm_date, // eslint-disable-line
            ship_date // eslint-disable-line
          }
        }
      )
    }
    return (
      <Paper>
        <Toolbar className={this.props.classes.toolbar}>
          <Typography variant='title'>
            {this.props.orderDetailsState.header}
          </Typography>

          <div>
            {this.state.controls.map(btn => (
              <Button
                key={btn.name}
                color='primary'
                onClick={btn.cb.bind(this)}
              >
                {btn.name}
              </Button>
            ))}
          </div>
        </Toolbar>
        <DataGrid
          showContextMenu={false}
          contextMenuItems={[]}
          columns={columns}
          rows={order}
          canLoadMore={false}
          updateRow={this.updateOrder.bind(this)}
        />
      </Paper>
    )
  }
}

export default withStyles(styles)(OrderDetails)
