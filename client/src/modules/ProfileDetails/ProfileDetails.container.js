import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ProfileDetailsView from './ProfileDetails.view'
import { profileDetails } from './ProfileDetails.state'
import { push } from 'react-router-redux'

export default connect(
  state => ({
    profileDetailsState: state.profileDetailsState
  }),
  dispatch => ({
    profileDetails: bindActionCreators(profileDetails, dispatch),
    push: bindActionCreators(push, dispatch)
  })
)(ProfileDetailsView)
