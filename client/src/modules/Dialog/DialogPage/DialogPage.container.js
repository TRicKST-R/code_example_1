import { connect } from 'react-redux'
import DialogPage from './DialogPage.view'
import { actions } from '../DialogRoot/DialogRoot.state'

export default connect(null, actions)(DialogPage)
