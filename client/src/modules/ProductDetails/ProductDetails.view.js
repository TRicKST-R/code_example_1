import React, { Component } from 'react'
import qs from 'query-string'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table'
import Paper from 'material-ui/Paper'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import { withStyles } from 'material-ui/styles'

const styles = {
  flex: {
    flex: 1
  },
  highlighted: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
  },
  xScroll: {
    overflowX: 'auto'
  }
}

class ProductDetails extends Component {
  constructor (props) {
    super(props)

    this.supplyLabels = {
      start: 'Start',
      add: 'Add',
      sales: 'Sales',
      net: 'Net'
    }

    this.state = {
      breweryId: null,
      brew: null,
      product: null,
      selected: {
        row: null,
        column: null
      },
      productRows: [],
      currentSupply: {
        labels: this.supplyLabels
      }
    }
  }

  componentWillMount () {
    const { search } = this.props.location
    const { brew, id, breweryId } = qs.parse(search)

    const filters = [
      {
        column: 'brew',
        searchKey: brew
      },
      {
        column: 'breweryId',
        searchKey: breweryId
      }
    ]

    this.setState({
      brew,
      id: parseInt(id),
      breweryId
    })

    this.props.getThisProduct({
      filters,
      breweryId
    })

    this.props.getOrdersForProduct(id)
  }

  componentWillReceiveProps (nextProps) {
    const { products = [], inventory = [] } = nextProps.productDetailsState
    const { id, selected, brew } = this.state

    if (
      products &&
      products.length > 0 &&
      inventory &&
      inventory.length > 0 &&
      !selected.row
    ) {
      const selectedRow = products.find(row => parseInt(row.id) === id)
      let { size = 0 } = selectedRow
      const row = id
      console.log('selectedRow CWRP: ', selectedRow)
      const title = `${brew} ${size}`

      const column = inventory[0].date

      const productRows = products.map(product => {
        const productInventory = inventory
          // find all inventory instances related to the current product
          .filter(item => item.productId === product.id)
          // turn them into an object for easy further reference
          .reduce((inventory, item) => {
            const { add, sales, net, date } = item
            inventory[date] = {
              add,
              sales,
              net
            }
            return inventory
          }, {})
        return {
          ...product,
          productInventory
        }
      })

      const currentSupply = productRows.find(item => item.id === id)
        .productInventory

      currentSupply.labels = this.supplyLabels

      this.setState({
        selected: {
          row,
          title,
          column
        },
        currentSupply,
        productRows
      })
    }
  }

  handleClick (e, row, column) {
    const { products } = this.props.productDetailsState
    const { brew } = this.state
    const selectedRow = products.find(product => product.id === row)
    let { size = 0 } = selectedRow
    const title = `${brew} ${size}`
    this.props.getOrdersForProduct(row)
    this.setCurrentSupply(row, column)

    this.setState({
      selected: {
        row,
        column,
        title
      }
    })
  }

  setCurrentSupply (id, date) {
    // const { inventory } = this.props.productDetailsState
    const currentSupply = [...this.state.productRows].find(
      item => item.id === id
    ).productInventory

    currentSupply.labels = this.supplyLabels

    this.setState({
      currentSupply
    })
  }

  isRowSelected (row) {
    return row === this.state.selected.row
  }

  isColumnSelected (column) {
    return column === this.state.selected.column
  }

  getColumns (columns) {
    const { classes } = this.props

    return columns.map(column => {
      const isColumnSelected = this.isColumnSelected(column.key)
      const className = isColumnSelected ? classes.highlighted : null
      return (
        <TableCell key={column.key} className={className}>
          {column.name}
        </TableCell>
      )
    })
  }

