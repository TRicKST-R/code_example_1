import React, { Component } from 'react'
import Grid from 'material-ui/Grid'
import SharedSelect from '../../components/SharedSelectTextField'
import IconButton from 'material-ui/IconButton'
import RmBtn from 'material-ui-icons/Close'
import TextField from 'material-ui/TextField'
import _ from 'lodash'

export default class FiltersItem extends Component {
  render () {
    /* columns = prepared for select, entireColumns - full column object */
    const {
      columns,
      entireColumns,
      handleChange,
      filter: { column, searchKey },
      index,
      removeFilter
    } = this.props

    let columnWithOptions = _.find(
      entireColumns,
      ({ options, key }) => column === key && !!options
    )

    let search = (
      <TextField
        value={searchKey}
        id='keyword'
        label='Search'
        fullWidth
        margin='normal'
        onChange={handleChange('searchKey', index)}
      />
    )
    if (columnWithOptions) {
      search = (
        <SharedSelect
          data={columnWithOptions.options.map(
            ({ id: value, title: label }) => ({
              label,
              value
            })
          )}
          label={'Search'}
          handleChange={handleChange('searchKey', index)}
          value={searchKey}
        />
      )
    }

    return (
      <Grid container alignItems='center'>
        <Grid item xs={1}>
          <Grid container justify='space-around'>
            <IconButton onClick={removeFilter}>
              <RmBtn />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <SharedSelect
            data={columns}
            value={column}
            label='Column'
            handleChange={handleChange('column', index)}
          />
        </Grid>
        <Grid item xs={7}>
          {search}
        </Grid>
      </Grid>
    )
  }
}
