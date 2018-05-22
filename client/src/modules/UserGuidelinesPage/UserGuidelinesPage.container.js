import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import UserGuidlinesPage from './UserGuidelinesPage.view'
import { loadGuides, reset } from './UserGuidelinesPage.state'
import { setFilter } from '../navigation'

export default connect(
  ({ guidlines }) => ({
    guidlines
  }),
  dispatch => ({
    loadGuides: bindActionCreators(loadGuides, dispatch),
    reset: bindActionCreators(reset, dispatch),
    setFilter: bindActionCreators(setFilter, dispatch)
  })
)(UserGuidlinesPage)
