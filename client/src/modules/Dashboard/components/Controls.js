import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Card, { CardContent } from 'material-ui/Card'
import Grid from 'material-ui/Grid'
import SharedSelect from '../../../components/SharedSelectTextField'
import DateInput from './../components/DateInput'
import PropTypes from 'prop-types'

const styles = theme => ({
  card: {
    minWidth: 275
  },
  inputStyle: {
    marginRight: '8px',
    marginLeft: '8px'
  },
  marginTop8: {
    marginTop: '8px'
  }
})

class Controls extends Component {
  render () {
    const {
      classes,
      dateTo,
      dateFrom,
      distributionCenter = '',
      prepareDistributionCenters = [],
      handleChange
    } = this.props

    return (
      <Grid container>
        <Grid className={classes.marginTop8} xs={12} item>
          <Card className={classes.card}>
            <CardContent>
              <Grid container>
                <DateInput
                  handleChange={handleChange('dateFrom')}
                  label={'Date from'}
                  value={dateFrom}
                />
                <DateInput
                  handleChange={handleChange('dateTo')}
                  label={'Date to'}
                  value={dateTo}
                />
                <Grid item xs={12} md={6}>
                  <SharedSelect
                    data={prepareDistributionCenters}
                    handleChange={handleChange('distributionCenter')}
                    value={distributionCenter}
                    label={'Distribution Center'}
                    inputStyles={classes.inputStyle}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
}

Controls.propTypes = {
  dateTo: PropTypes.string,
  dateFrom: PropTypes.string,
  distributionCenter: PropTypes.number,
  prepareDistributionCenters: PropTypes.array,
  handleChange: PropTypes.func
}

export default withStyles(styles)(Controls)
