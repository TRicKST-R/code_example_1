import React, { Component } from 'react'
import Grid from 'material-ui/Grid'
import DataGrid from '../../components/DataGrid'
import ViewSettings from '../../components/ViewSettings'
import Presets from '../../components/Presets'
import Select from '../../components/SharedSelectTextField'

import _ from 'lodash'

import Modal from 'material-ui/Modal'
import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import config from '../../config'

const filterShape = {
  column: '',
  searchKey: ''
}

const styles = {
  marginTop: {
    marginTop: '10px'
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '10px',
    paddingTop: '24px',
    paddingLeft: '24px',
    paddingRight: '24px'
  },
  countInput: {
    margin: '0'
  },
  center: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  tableTitle: {
    flex: 1
  },
  toolbar: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: '0px',
    paddingRight: '0px'
  }
}

const { roles: { brewery, wholesaler } } = config

class ProductsList extends Component {
  /* LIFECYCLE METHODS */

  constructor (props) {
    super(props)
    this.state = {
      preset: {
        name: '',
        columns: [],
        orderBy: 'id',
        filters: []
      },
      modalOpen: false,
      modal: null,
      product: null,
      count: 0,
      selectedWH: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.addFilter = this.addFilter.bind(this)
    this.savePreset = this.savePreset.bind(this)
    this.removeFilter = this.removeFilter.bind(this)
    this.applyFilter = this.applyFilter.bind(this)
    this.removePreset = this.removePreset.bind(this)
    this.clearPreset = this.clearPreset.bind(this)
    this.choosePreset = this.choosePreset.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.loadMoreProducts = this.loadMoreProducts.bind(this)
  }

  shouldComponentUpdate (nextProps, { preset: nextPreset }) {
    // consider revision here !!!
    // const { preset } = this.state

    // if (_.isEqual(nextProps, this.props) && _.isEqual(preset, nextPreset)) {
    //   return false
    // }

    return true
  }

  componentWillReceiveProps ({ productsListState }) {
    if (
      this.state.preset.columns.length === 0 &&
      productsListState.columnFilter.length > 0
    ) {
      const columns = [...productsListState.columnFilter]

      this.setState({
        preset: {
          ...this.state.preset,
          columns
        }
      })
    }
  }

  componentWillMount () {
    if (this.props.productsListState.presetOn) {
      const {
        presetName,
        columnFilter,
        orderBy,
        filters
      } = this.props.productsListState

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

    if (!this.props.productsListState.data) {
      this.props.getProductModel()
      this.props.loadMoreProducts({
        productsLoaded: 0,
        orderBy: this.props.productsListState.orderBy
      })
    } else {
      this.props.forceRender()
    }

    this.props.getPresets({
      scene: 'products'
    })

    if (this.props.session.role.toLowerCase() === 'brewery') {
      const brwId = this.props.session.company_id
      console.log(brwId)
      this.props.getWholesalers({
        brwId
      })
    }
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
      scene: 'products'
    })
  }

  clearPreset () {
    const { productsListState: { columns } } = this.props
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
    const { applyProductsListSettings, loadMoreProducts } = this.props
    const { filters, orderBy, name } = this.state.preset
    /* apply locally */
    applyProductsListSettings({
      columnFilter: this.state.preset.columns,
      products: [],
      canLoadMore: true,
      filters,
      orderBy,
      name,
      presetOn: true
    })
    /* send to server */
    loadMoreProducts({
      productsLoaded: 0,
      filters,
      orderBy
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

  loadMoreProducts () {
    const { productsLoaded, orderBy, filters } = this.props.productsListState

    this.props.loadMoreProducts({
      productsLoaded,
      orderBy,
      filters
    })
  }

  // MODALS

  callModal (modal) {
    this.setState({
      modalOpen: true,
      modal
    })
  }

  closeModal (e) {
    switch (this.state.modal) {
      case 'enterCount':
        this.setState({
          count: 1,
          product: null
        })
        break
      default:
        break
    }

    this.setState({
      modalOpen: false,
      modal: null
    })
  }

  // ADDING PRODUCT TO ORDER

  handleAddProduct (type, e) {
    let value = e.target.value

    this.setState({
      [type]: value
    })
  }

  handleProduct () {
    const { product, count, selectedWH } = this.state
    const { company_id, role } = this.props.session

    if (!selectedWH && role.toLowerCase() === 'brewery') {
      alert('Please enter wholesaler')
      return
    }

    this.props.addToOrder({
      product,
      count,
      company_id,
      role,
      selectedWH
    })
    this.closeModal()
  }

  getContextMenuItems () {
    const { role } = this.props.session
    const callModal = this.callModal.bind(this)

    const push = this.props.push.bind(this)
    console.log('role: ', role)
    const contextMenuItems =
      role === brewery
        ? [
          {
            name: 'Go to product details',
            callback: ({ data }) => {
              push({
                pathname: `/product-details`,
                state: data,
                search: `id=${data.id}&brew=${data.brew}&breweryId=${data.breweryId}`
              })
            }
          }
        ]
        : []

    if (role === wholesaler) {
      contextMenuItems.push({
        name: 'Add to orders',
        callback: product => {
          callModal('enterCount')

          this.setState({
            product
          })
        }
      })
    }

    return contextMenuItems
  }

  render () {
    const {
      presets,
      columns = [],
      activeColumns,
      canLoadMore,
      data,
      panelsExpanded,
      wholesalers
    } = this.props.productsListState

    const { count, selectedWH } = this.state

    const contextMenuItems = this.getContextMenuItems()
    console.log('contextMenuItems: ', contextMenuItems)
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
                  Products
                </Typography>
              </Toolbar>
              <DataGrid
                // set the title of the table
                // gridTitle='Products'
                // affects context menu items, e.g. Delete %gridItem%
                gridItem='product'
                showContextMenu
                // columns to be currently shown
                columns={activeColumns}
                rows={data}
                // all possible columns, used for creating new products
                allColumns={columns}
                canLoadMore={canLoadMore}
                loadMoreRows={this.loadMoreProducts}
                deleteRows={this.props.deleteProducts}
                updateRow={this.props.updateProduct}
                addRow={this.props.addProduct}
                contextMenuItems={contextMenuItems}
              />
            </Paper>
          </Grid>
          <Modal open={this.state.modalOpen} onBackdropClick={this.closeModal}>
            <div>
              {this.state.modal === 'enterCount' && (
                <Paper className={this.props.classes.modal}>
                  <div className={this.props.classes.center}>
                    <TextField
                      className={this.props.classes.countInput}
                      fullWidth
                      id='product_count'
                      label='Product count'
                      value={count}
                      onChange={this.handleAddProduct.bind(this, 'count')}
                      InputLabelProps={{
                        shrink: true
                      }}
                      margin='normal'
                    />
                  </div>
                  {wholesalers.length > 0 && (
                    <Select
                      data={wholesalers.map(wh => ({
                        label: wh.name,
                        value: wh.company_id
                      }))}
                      handleChange={this.handleAddProduct.bind(
                        this,
                        'selectedWH'
                      )}
                      value={selectedWH}
                      label='Select wholesaler'
                    />
                  )}
                  <Toolbar className={this.props.classes.toolbar}>
                    <Button
                      onClick={this.closeModal}
                      color='primary'
                      title='Cancel'
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={this.handleProduct.bind(this)}
                      color='primary'
                      title='OK'
                    >
                      OK
                    </Button>
                  </Toolbar>
                </Paper>
              )}
            </div>
          </Modal>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(ProductsList)
