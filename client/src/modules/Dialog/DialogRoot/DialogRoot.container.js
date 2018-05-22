import { connect } from 'react-redux'
import DialogRoot from './DialogRoot.view'
import { actions } from './DialogRoot.state'
import { bindActionCreators } from 'redux'

export default connect(
  ({ dialogState }) => ({
    dialogState
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) })
)(DialogRoot)
