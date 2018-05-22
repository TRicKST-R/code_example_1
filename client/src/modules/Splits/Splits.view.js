import React, { Component } from 'react'
import Grid from 'material-ui/Grid'
import DataGrid from '../../components/DataGrid'
import ViewSettings from '../../components/ViewSettings'
import Presets from '../../components/Presets'
import _ from 'lodash'
import Paper from 'material-ui/Paper'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'

const filterShape = {
  column: '',
  searchKey: ''
}

export default class Splits extends Component {
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
    this.clearPreset = this.clearPreset.bind(this)
    this.removePreset = this.removePreset.bind(this)
    this.choosePreset = this.choosePreset.bind(this)
    this.loadMore = this.loadMore.bind(this)
  }

  componentWillMount () {
    const {
      getPresets,
      getSplitsColumns,
      forceRender,
      splitsState: {
        data,
        presetOn,
        presetName,
        columnFilter,
        orderBy,
        filters
      }
    } = this.props
    /* if preset already have been loaded */
    if (presetOn) {
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
    /* re-render filtered when we came here again */
    if (data.length === 0) {
      this.loadMore()
    } else {
      forceRender()
    }
    getPresets()
    getSplitsColumns()
  }

  componentWillReceiveProps ({ splitsState }) {
    if (
      this.state.preset.columns.length === 0 &&
      splitsState.columnFilter.length > 0
    ) {
      const columns = [...splitsState.columnFilter]

      this.setState({
        preset: {
          ...this.state.preset,
          columns
        }
      })
    }
  }

  loadMore () {
    const { loadMore, splitsState: { data, orderBy, filters } } = this.props

    loadMore({
      offset: data.length,
      orderBy,
      filters
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
    savePreset(preset)
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

  handleChange (name, index) {
    const parent = this
    return ({ target: { value } }) => {
      const { preset } = parent.state
      /* in case if we have index it means that we edit values in filters  */
      if (index === undefined) {
        parent.setState({
          preset: {
            ...preset,
            [name]: value
          }
        })
      } else {
        /* edit filters */
        /* todo: do we need here to clone filters? */
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

  clearPreset () {
    const { splitsState: { columns } } = this.props
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

  /* FILTER METHODS */
  applyFilter () {
    const { applyListSettings, loadMore } = this.props
    const { filters, orderBy, name } = this.state.preset
    /* apply locally */
    applyListSettings({
      columnFilter: this.state.preset.columns,
      products: [],
      canLoadMore: true,
      filters,
      orderBy,
      name,
      presetOn: true
    })
    /* send to server */
    loadMore({
      offset: 0,
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

  render () {
    const {
      presets,
      columns = [],
      activeColumns,
      canLoadMore,
      data,
      panelsExpanded
    } = this.props.splitsState
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
                <Typography variant='title'>Splits</Typography>
              </Toolbar>
              <DataGrid
                // set the title of the table
                gridTitle='Splits'
                // affects context menu items, e.g. Delete %gridItem%
                gridItem='split'
                // columns to be currently shown
                columns={activeColumns}
                rows={data}
                // all possible columns, used for creating new products
                allColumns={columns}
                canLoadMore={canLoadMore}
                loadMoreRows={this.loadMore}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}
