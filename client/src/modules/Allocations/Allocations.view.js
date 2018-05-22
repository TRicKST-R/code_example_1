import React, { Component } from 'react'
import Grid from 'material-ui/Grid'
import DataGrid from '../../components/DataGrid'
import ViewSettings from '../../components/ViewSettings'
import Presets from '../../components/Presets'
import _ from 'lodash'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'

const filterShape = {
  column: '',
  searchKey: ''
}

const styles = {
  tableTitle: {
    flex: 1
  }
}

class AllocationsList extends Component {
  /* LIFECYCLE METHODS */

  constructor (props) {
    super(props)
    this.state = {
      preset: {
        name: '',
        columns: [],
        orderBy: 'id',
        filters: []
      }
    }
    this.handleChange = this.handleChange.bind(this)
    this.addFilter = this.addFilter.bind(this)
    this.savePreset = this.savePreset.bind(this)
    this.removeFilter = this.removeFilter.bind(this)
    this.applyFilter = this.applyFilter.bind(this)
    this.removePreset = this.removePreset.bind(this)
    this.clearPreset = this.clearPreset.bind(this)
    this.choosePreset = this.choosePreset.bind(this)
  }

  shouldComponentUpdate (nextProps, { preset: nextPreset }) {
    const { preset } = this.state

    if (_.isEqual(nextProps, this.props) && _.isEqual(preset, nextPreset)) {
      return false
    }

    return true
  }

  componentWillReceiveProps ({ allocationsState }) {
    if (
      this.state.preset.columns.length === 0 &&
      allocationsState.columnFilter.length > 0
    ) {
      const columns = [...allocationsState.columnFilter]

      this.setState({
        preset: {
          ...this.state.preset,
          columns
        }
      })
    }
  }

  componentWillMount () {
    const { presetOn, data, requireUpdate } = this.props.allocationsState

    if (presetOn) {
      const {
        presetName,
        columnFilter,
        orderBy,
        filters
      } = this.props.allocationsState

      const preset = {
        name: presetName,
        orderBy,
        filters,
        columns: columnFilter
      }

      this.setState({
        preset
      })
    }

    if (!data || requireUpdate) {
      const { orderBy, filters, type } = this.props.allocationsState

      this.props.getOrderModel()
      this.props.loadMoreOrders({
        ordersLoaded: 0,
        orderBy,
        filters,
        type
      })
    } else {
      this.props.forceRender()
    }

    this.props.getPresets({
      scene: 'allocations'
    })
  }

  /* PRESET METHODS */

  savePreset () {
    const { savePreset } = this.props
    const { preset } = this.state
    const { name } = preset
    if (!name) {
      alert('Please enter name')
      return
    }
    savePreset({
      preset,
      scene: 'allocations'
    })
  }

  clearPreset () {
    const { allocationsState: { columns } } = this.props
    let parseColumns = columns.map(({ key }) => key)
    this.setState({
      preset: {
        name: '',
        filters: [],
        columns: parseColumns,
        orderBy: 'id'
      }
    })
  }

  removePreset ({ id }) {
    const { removePreset } = this.props
    removePreset({ id })
  }

  choosePreset (preset) {
    const parent = this
    return () => {
      const { name, preset: { columns, orderBy, filters }, id } = preset
      parent.setState({
        preset: {
          name,
          columns,
          orderBy,
          filters,
          id
        }
      })
    }
  }

  /* FILTER METHODS */

  applyFilter () {
    const { type } = this.props.allocationsState
    const { applyOrdersListSettings, loadMoreOrders } = this.props
    const { filters, orderBy, name } = this.state.preset
    /* apply locally */
    applyOrdersListSettings({
      columnFilter: this.state.preset.columns,
      products: [],
      canLoadMore: true,
      filters,
      orderBy,
      name,
      presetOn: true
    })
    /* send to server */
    loadMoreOrders({
      ordersLoaded: 0,
      filters,
      orderBy,
      type
    })
  }

  addFilter () {
    this.setState({
      preset: {
        ...this.state.preset,
        filters: this.state.preset.filters.concat(filterShape)
      }
    })
  }

  removeFilter (index) {
    const parent = this
    return () => {
      const { preset } = parent.state
      let filters = _.reject(preset.filters, (filter, i) => i === index)
      parent.setState({
        preset: {
          ...preset,
          filters
        }
      })
    }
  }

  /* index is used to update data in filters */
  handleChange (name, index) {
    const parent = this
    return ({ target: { value } }) => {
      const { preset } = parent.state
      if (index === undefined) {
        parent.setState({
          preset: {
            ...preset,
            [name]: value
          }
        })
      } else {
        let filters = _.clone(preset.filters)

        filters[index] = {
          ...filters[index],
          [name]: value
        }
        /* if we changed column change also value */
        if (name === 'column') {
          filters[index]['searchKey'] = ''
        }
        parent.setState({
          preset: {
            ...preset,
            filters
          }
        })
      }
    }
  }

  /* GRID METHODS */

  loadMoreOrders () {
    const { ordersLoaded, orderBy, filters, type } = this.props.allocationsState

    this.props.loadMoreOrders({
      ordersLoaded,
      orderBy,
      filters,
      type
    })
  }

  render () {
    const {
      presets,
      columns = [],
      activeColumns,
      canLoadMore,
      data,
      panelsExpanded
    } = this.props.allocationsState

    const push = this.props.push.bind(this)

    const contextMenuItems = [
      {
        name: 'Go to offer details',
        callback: ({ data }) => {
          push({
            pathname: `/order-details`,
            search: `id=${encodeURI(JSON.stringify(data.id))}`
          })
        }
      }
    ]

    return (
      <div>
        <Grid container>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} sm={6}>
                {
                  <ViewSettings
                    defaultExpanded={panelsExpanded}
                    columns={columns}
                    preset={this.state.preset}
                    handleChange={this.handleChange}
                    addFilter={this.addFilter}
                    removeFilter={this.removeFilter}
                    applyFilter={this.applyFilter}
                    clearPreset={this.clearPreset}
                    savePreset={this.savePreset}
                  />
                }
              </Grid>
              <Grid item xs={12} sm={6}>
                <Presets
                  defaultExpanded={panelsExpanded}
                  presets={presets}
                  savePreset={this.savePreset}
                  removePreset={this.removePreset}
                  choosePreset={this.choosePreset}
                  preset={this.state.preset}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <Toolbar>
                <Typography
                  variant='title'
                  className={this.props.classes.tableTitle}
                >
                  Allocations
                </Typography>
              </Toolbar>
              <DataGrid
                // set the title of the table
                // gridTitle='Orders'
                // affects context menu items, e.g. Delete %gridItem%
                gridItem='order'
                showContextMenu
                // columns to be currently shown
                columns={activeColumns}
                rows={data}
                // all possible columns, used for creating new products
                allColumns={columns}
                canLoadMore={canLoadMore}
                loadMoreRows={this.loadMoreOrders.bind(this)}
                contextMenuItems={contextMenuItems}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(AllocationsList)
