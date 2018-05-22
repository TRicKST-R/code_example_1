import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BreweriesView from './Breweries.view'
import {
  loadBreweries,
  showMoreBreweries,
  resetBreweries
} from './Breweries.state'

export default connect(
  ({ breweriesState, session }) => ({
    breweries: breweriesState,
    session
  }),
  dispatch => ({
    loadBreweries: bindActionCreators(loadBreweries, dispatch),
    showMoreBreweries: bindActionCreators(showMoreBreweries, dispatch),
    resetBreweries: bindActionCreators(resetBreweries, dispatch)
  })
)(BreweriesView)
