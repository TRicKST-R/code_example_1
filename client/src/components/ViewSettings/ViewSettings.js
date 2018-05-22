import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions
} from 'material-ui/ExpansionPanel'
import Typography from 'material-ui/Typography'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Button from 'material-ui/Button'
import Divider from 'material-ui/Divider'
import SharedMultipleSelect from '../../components/SharedMultipleSelect'
import SharedSelect from '../../components/SharedSelectTextField'
import Grid from 'material-ui/Grid'
import FilterItem from './FiltersItem'
import TextField from 'material-ui/TextField'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  details: {
    alignItems: 'center'
  }
})

class ViewSettings extends Component {
  render () {
    const {
      classes,
      handleChange,
      columns,
      preset: { columns: selectedValues, orderBy, filters, name, id },
      addFilter,
      clearPreset,
      removeFilter,
      applyFilter,
      defaultExpanded,
      savePreset
    } = this.props

    const prepareValuesForSelect = columns.map(({ key }) => ({
      label: key,
      value: key
    }))

    const saveBtnText = id ? 'Update preset' : 'Save preset'

    return (
      <div className={classes.root}>
        <ExpansionPanel defaultExpanded={defaultExpanded}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='title'>Sort and filter</Typography>
          </ExpansionPanelSummary>

          <ExpansionPanelDetails className={classes.details}>
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  value={name}
                  id='name'
                  label='Preset name'
                  fullWidth
                  onChange={handleChange('name')}
                />
              </Grid>
              <Grid item xs={12}>
                <SharedMultipleSelect
                  options={prepareValuesForSelect}
                  handleChange={handleChange('columns')}
                  selectedValues={selectedValues}
                  label='Columns'
                />
              </Grid>
              <Grid item xs={12}>
                <SharedSelect
                  data={prepareValuesForSelect}
                  handleChange={handleChange('orderBy')}
                  value={orderBy}
                  label='Order by'
                />
              </Grid>
              <Grid item xs={12}>
                {filters.map((filter, index) => (
                  <FilterItem
                    key={index}
                    columns={prepareValuesForSelect}
                    handleChange={handleChange}
                    filter={filter}
                    index={index}
                    removeFilter={removeFilter(index)}
                    entireColumns={columns}
                  />
                ))}

                <Grid container justify='flex-end'>
                  <Button
                    style={{ marginTop: '5px' }}
                    onClick={addFilter}
                    variant='raised'
                    color='default'
                    title='Add filter'
                  >
                    Add filter
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>

          <Divider />
          <ExpansionPanelActions>
            <Grid container justify='space-between'>
              <Grid item>
                <Button onClick={clearPreset} size='medium' color='primary'>
                  New preset
                </Button>
                <Button onClick={savePreset} size='medium' color='primary'>
                  {saveBtnText}
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={applyFilter} size='medium' color='primary'>
                  Apply
                </Button>
              </Grid>
            </Grid>
          </ExpansionPanelActions>
        </ExpansionPanel>
      </div>
    )
  }
}

export default withStyles(styles)(ViewSettings)
