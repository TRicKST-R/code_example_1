import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import UserDetailsView from './UserDetails.view'
import { userDetails } from './UserDetails.state'
import { push } from 'react-router-redux'

export default connect(
  state => ({
    userDetailsState: state.userDetailsState
  }),
  dispatch => ({
    userDetails: bindActionCreators(userDetails, dispatch),
    push: bindActionCreators(push, dispatch)
  })
)(UserDetailsView)