  render () {
    const {
      productDescription,
      inventory,
      products,
      orderColumns,
      orders
    } = this.props.productDetailsState

    const { classes } = this.props

    const inventoryColumns = inventory
      ? [...inventory]
          .sort((a, b) => {
            if (a.date < b.date) {
              return -1
            } else {
              return 1
            }
          })
          .reduce(
            (columns, item) => {
              // get only unique dates for columns
              if (!columns.find(column => column.key === item.date)) {
                columns.push({
                  name: item.date,
                  key: item.date,
                  inventory: true
                })
              }
              return columns
            },
        [
          {
            name: ' ',
            key: 'labels'
          }
        ]
          )
      : []

    const productColumns = productDescription.concat(inventoryColumns)

    let productRows = products.map(product => {
      const productInventory = inventory
        ? inventory
            // find all inventory instances related to the current product
            .filter(item => item.productId === product.id)
            // turn them into an object for easy further reference
            .reduce((inventory, item) => {
              const { add, sales, net, date } = item
              inventory[date] = {
                add,
                sales,
                net
              }
              return inventory
            }, {})
        : []
      return {
        ...product,
        productInventory
      }
    })

    const { totalAdd, totalNet } = inventory
      ? inventory.reduce(
          (totals, item) => {
            totals.totalAdd[item.date] = totals.totalAdd[item.date]
              ? totals.totalAdd[item.date] + item.add
              : item.add
            totals.totalNet[item.date] = totals.totalNet[item.date]
              ? totals.totalNet[item.date] + item.net
              : item.net
            return totals
          },
        {
          totalAdd: {},
          totalNet: {}
        }
        )
      : {
        totalAdd: {},
        totalNet: {}
      }

    const totalRows = [
      {
        id: 'totaladd',
        labels: 'Total add:',
        totals: totalAdd,
        totalRow: true
      },
      {
        id: 'totalnet',
        labels: 'Total net:',
        totals: totalNet,
        totalRow: true
      }
    ]

    if (inventory) {
      totalRows.forEach(row => productRows.push(row))
    }

    return (
      <Grid container>
        <Grid item xs={12}>
          <Paper>
            <Toolbar>
              <Typography variant='title' className={classes.flex}>
                Products
              </Typography>
            </Toolbar>
            <div className={classes.xScroll}>
              <Table>
                <TableHead>
                  <TableRow>
                    {this.getColumns.bind(this)(productColumns)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productRows.map(item => {
                    const isRowSelected = this.isRowSelected(item.id)
                    const isTotalRow = item.totalRow

                    return (
                      <TableRow
                        hover={!isTotalRow}
                        selected={isRowSelected}
                        key={item.id}
                      >
                        {productColumns.map(column => {
                          const className = this.isColumnSelected(column.key)
                            ? classes.highlighted
                            : null

                          if (column.inventory) {
                            if (item.productInventory) {
                              const cellContent = item.productInventory[
                                column.key
                              ]
                                ? item.productInventory[column.key].add
                                : 'N/A'
                              return (
                                <TableCell
                                  key={column.key}
                                  className={className}
                                  onClick={e =>
                                    this.handleClick(e, item.id, column.key)}
                                >
                                  {cellContent}
                                </TableCell>
                              )
                            } else if (isTotalRow) {
                              const cellContent =
                                typeof item.totals[column.key] === 'number'
                                  ? item.totals[column.key]
                                  : 'N/A'
                              return (
                                <TableCell
                                  className={className}
                                  key={column.key}
                                >
                                  {cellContent}
                                </TableCell>
                              )
                            }
                          } else {
                            return (
                              <TableCell
                                key={column.key}
                                // className={className}
                                // onClick={e => this.handleClick(e, item.id, column.key)}
                              >
                                {item[column.key]}
                              </TableCell>
                            )
                          }
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </Paper>
        </Grid>

        {inventory && (
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} sm={7}>
                <Paper>
                  <Toolbar>
                    <Typography variant='title' className={classes.flex}>
                      Orders: {this.state.selected.title} [time]
                    </Typography>
                  </Toolbar>
                  <div className={classes.xScroll}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {orderColumns.map(column => {
                            return (
                              <TableCell key={column.key}>
                                {column.name}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders
                          .filter(item => {
                            const orderDateString = item.order_date
                            const selectedDateString = this.state.selected
                              .column

                            // unsound comparison, consider revision
                            if (
                              !selectedDateString ||
                              orderDateString <= selectedDateString
                            ) {
                              return item
                            }
                          })
                          .map(item => {
                            // const isRowSelected = this.isRowSelected(item.id)
                            return (
                              <TableRow
                                // hover
                                // selected={isRowSelected}
                                key={item.id}
                              >
                                {orderColumns.map(column => {
                                  // const isColumnSelected = this.isColumnSelected(column.key)
                                  // const className = isColumnSelected ? classes.highlighted : null
                                  return (
                                    <TableCell
                                      key={column.key}
                                      // className={className}
                                      onClick={e =>
                                        this.handleClick(
                                          e,
                                          item.id,
                                          column.key
                                        )}
                                    >
                                      {item[column.key]}
                                    </TableCell>
                                  )
                                })}
                              </TableRow>
                            )
                          })}
                      </TableBody>
                    </Table>
                  </div>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={5}>
                <Paper>
                  <Toolbar>
                    <Typography variant='title' className={classes.flex}>
                      {this.state.selected.title} supply
                    </Typography>
                  </Toolbar>
                  <div className={classes.xScroll}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {this.getColumns.bind(this)(inventoryColumns)}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          {this.state.currentSupply &&
                            inventoryColumns.map((column, index) => {
                              const className = this.isColumnSelected(
                                column.key
                              )
                                ? classes.highlighted
                                : null

                              if (this.state.currentSupply[column.key]) {
                                return (
                                  <TableCell key={index} className={className}>
                                    {this.state.currentSupply[column.key].start}
                                  </TableCell>
                                )
                              } else {
                                return (
                                  <TableCell
                                    key={index}
                                    className={className}
                                  />
                                )
                              }
                            })}
                        </TableRow>
                        <TableRow>
                          {this.state.currentSupply &&
                            inventoryColumns.map((column, index) => {
                              const className = this.isColumnSelected(
                                column.key
                              )
                                ? classes.highlighted
                                : null

                              if (this.state.currentSupply[column.key]) {
                                return (
                                  <TableCell key={index} className={className}>
                                    {this.state.currentSupply[column.key].add}
                                  </TableCell>
                                )
                              } else {
                                return (
                                  <TableCell
                                    key={index}
                                    className={className}
                                  />
                                )
                              }
                            })}
                        </TableRow>
                        <TableRow>
                          {this.state.currentSupply &&
                            inventoryColumns.map((column, index) => {
                              const className = this.isColumnSelected(
                                column.key
                              )
                                ? classes.highlighted
                                : null
                              if (this.state.currentSupply[column.key]) {
                                return (
                                  <TableCell key={index} className={className}>
                                    {this.state.currentSupply[column.key].sales}
                                  </TableCell>
                                )
                              } else {
                                return (
                                  <TableCell
                                    key={index}
                                    className={className}
                                  />
                                )
                              }
                            })}
                        </TableRow>
                        <TableRow>
                          {this.state.currentSupply &&
                            inventoryColumns.map((column, index) => {
                              const className = this.isColumnSelected(
                                column.key
                              )
                                ? classes.highlighted
                                : null

                              if (this.state.currentSupply[column.key]) {
                                return (
                                  <TableCell key={index} className={className}>
                                    {this.state.currentSupply[column.key].net}
                                  </TableCell>
                                )
                              } else {
                                return (
                                  <TableCell
                                    key={index}
                                    className={className}
                                  />
                                )
                              }
                            })}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    )
  }

  componentWillUnmount () {
    const { resetProductDetails } = this.props
    resetProductDetails()
  }
}

export default withStyles(styles)(ProductDetails)
