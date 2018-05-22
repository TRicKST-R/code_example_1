import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import config from '../../config'
import moment from 'moment'
import CardWithTable from './components/CardWithTable'
import Controls from './components/Controls'

const renderWholesalers = [
  { accessKey: 'company_name', header: 'Name' },
  { accessKey: 'count', header: 'Units' },
  { accessKey: 'ship_date', header: 'Ship Date' }
]

const renderProducts = [
  { accessKey: 'gpa', header: 'Name' },
  { accessKey: 'package', header: 'Package' },
  { accessKey: 'units', header: 'Units' }
]

const styles = theme => ({
  setPadding: {
    paddingTop: '24px'
  }
})

export class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dateFrom: moment().format('MM/DD/YYYY'),
      dateTo: moment().format('MM/DD/YYYY'),
      distributionCenter: ''
    }
    this.timerId = ''
    this.handleLoadMore = this.handleLoadMore.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    const { getDistributionsCenters } = this.props
    getDistributionsCenters()
  }

  /* we have 1 load more for both tables */
  handleLoadMore () {
    const { dateTo, dateFrom, distributionCenter } = this.state

    const {
      loadMore,
      dashboardState: {
        wholesalers: { list: wholesalersList, hasMore: hasMoreWhs },
        products: { list: productsList, hasMore: hasMoreProducts }
      }
    } = this.props

    loadMore({
      dateTo,
      dateFrom,
      distributionCenter,
      wholesalers: {
        offset: wholesalersList.length,
        hasMore: hasMoreWhs
      },
      products: {
        offset: productsList.length,
        hasMore: hasMoreProducts
      }
    })
  }

  handleChange (name) {
    const parent = this
    return ({ target: { value } }) => {
      clearTimeout(parent.timerId)

      parent.setState(state => ({
        ...state,
        [name]: value
      }))
      parent.timerId = setTimeout(() => {
        /* clear list before fetching data with other filters */
        const { resetBreweriesWH } = parent.props
        resetBreweriesWH()
        parent.handleLoadMore()()
      }, config.longerTimeBeforeRequest)
    }
  }

  componentWillUnmount () {
    const { resetBreweriesWH } = this.props
    resetBreweriesWH()
  }

  render () {
    const {
      classes,
      dashboardState: {
        distributionCentersList,
        wholesalers: { list: wholesalersList, hasMore: hasMoreWhs },
        products: { list: productsList, hasMore: hasMoreProducts }
      }
    } = this.props

    const { dateTo, dateFrom, distributionCenter } = this.state

    const prepareDistributionCenters = distributionCentersList.map(
      ({ id: value, dc_name: label, companies }) => ({
        value,
        label: `${label} (${companies})`
      })
    )

    return (
      <div>
        <Controls
          dateFrom={dateFrom}
          dateTo={dateTo}
          distributionCenter={distributionCenter}
          prepareDistributionCenters={prepareDistributionCenters}
          handleChange={this.handleChange}
        />

        <Grid className={classes.setPadding} container>
          <Grid item xs={6}>
            <CardWithTable
              headersKeys={renderWholesalers}
              handleLoadMore={this.handleLoadMore}
              hasMore={hasMoreWhs}
              list={wholesalersList}
            >
              Wholesalers
            </CardWithTable>
          </Grid>
          <Grid item xs={6}>
            <CardWithTable
              headersKeys={renderProducts}
              handleLoadMore={this.handleLoadMore}
              hasMore={hasMoreProducts}
              list={productsList}
            >
              Products
            </CardWithTable>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(Dashboard)
