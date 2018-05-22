import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TransfersView from './Transfers.view'
import { loadTransfers, showMoreTransfers } from './Transfers.state'

export default connect(
  ({ transfersState, session }) => ({
    transfers: transfersState,
    session
  }),
  dispatch => ({
    loadTransfers: bindActionCreators(loadTransfers, dispatch),
    showMoreTransfers: bindActionCreators(showMoreTransfers, dispatch)
  })
)(TransfersView)
