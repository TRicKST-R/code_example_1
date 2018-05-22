import { connect } from 'react-redux'
import Drawer, { drawerWidth } from './Drawer.view'
import { drawerActions, signIn } from './Drawer.state'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import { signOut } from '../../redux/sessionState'
import { actions } from '../Dialog/DialogRoot/DialogRoot.state'
import { changeUser, removeUser } from '../../root/localUsersReducer'

export { drawerWidth }
export default connect(
  ({ drawerState, session, localUsers }) => ({
    drawerState,
    session,
    localUsers
  }),
  dispatch => ({
    drawerActions: bindActionCreators(drawerActions, dispatch),
    push: bindActionCreators(push, dispatch),
    signOut: bindActionCreators(signOut, dispatch),
    showDialog: bindActionCreators(actions.showDialog, dispatch),
    signIn: bindActionCreators(signIn, dispatch),
    changeUser: bindActionCreators(changeUser, dispatch),
    removeUser: bindActionCreators(removeUser, dispatch)
  })
)(Drawer)
