import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import UsersListView from './UsersList.view'
import { usersList } from './UsersList.state'
import { push } from 'react-router-redux'

export default connect(
  state => ({
    usersListState: state.usersListState
  }),
  dispatch => ({
    usersList: bindActionCreators(usersList, dispatch),
    push: bindActionCreators(push, dispatch)
  })
)(UsersListView)
