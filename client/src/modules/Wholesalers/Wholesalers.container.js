import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import WholesalersView from './Wholesalers.view'
import { loadWholesalers, showMoreWholesalers } from './Wholesalers.state'

export default connect(
  ({ wholesalersState, session }) => ({
    wholesalers: wholesalersState,
    session
  }),
  dispatch => ({
    loadWholesalers: bindActionCreators(loadWholesalers, dispatch),
    showMoreWholesalers: bindActionCreators(showMoreWholesalers, dispatch)
  })
)(WholesalersView)
