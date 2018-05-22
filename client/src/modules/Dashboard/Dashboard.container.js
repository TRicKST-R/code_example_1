import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import DashboardView from './Dashboard.view'
import {
  getDistributionsCenters,
  resetBreweriesWH,
  loadMore
} from './Dashboard.state'
import { push } from 'react-router-redux'

export default connect(
  state => ({
    dashboardState: state.dashboardState
  }),
  dispatch => ({
    getDistributionsCenters: bindActionCreators(
      getDistributionsCenters,
      dispatch
    ),
    loadMore: bindActionCreators(loadMore, dispatch),
    resetBreweriesWH: bindActionCreators(resetBreweriesWH, dispatch),
    push: bindActionCreators(push, dispatch)
  })
)(DashboardView)
